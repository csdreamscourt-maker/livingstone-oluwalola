'use client';

import Link from 'next/link';
import { Container } from '@/components/ui';
import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  cta?: {
    label: string;
    href: string;
  };
  cta2?: {
    label: string;
    href: string;
  };
}

export function Hero({ title, subtitle, description, cta, cta2 }: HeroProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-white via-white to-gray-50 overflow-hidden">
      {/* Premium background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Top right gradient blob */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-gold opacity-10 rounded-full blur-3xl" />
        
        {/* Bottom left gradient blob */}
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-t from-midnight-900 to-midnight-800 opacity-5 rounded-full blur-3xl" />
        
        {/* Center glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-500 opacity-5 rounded-full blur-3xl" />
      </div>

      {/* Animated grid background (subtle) */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#0a0a14" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Content */}
      <Container className="relative z-10 w-full py-20 md:py-24">
        <div className="max-w-5xl mx-auto text-center">
          {/* Subtitle with animation */}
          {subtitle && (
            <div
              className={`mb-8 transition-all duration-700 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '100ms' }}
            >
              <span className="inline-block text-xs md:text-sm font-bold text-gold-600 uppercase tracking-widest bg-gold-100 px-4 py-2 rounded-full">
                {subtitle}
              </span>
            </div>
          )}

          {/* Main title with premium typography */}
          <h1
            className={`text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-midnight-950 mb-8 leading-[1.1] transition-all duration-700 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            {title}
          </h1>

          {/* Description with premium styling */}
          {description && (
            <p
              className={`text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed font-light transition-all duration-700 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              {description}
            </p>
          )}

          {/* CTA Buttons with premium styling */}
          {(cta || cta2) && (
            <div
              className={`flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center transition-all duration-700 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
              {cta && (
                <Link
                  href={cta.href}
                  className="group flex items-center gap-2 px-8 py-4 md:px-10 md:py-5 bg-gold-600 text-midnight-950 font-semibold rounded-lg hover:bg-gold-500 hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  {cta.label}
                  <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              )}
              {cta2 && (
                <Link
                  href={cta2.href}
                  className="group flex items-center gap-2 px-8 py-4 md:px-10 md:py-5 border-2 border-midnight-950 text-midnight-950 font-semibold rounded-lg hover:bg-midnight-950 hover:text-white hover:shadow-lg transition-all duration-300 active:scale-95"
                >
                  {cta2.label}
                  <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              )}
            </div>
          )}
        </div>
      </Container>

      {/* Scroll indicator (subtle) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-pulse">
        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>

      <style jsx>{`
        .bg-gradient-gold {
          background: linear-gradient(135deg, #d4af37 0%, #f0d86a 100%);
        }
      `}</style>
    </section>
  );
}
