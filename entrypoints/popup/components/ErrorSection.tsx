import Button from '~/components/Button';

type Props = { message: string; onReset: () => void };

export default function ErrorSection({ message, onReset }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-red-500 bg-red-50 border border-red-100 px-3 py-2.5 leading-relaxed">
        {message}
      </p>
      <Button onClick={onReset}>Tentar novamente</Button>
    </div>
  );
}
