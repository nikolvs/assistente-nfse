import { useState, useEffect, useRef } from 'react';
import './App.css';

function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

type PageInfo = { total: number; count: number; totalPages: number };

type AppState =
  | { phase: 'loading' }
  | { phase: 'unsupported' }
  | { phase: 'file-access-needed' }
  | { phase: 'ready'; info: PageInfo }
  | { phase: 'summing'; info: PageInfo; current: number; total: number; accumulated: number }
  | { phase: 'done'; info: PageInfo; grandTotal: number; grandCount: number; pages: number }
  | { phase: 'error'; message: string };

export default function App() {
  const [state, setState] = useState<AppState>({ phase: 'loading' });
  const tabIdRef = useRef<number | null>(null);
  const portRef = useRef<ReturnType<typeof browser.tabs.connect> | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
        tabIdRef.current = tab?.id ?? null;

        if (!tabIdRef.current) {
          setState({ phase: 'unsupported' });
          return;
        }

        try {
          const response = await browser.tabs.sendMessage(tabIdRef.current, {
            type: 'GET_PAGE_INFO',
          });
          setState({ phase: 'ready', info: response });
        } catch {
          const isFileUrl = tab.url?.startsWith('file://') ?? false;
          setState({ phase: isFileUrl ? 'file-access-needed' : 'unsupported' });
        }
      } catch {
        setState({ phase: 'unsupported' });
      }
    }

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
          info: (prev as Extract<AppState, { phase: 'ready' }>).info,
          current: msg.current,
          total: msg.total,
          accumulated: msg.accumulated,
        }));
      } else if (msg.type === 'DONE') {
        setState((prev) => ({
          phase: 'done',
          info: (prev as Extract<AppState, { phase: 'summing' }>).info,
          grandTotal: msg.total,
          grandCount: msg.count,
          pages: msg.pages,
        }));
        port.disconnect();
      } else if (msg.type === 'ERROR') {
        setState({ phase: 'error', message: msg.message });
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
      info: (prev as Extract<AppState, { phase: 'summing' }>).info,
    }));
  }

  function handleReset() {
    setState((prev) => {
      const info = (prev as Extract<AppState, { info: PageInfo }>).info ?? {
        total: 0,
        count: 0,
        totalPages: 1,
      };
      return { phase: 'ready', info };
    });
  }

  if (state.phase === 'loading') {
    return (
      <div className="container">
        <div className="spinner-wrap">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  if (state.phase === 'file-access-needed') {
    return (
      <div className="container">
        <div className="unsupported">
          <div className="unsupported-icon">🔒</div>
          <p>Para usar em arquivos locais, ative o <strong>acesso a URLs de arquivo</strong> nas configurações da extensão.</p>
          <a
            href="chrome://extensions"
            onClick={(e) => {
              e.preventDefault();
              browser.tabs.create({ url: 'chrome://extensions' });
            }}
            className="link"
          >
            Abrir configurações →
          </a>
        </div>
      </div>
    );
  }

  if (state.phase === 'unsupported') {
    return (
      <div className="container">
        <div className="unsupported">
          <div className="unsupported-icon">📄</div>
          <p>Abra a página de <strong>Notas Emitidas</strong> do NFS-e para usar esta extensão.</p>
          <a
            href="https://www.nfse.gov.br/EmissorNacional/Notas/Emitidas"
            target="_blank"
            rel="noreferrer"
            className="link"
          >
            Ir para o NFS-e →
          </a>
        </div>
      </div>
    );
  }

  const info = (state as Extract<AppState, { info: PageInfo }>).info;

  return (
    <div className="container">
      <header className="header">
        <span className="header-title">Assistente NFS-e</span>
      </header>

      <div className="body">
        <section className="section">
          <div className="label">Página atual</div>
          <div className="value">{formatBRL(info.total)}</div>
          <div className="meta">
            {info.count} nota{info.count !== 1 ? 's' : ''}
            {info.totalPages > 1 && (
              <span className="pages-badge">{info.totalPages} páginas</span>
            )}
          </div>
        </section>

        <div className="divider" />

        {state.phase === 'ready' && (
          <>
            {info.totalPages > 1 ? (
              <button className="btn-primary" onClick={handleSumAll}>
                Somar todas as notas
              </button>
            ) : (
              <div className="single-page-note">Apenas 1 página de resultados</div>
            )}
          </>
        )}

        {state.phase === 'summing' && (
          <section className="section">
            <div className="label">Somando todas as notas…</div>
            <div className="progress-wrap">
              <div
                className="progress-fill"
                style={{ width: `${(state.current / state.total) * 100}%` }}
              />
            </div>
            <div className="progress-text">
              Página {state.current} de {state.total}
              {state.accumulated > 0 && (
                <span className="accent"> · {formatBRL(state.accumulated)}</span>
              )}
            </div>
            <button className="btn-ghost btn-danger" onClick={handleCancel}>
              Cancelar
            </button>
          </section>
        )}

        {state.phase === 'done' && (
          <section className="section">
            <div className="label">Total geral</div>
            <div className="value value-success">{formatBRL(state.grandTotal)}</div>
            <div className="meta">
              {state.grandCount} nota{state.grandCount !== 1 ? 's' : ''} em {state.pages}{' '}
              página{state.pages !== 1 ? 's' : ''}
            </div>
            <button className="btn-ghost" onClick={handleReset}>
              Recalcular
            </button>
          </section>
        )}

        {state.phase === 'error' && (
          <section className="section">
            <div className="error-box">{state.message}</div>
            <button className="btn-ghost" onClick={handleReset}>
              Tentar novamente
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
