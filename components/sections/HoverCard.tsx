'use client';

import { ReactNode, useState, useRef } from 'react';

interface HoverCardProps {
  children: ReactNode;
  className?: string;
  effect?: 'lift' | 'glow' | 'scale' | 'border';
}

export function HoverCard({
  children,
  className = '',
  effect = 'lift',
}: HoverCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const effectClasses = {
    lift: isHovering ? 'shadow-xl -translate-y-2' : 'shadow-md',
    glow: isHovering ? 'shadow-lg shadow-gold-500/30' : 'shadow-md',
    scale: isHovering ? 'scale-105' : 'scale-100',
    border: isHovering ? 'border-gold-600' : 'border-gray-200',
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
      className={`transition-all duration-300 ${
        effectClasses[effect]
      } ${className}`}
      style={
        effect === 'glow' && isHovering
          ? {
              backgroundImage: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(212, 175, 55, 0.1) 0%, transparent 50%)`,
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
