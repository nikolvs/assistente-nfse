const APP_NAME = import.meta.env.VITE_APP_NAME ?? 'Assistente NFS-e';

export default function Header() {
  return (
    <header className="bg-black px-4 py-3">
      <span className="text-[11px] font-bold uppercase tracking-[0.05em] text-white">
        {APP_NAME}
      </span>
    </header>
  );
}
