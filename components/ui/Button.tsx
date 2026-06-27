import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  href,
  onClick,
  disabled = false,
}: ButtonProps) {
  const baseStyles = 'font-medium transition-all duration-150 rounded-lg inline-flex items-center justify-center';

  const variants = {
    primary:
      'bg-midnight-950 text-white hover:bg-midnight-800 disabled:bg-stone-300 disabled:text-stone-600',
    secondary:
      'bg-stone-100 text-midnight-950 hover:bg-stone-200 disabled:bg-stone-200 disabled:text-stone-500',
    tertiary: 'bg-transparent border border-midnight-950 text-midnight-950 hover:bg-stone-100 disabled:border-stone-300',
    ghost: 'bg-transparent text-midnight-950 hover:text-gold-600 disabled:text-stone-400',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const classes = cn(baseStyles, variants[variant], sizes[size], className);

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
