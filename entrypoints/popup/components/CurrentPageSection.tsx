import { formatBRL } from '../utils';
import type { PageInfo } from '../types';

type Props = { info: PageInfo };

export default function CurrentPageSection({ info }: Props) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
        Página atual
      </p>
      <p className="text-[22px] font-bold text-black leading-tight">
        <span className="text-sm font-semibold text-gray-400 mr-0.5">R$</span>
        {formatBRL(info.total)}
      </p>
      <div className="flex items-center gap-1.5 mt-1">
        <span className="text-xs text-gray-400">
          {info.count} nota{info.count !== 1 ? 's' : ''}
        </span>
        {info.totalPages > 1 && (
          <span className="text-[10px] font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
            {info.totalPages} páginas
          </span>
        )}
      </div>
    </div>
  );
}
