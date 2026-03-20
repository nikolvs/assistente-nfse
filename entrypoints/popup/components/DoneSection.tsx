import { formatBRL } from '../utils';
import Button from '~/components/Button';

type Props = { grandTotal: number; grandCount: number; pages: number; onReset: () => void };

export default function DoneSection({ grandTotal, grandCount, pages, onReset }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
          Total geral
        </p>
        <p className="text-[22px] font-bold text-black leading-tight">
          <span className="text-sm font-semibold text-gray-400 mr-0.5">R$</span>
          {formatBRL(grandTotal)}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {grandCount} nota{grandCount !== 1 ? 's' : ''} em {pages} página{pages !== 1 ? 's' : ''}
        </p>
      </div>
      <Button onClick={onReset}>Recalcular</Button>
    </div>
  );
}
