export default defineContentScript({
  matches: [
    'https://www.nfse.gov.br/EmissorNacional/Notas/Emitidas*',
    ...(import.meta.env.DEV ? ['file://*/*'] : []),
  ],
  main() {
    function parseBRL(text: string): number {
      const value = parseFloat(text.trim().replace(/\./g, '').replace(',', '.'));
      return isNaN(value) ? 0 : value;
    }

    function sumValuesFromDoc(doc: Document): { total: number; count: number } {
      let total = 0;
      let count = 0;
      doc.querySelectorAll('td.td-valor').forEach((cell) => {
        const value = parseBRL(cell.textContent ?? '');
        if (value > 0) {
          total += value;
          count++;
        }
      });
      return { total, count };
    }

    function countPagesFromDoc(doc: Document): number {
      const items = doc.querySelectorAll('ul.pagination li');
      const pageItems = Array.from(items).filter((li) =>
        /^\s*\d+\s*$/.test(li.textContent ?? ''),
      );
      return Math.max(pageItems.length, 1);
    }

    function buildPageUrl(pageNum: number): string {
      const url = new URL(window.location.href);
      if (pageNum <= 1) {
        url.searchParams.delete('pg');
      } else {
        url.searchParams.set('pg', String(pageNum));
      }
      return url.toString();
    }

    browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message.type === 'GET_PAGE_INFO') {
        const pageSum = sumValuesFromDoc(document);
        const totalPages = countPagesFromDoc(document);
        sendResponse({ ...pageSum, totalPages });
        return true;
      }
    });

    browser.runtime.onConnect.addListener((port) => {
      if (port.name !== 'nfse-sum-all') return;

      let abortController: AbortController | null = null;

      port.onMessage.addListener(async (msg) => {
        if (msg.type === 'SUM_ALL') {
          abortController = new AbortController();
          const { signal } = abortController;

          try {
            const page1Res = await fetch(buildPageUrl(1), { signal });
            const page1Doc = new DOMParser().parseFromString(
              await page1Res.text(),
              'text/html',
            );

            const pages = countPagesFromDoc(page1Doc);
            const page1Sum = sumValuesFromDoc(page1Doc);
            let grandTotal = page1Sum.total;
            let grandCount = page1Sum.count;

            port.postMessage({ type: 'PROGRESS', current: 1, total: pages, accumulated: grandTotal });

            for (let p = 2; p <= pages; p++) {
              if (signal.aborted) return;

              const res = await fetch(buildPageUrl(p), { signal });
              const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
              const pageSum = sumValuesFromDoc(doc);

              grandTotal += pageSum.total;
              grandCount += pageSum.count;

              port.postMessage({ type: 'PROGRESS', current: p, total: pages, accumulated: grandTotal });
            }

            port.postMessage({ type: 'DONE', total: grandTotal, count: grandCount, pages });
          } catch (err) {
            if ((err as Error).name === 'AbortError') return;
            port.postMessage({ type: 'ERROR', message: 'Erro ao buscar as notas. Tente novamente.' });
          }
        }

        if (msg.type === 'CANCEL') {
          abortController?.abort();
        }
      });

      port.onDisconnect.addListener(() => {
        abortController?.abort();
      });
    });
  },
});
