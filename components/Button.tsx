import type { ReactNode } from 'react';

type Props = {
  variant?: 'primary' | 'ghost';
  onClick: () => void;
  children: ReactNode;
  className?: string;
};

const styles = {
  primary: 'bg-black text-white text-[13px] font-semibold py-2.5 hover:bg-gray-900',
  ghost: 'border border-gray-200 text-gray-400 text-xs font-medium py-2 hover:bg-gray-50',
};

export default function Button({ variant = 'ghost', onClick, children, className }: Props) {
  return (
    <button
      onClick={onClick}
      className={`w-full cursor-pointer transition-colors ${styles[variant]} ${className ?? ''}`}
    >
      {children}
    </button>
  );
}
