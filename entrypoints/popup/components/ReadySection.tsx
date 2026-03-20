import Button from '~/components/Button';

type Props = { totalPages: number; onSumAll: () => void };

export default function ReadySection({ totalPages, onSumAll }: Props) {
  if (totalPages <= 1) {
    return <p className="text-xs text-center text-gray-400">Apenas 1 página de resultados</p>;
  }

  return (
    <Button variant="primary" onClick={onSumAll}>
      Somar todas as notas
    </Button>
  );
}
