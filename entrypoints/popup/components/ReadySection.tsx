import Button from '~/components/Button';

type Props = { totalPages: number; onSumAll: () => void };

export default function ReadySection({ totalPages, onSumAll }: Props) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <Button variant="primary" onClick={onSumAll}>
      Somar todas as notas
    </Button>
  );
}
