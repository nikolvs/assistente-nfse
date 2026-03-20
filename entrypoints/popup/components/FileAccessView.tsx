import { getExtensionsPageUrl } from '../utils';

export default function FileAccessView() {
  return (
    <div className="flex flex-col items-center text-center gap-2.5 px-4 py-6">
      <span className="text-3xl">🔒</span>
      <p className="text-[13px] text-gray-500 leading-relaxed">
        Para usar em arquivos locais, ative o{' '}
        <strong className="text-gray-800">acesso a URLs de arquivo</strong> nas configurações da
        extensão.
      </p>
      <button
        onClick={() => browser.tabs.create({ url: getExtensionsPageUrl() })}
        className="cursor-pointer text-[13px] font-semibold text-black hover:underline"
      >
        Abrir configurações →
      </button>
    </div>
  );
}
