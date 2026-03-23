import { ArrowRightIcon, ShieldExclamationIcon } from '@heroicons/react/24/solid';
import { getExtensionsPageUrl } from '../utils';
import Link from '~/components/Link';

export default function SiteAccessView() {
  return (
    <div className="flex flex-col items-center text-center gap-2.5 px-4 py-6">
      <ShieldExclamationIcon className="w-8 h-8" />
      <p className="text-[13px] text-gray-500 leading-relaxed">
        Permita o <strong className="text-gray-800">acesso ao site</strong> nas configurações da
        extensão para que ela possa ler as notas fiscais.
      </p>
      <Link onClick={() => browser.tabs.create({ url: getExtensionsPageUrl() })}>
        Abrir configurações <ArrowRightIcon className="inline w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
