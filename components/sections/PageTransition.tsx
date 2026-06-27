'use client';

import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className = '' }: PageTransitionProps) {
  return (
    <div
      className={`animate-fadeIn ${className}`}
      style={{
        animationDuration: '400ms',
        animationTimingFunction: 'ease-out',
      }}
    >
      {children}
    </div>
  );
}
