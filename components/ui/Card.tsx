import { ReactNode, CSSProperties } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  variant?: 'default' | 'elevated' | 'bordered' | 'dark' | 'gold';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
}

export function Card({
  children,
  className = '',
  style,
  variant = 'bordered',
  padding = 'md',
  hover = true,
}: CardProps) {
  const variants = {
    default: 'bg-white border border-midnight-950/8',
    elevated: 'bg-white border border-midnight-950/8 shadow-[0_1px_2px_rgba(11,14,20,0.04)]',
    bordered: 'bg-white border border-midnight-950/10',
    dark: 'bg-midnight-950 border border-white/10 text-white',
    gold: 'bg-gold-600 border border-gold-700/40 text-white',
  };

  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-7',
    xl: 'p-9',
  };

  const hoverClasses = {
    default: 'hover:border-midnight-950/20',
    elevated: 'hover:border-midnight-950/20',
    bordered: 'hover:border-midnight-950/20',
    dark: 'hover:border-white/25',
    gold: 'hover:border-white/40',
  };

  const hoverClass = hover
    ? `transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg ${hoverClasses[variant]}`
    : '';

  return (
    <div
      style={style}
      className={`
        rounded-lg
        ${variants[variant]}
        ${paddings[padding]}
        ${hoverClass}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
