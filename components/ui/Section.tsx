import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  background?: 'white' | 'light' | 'dark' | 'midnight-950';
}

export function Section({
  children,
  className = '',
  padding = 'lg',
  background = 'white',
}: SectionProps) {
  const paddingMap = {
    sm: 'py-10 md:py-14',
    md: 'py-14 md:py-20',
    lg: 'py-16 md:py-24',
    xl: 'py-20 md:py-28',
    '2xl': 'py-24 md:py-32',
  };

  const bgMap = {
    white: 'bg-white',
    light: 'bg-white',
    dark: 'bg-midnight-950 text-white',
    'midnight-950': 'bg-midnight-950 text-white',
  };

  return (
    <section className={`${bgMap[background]} ${paddingMap[padding]} ${className} overflow-hidden`}>
      {children}
    </section>
  );
}
