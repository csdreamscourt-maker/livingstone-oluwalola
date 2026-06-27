import { ReactNode, CSSProperties } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  variant?: 'default' | 'elevated' | 'bordered' | 'gradient' | 'dark';
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
    default: 'bg-white border border-gray-100 shadow-subtle',
    elevated: 'bg-white shadow-lg',
    bordered: 'bg-white border border-gray-200 hover:border-gold-600',
    gradient: 'bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-gold-600',
    dark: 'bg-midnight-950 border border-gray-700 text-white',
  };

  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const hoverClass = hover
    ? 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1'
    : '';

  return (
    <div
      style={style}
      className={`
        rounded-xl
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
