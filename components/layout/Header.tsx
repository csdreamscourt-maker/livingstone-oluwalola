'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Container } from '@/components/ui';
import { BRAND, NAVIGATION } from '@/lib/constants';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-stone-200">
      <Container>
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link href="/" className="flex flex-col">
            <span className="text-xl sm:text-2xl font-serif font-bold text-midnight-950">
              {BRAND.name}
            </span>
            <span className="text-xs sm:text-sm text-stone-600 font-light">
              {BRAND.tagline}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAVIGATION.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-midnight-950 hover:text-gold-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            className="md:hidden p-2 hover:bg-stone-100 rounded-lg"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <nav className="md:hidden py-4 border-t border-stone-200">
            {NAVIGATION.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-sm font-medium text-midnight-950 hover:bg-stone-100"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </Container>
    </header>
  );
}
