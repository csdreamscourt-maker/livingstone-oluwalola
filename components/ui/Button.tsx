import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'gold' | 'secondary' | 'tertiary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
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
  const baseStyles = 'font-semibold transition-all duration-300 rounded-lg inline-flex items-center justify-center active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'bg-midnight-950 text-white hover:bg-midnight-800 hover:shadow-lg hover:scale-105 focus:ring-midnight-950',
    gold: 'bg-gold-600 text-midnight-950 hover:bg-gold-500 hover:shadow-lg hover:scale-105 focus:ring-gold-600',
    secondary: 'bg-gray-100 text-midnight-950 hover:bg-gray-200 hover:shadow-md focus:ring-gray-400',
    tertiary: 'bg-transparent border-2 border-midnight-950 text-midnight-950 hover:bg-midnight-950 hover:text-white hover:shadow-md focus:ring-midnight-950',
    ghost: 'bg-transparent text-midnight-950 hover:bg-gray-50 hover:text-gold-600 focus:ring-gold-600',
    danger: 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:scale-105 focus:ring-red-600',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

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
