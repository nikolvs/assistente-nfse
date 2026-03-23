import type { ReactNode } from 'react';

type Props = {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: 'default' | 'subtle';
  className?: string;
};

const styles = {
  default: 'text-[13px] font-semibold text-black underline hover:text-gray-600 transition-colors',
  subtle: 'hover:underline hover:text-gray-400 transition-colors',
};

export default function Link({ href, onClick, children, variant = 'default', className }: Props) {
  return (
    <a
      href={href}
      onClick={onClick}
      target={href ? '_blank' : undefined}
      rel={href ? 'noreferrer' : undefined}
      className={`cursor-pointer inline-flex justify-center items-center gap-1 leading-none ${styles[variant]} ${className ?? ''}`}
    >
      {children}
    </a>
  );
}
