'use client';

import { ReactNode, useState, useRef } from 'react';

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export function Tooltip({
  children,
  content,
  position = 'top',
  delay = 200,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
  };

  const arrowClasses = {
    top: 'bottom-[-6px] left-1/2 -translate-x-1/2 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-midnight-950',
    bottom: 'top-[-6px] left-1/2 -translate-x-1/2 border-l-6 border-r-6 border-b-6 border-l-transparent border-r-transparent border-b-midnight-950',
    left: 'right-[-6px] top-1/2 -translate-y-1/2 border-t-6 border-b-6 border-l-6 border-t-transparent border-b-transparent border-l-midnight-950',
    right: 'left-[-6px] top-1/2 -translate-y-1/2 border-t-6 border-b-6 border-r-6 border-t-transparent border-b-transparent border-r-midnight-950',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {isVisible && (
        <div
          className={`absolute z-50 px-3 py-2 text-sm font-medium text-white bg-midnight-950 rounded-lg whitespace-nowrap shadow-lg ${positionClasses[position]} animate-fadeIn pointer-events-none`}
        >
          {content}
          <div className={`absolute w-0 h-0 ${arrowClasses[position]}`} />
        </div>
      )}
    </div>
  );
}
