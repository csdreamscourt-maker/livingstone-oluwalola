'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui';
import { ArrowRight } from 'lucide-react';

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
    <section className="border-b border-midnight-950/8 bg-paper">
      <Container className="py-14 md:py-20">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-2xl">
          {subtitle && (
            <span className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
              <span className="h-[5px] w-[5px] rounded-full bg-gold-600" />
              {subtitle}
            </span>
          )}
          <h1 className="text-2xl font-semibold leading-[1.15] tracking-[-0.02em] text-midnight-950 sm:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-4 max-w-xl text-base leading-7 text-gray-600">
              {description}
            </p>
          )}
          {(cta || cta2) && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {cta && (
                <Link href={cta.href} className="group inline-flex items-center justify-center gap-2 rounded-md bg-midnight-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-midnight-800">
                  {cta.label}
                  <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              )}
              {cta2 && (
                <Link href={cta2.href} className="inline-flex items-center justify-center gap-2 rounded-md border border-midnight-950/15 px-5 py-2.5 text-sm font-semibold text-midnight-950 transition-colors duration-200 hover:border-midnight-950/30">
                  {cta2.label}
                </Link>
              )}
            </div>
          )}
        </motion.div>
      </Container>
    </section>
  );
}
