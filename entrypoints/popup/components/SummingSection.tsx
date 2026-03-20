import { formatBRL } from '../utils';
import Button from '~/components/Button';

type Props = { current: number; total: number; accumulated: number; onCancel: () => void };

export default function SummingSection({ current, total, accumulated, onCancel }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
        Somando todas as notas…
      </p>
      <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-black rounded-full transition-all duration-300"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
      <p className="text-xs text-gray-400">
        Página {current} de {total}
        {accumulated > 0 && (
          <span className="font-semibold text-black ml-1.5">
            · R$ {formatBRL(accumulated)}
          </span>
        )}
      </p>
      <Button onClick={onCancel} className="mt-1">
        Cancelar
      </Button>
    </div>
  );
}
