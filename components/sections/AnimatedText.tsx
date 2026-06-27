'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: boolean;
}

export function AnimatedText({
  text,
  className = '',
  delay = 0,
  stagger = false,
}: AnimatedTextProps) {
  const [displayText, setDisplayText] = useState(stagger ? '' : text);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (stagger) {
      setDisplayText('');
      timeoutRef.current = setTimeout(() => {
        let currentText = '';
        for (let i = 0; i < text.length; i++) {
          setTimeout(() => {
            currentText = text.slice(0, i + 1);
            setDisplayText(currentText);
          }, i * 20);
        }
      }, delay);
    } else {
      timeoutRef.current = setTimeout(() => {
        setDisplayText(text);
      }, delay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, delay, stagger]);

  return <span className={className}>{displayText}</span>;
}
