'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '@/components/ui';
import { BRAND, NAVIGATION } from '@/lib/constants';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
  }, [isOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`sticky top-0 z-50 transition-all duration-500 ${
          hasScrolled
            ? 'glass shadow-card border-b border-white/40'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <Container>
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="group flex items-center gap-3 flex-shrink-0">
              <div className="relative w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Sparkles size={20} className="text-white" />
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {NAVIGATION.slice(0, 6).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative px-4 py-2 text-sm font-semibold text-midnight-800 rounded-xl hover:text-indigo-600 hover:bg-indigo-50/60 transition-all duration-300 group"
                >
                  {item.label}
                  <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/contact"
                className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white text-sm bg-indigo-600 shadow-lg hover:scale-105 active:scale-95 transition-transform duration-300"
              >
                Get Started
                <ArrowRight size={16} />
              </Link>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2.5 rounded-xl text-midnight-950 hover:bg-indigo-50 transition-colors duration-300"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </Container>
      </motion.header>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-midnight-950/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed right-0 top-0 h-full w-80 max-w-[85%] z-50 lg:hidden bg-indigo-600 shadow-2xl"
            >
              <div className="pt-24 px-6 space-y-1">
                {NAVIGATION.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 + 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center justify-between px-4 py-3.5 text-base font-semibold text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 group"
                      onClick={() => setIsOpen(false)}
                    >
                      <span>{item.label}</span>
                      <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="pt-6"
                >
                  <Link
                    href="/contact"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-xl font-semibold text-white bg-white text-indigo-600 shadow-lg"
                  >
                    Get Started
                    <ArrowRight size={16} />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
