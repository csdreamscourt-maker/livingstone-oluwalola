'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '@/components/ui';
import { NAVIGATION } from '@/lib/constants';
import { Menu, X, ArrowRight } from 'lucide-react';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
  }, [isOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-midnight-950/8 bg-paper/90 backdrop-blur-md">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="group flex flex-shrink-0 items-center gap-2.5">
              <span className="relative flex h-[22px] w-[22px] items-center justify-center rounded-[4px] border-[1.4px] border-midnight-950">
                <span className="h-[6px] w-[6px] rounded-[1px] bg-gold-600" />
              </span>
              <span className="text-sm font-semibold tracking-[-0.01em] text-midnight-950">Livingstone</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-7">
              {NAVIGATION.slice(0, 5).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-[13.5px] font-medium text-gray-600 transition-colors duration-200 hover:text-midnight-950"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/contact"
                className="hidden lg:inline-flex items-center gap-1.5 rounded-md bg-midnight-950 px-4 py-2 text-[13.5px] font-semibold text-white transition-colors duration-200 hover:bg-midnight-800"
              >
                Get in touch
                <ArrowRight size={14} />
              </Link>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 rounded-md text-midnight-950 hover:bg-gray-100 transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </Container>
      </header>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-midnight-950/60 z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-0 top-0 h-full w-80 max-w-[85%] z-50 lg:hidden bg-white border-l border-midnight-950/10"
            >
              <div className="pt-20 px-6 space-y-1">
                {NAVIGATION.map((item) => (
                  <Link
                    key={item.href || item.label}
                    href={item.href}
                    className="flex items-center justify-between px-3 py-3 text-[15px] font-medium text-midnight-950 hover:bg-gray-50 rounded-md transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    <span>{item.label}</span>
                  </Link>
                ))}
                <div className="pt-5">
                  <Link
                    href="/contact"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-md font-semibold text-white bg-midnight-950"
                  >
                    Get in touch
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
