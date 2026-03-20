export default function UnsupportedView() {
  return (
    <div className="flex flex-col items-center text-center gap-2.5 px-4 py-6">
      <span className="text-3xl">📄</span>
      <p className="text-[13px] text-gray-500 leading-relaxed">
        Abra a página de <strong className="text-gray-800">Notas Emitidas</strong> do NFS-e para
        usar esta extensão.
      </p>
      <a
        href="https://www.nfse.gov.br/EmissorNacional/Notas/Emitidas"
        target="_blank"
        rel="noreferrer"
        className="cursor-pointer text-[13px] font-semibold text-black hover:underline"
      >
        Ir para o NFS-e →
      </a>
    </div>
  );
}
