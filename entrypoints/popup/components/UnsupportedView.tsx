import { ArrowTopRightOnSquareIcon, DocumentTextIcon } from '@heroicons/react/24/solid';
import Link from '~/components/Link';

export default function UnsupportedView() {
  return (
    <div className="flex flex-col items-center text-center gap-2.5 px-4 py-6">
      <DocumentTextIcon className="w-8 h-8" />
      <p className="text-[13px] text-gray-500 leading-relaxed">
        Abra a página de <strong className="text-gray-800">Notas Emitidas</strong> do NFS-e para
        usar esta extensão.
      </p>
      <Link href="https://www.nfse.gov.br/EmissorNacional/Notas/Emitidas">
        Ir para o NFS-e <ArrowTopRightOnSquareIcon className="inline w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
