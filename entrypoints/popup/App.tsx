import { useState, useEffect, useRef } from 'react';
import type { AppState, PageInfo } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingView from './components/LoadingView';
import FileAccessView from './components/FileAccessView';
import UnsupportedView from './components/UnsupportedView';
import CurrentPageSection from './components/CurrentPageSection';
import ReadySection from './components/ReadySection';
import SummingSection from './components/SummingSection';
import DoneSection from './components/DoneSection';
import ErrorSection from './components/ErrorSection';

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
          const isFileUrl = (tab.url?.startsWith('file://') ?? false) && import.meta.env.DEV;
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

  if (state.phase === 'loading') return <LoadingView />;
  if (state.phase === 'file-access-needed') return <FileAccessView />;
  if (state.phase === 'unsupported') return <UnsupportedView />;

  const info = (state as Extract<AppState, { info: PageInfo }>).info;

  return (
    <div className="w-full border-x border-y-2 border-black">
      <Header />

      <div className="px-4 pt-3.5 flex flex-col gap-3">
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
      </div>

      <Footer />
    </div>
  );
}
