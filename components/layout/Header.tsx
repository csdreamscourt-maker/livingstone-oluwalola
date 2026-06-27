'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Container } from '@/components/ui';
import { BRAND, NAVIGATION } from '@/lib/constants';
import { Menu, X, ArrowRight } from 'lucide-react';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
          hasScrolled
            ? 'border-b border-gray-200 shadow-md'
            : 'border-b border-gray-100 shadow-sm'
        }`}
      >
        <Container>
          <div className="flex items-center justify-between h-18 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex flex-col gap-0 flex-shrink-0 group">
              <span className="text-2xl md:text-3xl font-serif font-bold text-midnight-950 group-hover:text-gold-600 transition-colors duration-300">
                {BRAND.name}
              </span>
              <span className="text-xs md:text-sm text-gold-600 font-medium tracking-wider uppercase">
                {BRAND.tagline}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-10">
              {NAVIGATION.slice(0, 6).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative text-sm font-medium text-midnight-950 group"
                >
                  <span className="transition-colors duration-300 group-hover:text-gold-600">
                    {item.label}
                  </span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-600 transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-4 ml-auto">
              {/* Desktop CTA */}
              <button className="hidden lg:flex items-center gap-2 px-6 py-3 bg-gold-600 text-midnight-950 font-medium rounded-lg hover:bg-gold-500 hover:shadow-lg transition-all duration-300 hover:scale-102 active:scale-95">
                Get Started
                <ArrowRight size={16} />
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 text-midnight-950 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={24} strokeWidth={2} /> : <Menu size={24} strokeWidth={2} />}
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Mobile Menu Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden animate-fadeIn"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed right-0 top-0 h-full w-64 bg-white z-50 lg:hidden transition-all duration-300 ${
          isOpen ? 'translate-x-0 shadow-lg' : 'translate-x-full'
        }`}
      >
        <div className="pt-20 px-6 space-y-2">
          {NAVIGATION.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-3 text-base font-medium text-midnight-950 hover:text-gold-600 hover:bg-gray-50 rounded-lg transition-all duration-300 group"
              onClick={() => setIsOpen(false)}
              style={{
                animation: isOpen ? `slideUp 300ms ease-out ${index * 50}ms both` : 'none',
              }}
            >
              <div className="flex items-center justify-between">
                <span>{item.label}</span>
                <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </Link>
          ))}

          {/* Mobile CTA */}
          <button className="w-full mt-6 px-4 py-3 bg-gold-600 text-midnight-950 font-medium rounded-lg hover:bg-gold-500 transition-all duration-300 active:scale-95">
            Get Started
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
