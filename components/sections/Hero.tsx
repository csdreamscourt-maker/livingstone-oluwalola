'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui';
import { ArrowRight, Sparkles } from 'lucide-react';

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
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-cosmic noise-overlay">
      {/* Animated gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full"
          style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)', filter: 'blur(60px)' }}
          animate={{ x: [0, 60, -20, 0], y: [0, -40, 30, 0], scale: [1, 1.1, 0.95, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/3 -right-40 w-[520px] h-[520px] rounded-full"
          style={{ background: 'radial-gradient(circle, #d946ef 0%, transparent 70%)', filter: 'blur(70px)' }}
          animate={{ x: [0, -40, 30, 0], y: [0, 50, -30, 0], scale: [1, 0.9, 1.15, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-40 left-1/4 w-[460px] h-[460px] rounded-full"
          style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)', filter: 'blur(60px)' }}
          animate={{ x: [0, 40, -30, 0], y: [0, -30, 40, 0], scale: [1, 1.05, 0.92, 1] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-[380px] h-[380px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.6) 0%, transparent 70%)', filter: 'blur(50px)' }}
          animate={{ x: [-100, 50, -80, -100], y: [-100, 30, -50, -100], scale: [1, 1.1, 0.95, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <Container className="relative z-10 w-full py-24 md:py-28">
        <div className="max-w-5xl mx-auto text-center">
          {subtitle && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8 flex justify-center"
            >
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-dark text-indigo-200 text-xs md:text-sm font-semibold uppercase tracking-[0.2em] border border-indigo-400/30">
                <Sparkles size={14} className="text-amber-400" />
                {subtitle}
              </span>
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl lg:text-[5.5rem] font-serif font-bold mb-8 leading-[1.05] tracking-tight"
            style={{ color: '#ffffff' }}
          >
            <span className="block">{title.split(' ').slice(0, Math.ceil(title.split(' ').length / 2)).join(' ')}</span>
            <span className="block text-gradient-primary mt-2">
              {title.split(' ').slice(Math.ceil(title.split(' ').length / 2)).join(' ')}
            </span>
          </motion.h1>

          {description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg md:text-xl lg:text-2xl text-indigo-100/80 max-w-3xl mx-auto mb-12 leading-relaxed font-light"
            >
              {description}
            </motion.p>
          )}

          {(cta || cta2) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-center"
            >
              {cta && (
                <Link
                  href={cta.href}
                  className="group relative inline-flex items-center gap-2 px-8 py-4 md:px-10 md:py-5 font-semibold rounded-2xl text-white overflow-hidden shadow-glow-violet transition-all duration-300 hover:scale-[1.03] active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)' }}
                >
                  <span className="relative z-10">{cta.label}</span>
                  <ArrowRight size={20} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1.5" />
                  <span
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #c026d3 100%)' }}
                  />
                </Link>
              )}
              {cta2 && (
                <Link
                  href={cta2.href}
                  className="group inline-flex items-center gap-2 px-8 py-4 md:px-10 md:py-5 font-semibold rounded-2xl glass-dark text-white border border-white/20 hover:border-white/40 hover:bg-white/10 transition-all duration-300 active:scale-95"
                >
                  {cta2.label}
                  <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                </Link>
              )}
            </motion.div>
          )}

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="mt-16 md:mt-20 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-indigo-200/60"
          >
            {['Faith', 'Leadership', 'Systems', 'Innovation'].map((pillar, i) => (
              <motion.div
                key={pillar}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 + i * 0.1 }}
                className="flex items-center gap-2 text-sm md:text-base font-medium"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-400 to-fuchsia-400" />
                {pillar}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Container>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1.5 }, y: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-2 rounded-full bg-white/70"
          />
        </div>
      </motion.div>
    </section>
  );
}
