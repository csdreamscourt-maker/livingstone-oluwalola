import { ReactNode, CSSProperties } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  variant?: 'default' | 'elevated' | 'bordered' | 'dark';
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
  };

  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-7',
    xl: 'p-9',
  };

  const hoverClass = hover
    ? 'transition-colors duration-200 hover:border-midnight-950/20'
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
