import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  background?: 'white' | 'light' | 'dark' | 'midnight-950';
}

export function Section({
  children,
  className = '',
  padding = 'lg',
  background = 'white',
}: SectionProps) {
  const paddingMap = {
    sm: 'py-8 sm:py-12',
    md: 'py-12 sm:py-16',
    lg: 'py-16 sm:py-24',
    xl: 'py-20 sm:py-32',
  };

  const bgMap = {
    white: 'bg-white',
    light: 'bg-stone-100',
    dark: 'bg-midnight-950',
    'midnight-950': 'bg-midnight-950',
  };

  return (
    <section className={cn(bgMap[background], paddingMap[padding], className)}>
      {children}
    </section>
  );
}
