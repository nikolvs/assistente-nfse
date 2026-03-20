const version = browser.runtime.getManifest().version;

export default function Footer() {
  return (
    <footer className="px-4 py-1 flex items-center justify-between">
      <span className="text-[10px] text-gray-300">
        Desenvolvido por{' '}
        <a
          href="https://nkls.dev"
          target="_blank"
          rel="noreferrer"
          className="hover:underline hover:text-gray-400 transition-colors"
        >
          nkls.dev
        </a>
      </span>
      <span className="text-[10px] text-gray-300">v{version}</span>
    </footer>
  );
}
