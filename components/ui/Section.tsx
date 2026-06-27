import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  background?: 'white' | 'light' | 'dark' | 'midnight-950' | 'gradient-subtle';
}

export function Section({
  children,
  className = '',
  padding = 'lg',
  background = 'white',
}: SectionProps) {
  const paddingMap = {
    sm: 'py-12 md:py-16',
    md: 'py-16 md:py-24',
    lg: 'py-20 md:py-32',
    xl: 'py-24 md:py-40',
    '2xl': 'py-32 md:py-48',
  };

  const bgMap = {
    white: 'bg-white',
    light: 'bg-gradient-to-b from-white to-gray-50',
    dark: 'bg-midnight-950 text-white',
    'midnight-950': 'bg-midnight-950 text-white',
    'gradient-subtle': 'bg-gradient-to-br from-white via-gray-50 to-gray-50',
  };

  return (
    <section className={`${bgMap[background]} ${paddingMap[padding]} ${className} overflow-hidden`}>
      {children}
    </section>
  );
}
