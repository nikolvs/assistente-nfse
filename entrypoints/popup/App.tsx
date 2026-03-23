import { useState, useEffect, useRef } from 'react';
import type { AppState, PageInfo } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingView from './components/LoadingView';
import FileAccessView from './components/FileAccessView';
import SiteAccessView from './components/SiteAccessView';
import UnsupportedView from './components/UnsupportedView';
import CurrentPageSection from './components/CurrentPageSection';
import ReadySection from './components/ReadySection';
import SummingSection from './components/SummingSection';
import DoneSection from './components/DoneSection';
import ErrorSection from './components/ErrorSection';

function sendMessageWithTimeout(tabId: number, message: unknown, ms = 1000): Promise<PageInfo> {
  return Promise.race([
    browser.tabs.sendMessage(tabId, message) as Promise<PageInfo>,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
  ]);
}

async function getPageInfo(tabId: number, retries = 5, delay = 400): Promise<PageInfo> {
  for (let i = 0; i < retries; i++) {
    try {
      return await sendMessageWithTimeout(tabId, { type: 'GET_PAGE_INFO' });
    } catch {
      if (i < retries - 1) await new Promise((r) => setTimeout(r, delay));
      else throw new Error('Content script unavailable');
    }
  }
  throw new Error('Content script unavailable');
}

export default function App() {
  const [state, setState] = useState<AppState>({ phase: 'loading' });
  const tabIdRef = useRef<number | null>(null);
  const portRef = useRef<ReturnType<typeof browser.tabs.connect> | null>(null);

  async function init() {
    setState({ phase: 'loading' });
    try {
      const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
      tabIdRef.current = tab?.id ?? null;

      if (!tabIdRef.current) {
        setState({ phase: 'unsupported' });
        return;
      }

      try {
        const response = await getPageInfo(tabIdRef.current);
        setState({ phase: 'ready', info: response });
      } catch (err) {
          const url = tab.url ?? '';
          if (url.startsWith('file://') && import.meta.env.DEV) {
            setState({ phase: 'file-access-needed' });
          } else if (url.includes('nfse.gov.br/EmissorNacional/Notas/Emitidas')) {
            setState({ phase: 'site-access-needed' });
          } else {
            setState({ phase: 'unsupported' });
          }
      }
    } catch {
      setState({ phase: 'unsupported' });
    }
  }

  useEffect(() => {
    init();
    return () => {
      portRef.current?.disconnect();
    };
  }, []);

  function handleSumAll() {
    if (!tabIdRef.current) return;

    const port = browser.tabs.connect(tabIdRef.current, { name: 'nfse-sum-all' });
    portRef.current = port;
    port.postMessage({ type: 'SUM_ALL' });

    port.onMessage.addListener((msg) => {
      if (msg.type === 'PROGRESS') {
        setState((prev) => ({
          phase: 'summing',
          info: (prev as Extract<AppState, { info: PageInfo }>).info,
          current: msg.current,
          total: msg.total,
          accumulated: msg.accumulated,
        }));
      } else if (msg.type === 'DONE') {
        setState((prev) => ({
          phase: 'done',
          info: (prev as Extract<AppState, { info: PageInfo }>).info,
          grandTotal: msg.total,
          grandCount: msg.count,
          pages: msg.pages,
        }));
        port.disconnect();
      } else if (msg.type === 'ERROR') {
        setState((prev) => ({
          phase: 'error',
          info: (prev as Extract<AppState, { info: PageInfo }>).info,
          message: msg.message,
        }));
        port.disconnect();
      }
    });

    port.onDisconnect.addListener(() => {
      portRef.current = null;
    });
  }

  function handleCancel() {
    portRef.current?.postMessage({ type: 'CANCEL' });
    portRef.current?.disconnect();
    portRef.current = null;
    setState((prev) => ({
      phase: 'ready',
      info: (prev as Extract<AppState, { info: PageInfo }>).info,
    }));
  }

  function handleReset() {
    setState((prev) => ({
      phase: 'ready',
      info: (prev as Extract<AppState, { info: PageInfo }>).info ?? {
        total: 0,
        count: 0,
        totalPages: 1,
      },
    }));
  }

  const info = state.phase !== 'loading' && state.phase !== 'file-access-needed' && state.phase !== 'site-access-needed' && state.phase !== 'unsupported'
    ? (state as Extract<AppState, { info: PageInfo }>).info
    : null;

  return (
    <div className="w-full border-x border-y-2 border-black">
      <Header />

      <div className="px-4 pt-3.5 flex flex-col gap-3">
        {state.phase === 'loading' && <LoadingView />}
        {state.phase === 'file-access-needed' && <FileAccessView />}
        {state.phase === 'site-access-needed' && <SiteAccessView />}
        {state.phase === 'unsupported' && <UnsupportedView />}

        {info && (
          <>
            <CurrentPageSection info={info} />

            <div className="h-px bg-gray-100" />

            {state.phase === 'ready' && (
              <ReadySection totalPages={info.totalPages} onSumAll={handleSumAll} />
            )}

            {state.phase === 'summing' && (
              <SummingSection
                current={state.current}
                total={state.total}
                accumulated={state.accumulated}
                onCancel={handleCancel}
              />
            )}

            {state.phase === 'done' && (
              <DoneSection
                grandTotal={state.grandTotal}
                grandCount={state.grandCount}
                pages={state.pages}
                onReset={handleReset}
              />
            )}

            {state.phase === 'error' && (
              <ErrorSection message={state.message} onReset={handleReset} />
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
