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
    default: 'bg-gray-200 text-midnight-950',
    gold: 'bg-gold-600 text-midnight-950 font-semibold',
    outline: 'border-2 border-gold-600 text-gold-600 bg-transparent',
    subtle: 'bg-gold-100 text-gold-700',
    success: 'bg-emerald-100 text-emerald-700',
    error: 'bg-red-100 text-red-700',
    dark: 'bg-midnight-950 text-white',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span
      className={`
        inline-block rounded-full font-medium
        ${variants[variant]}
        ${sizes[size]}
        ${className}
        transition-colors duration-300
      `}
    >
      {children}
    </span>
  );
}
