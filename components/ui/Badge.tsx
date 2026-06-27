import { cn } from '@/lib/utils';

interface BadgeProps {
  children: string;
  variant?: 'default' | 'primary' | 'secondary';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-stone-200 text-midnight-950',
    primary: 'bg-gold-400 text-midnight-950',
    secondary: 'bg-midnight-950 text-white',
  };

  return (
    <span
      className={cn(
        'inline-block px-3 py-1 text-xs font-medium rounded-full',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
