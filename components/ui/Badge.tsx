interface BadgeProps {
  children: string;
  variant?: 'default' | 'gold' | 'outline' | 'subtle' | 'success' | 'error' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-midnight-950',
    gold: 'bg-gold-600 text-white font-semibold',
    outline: 'border border-midnight-950/15 text-midnight-950 bg-transparent',
    subtle: 'bg-gold-100 text-gold-700',
    success: 'bg-emerald-100 text-emerald-700',
    error: 'bg-red-100 text-red-700',
    dark: 'bg-midnight-950 text-white',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={`
        inline-block rounded-full font-medium uppercase tracking-[0.08em]
        ${variants[variant]}
        ${sizes[size]}
        ${className}
        transition-colors duration-200
      `}
    >
      {children}
    </span>
  );
}
