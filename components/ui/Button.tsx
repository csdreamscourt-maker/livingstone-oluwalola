import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'gold' | 'secondary' | 'tertiary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  href,
  onClick,
  disabled = false,
  type = 'button',
}: ButtonProps) {
  const baseStyles = 'font-semibold transition-all duration-200 ease-out rounded-md inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:scale-[1.03] active:scale-[0.98]';

  const variants = {
    primary: 'bg-midnight-950 text-white hover:bg-midnight-800 focus:ring-midnight-950',
    gold: 'bg-gold-600 text-white hover:bg-gold-700 focus:ring-gold-600',
    secondary: 'bg-gray-100 text-midnight-950 hover:bg-gray-200 focus:ring-gray-400',
    tertiary: 'bg-transparent border border-midnight-950/20 text-midnight-950 hover:border-midnight-950/40 focus:ring-midnight-950',
    ghost: 'bg-transparent text-midnight-950 hover:bg-gray-50 focus:ring-gold-600',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm min-h-[40px] md:min-h-auto',
    md: 'px-5 py-2.5 text-sm min-h-[44px] md:min-h-auto',
    lg: 'px-6 py-3 text-base min-h-[48px] md:min-h-auto',
    xl: 'px-7 py-3.5 text-base min-h-[48px] md:min-h-auto',
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
    <button className={classes} onClick={onClick} disabled={disabled} type={type}>
      {children}
    </button>
  );
}
