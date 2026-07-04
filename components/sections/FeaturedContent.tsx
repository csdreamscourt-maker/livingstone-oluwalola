'use client';

import { motion } from 'framer-motion';
import { Container } from '@/components/ui';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

interface Item {
  id: string;
  title: string;
  description: string;
  category?: string;
  href?: string;
  metadata?: string;
}

interface FeaturedContentProps {
  title: string;
  subtitle?: string;
  description?: string;
  items: Item[];
  viewAllHref?: string;
  viewAllLabel?: string;
}

const PILL_TONES = [
  'bg-indigo-50 text-indigo-700 border-indigo-200',
  'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
  'bg-cyan-50 text-cyan-700 border-cyan-200',
  'bg-amber-50 text-amber-700 border-amber-200',
  'bg-violet-50 text-violet-700 border-violet-200',
  'bg-emerald-50 text-emerald-700 border-emerald-200',
];

export function FeaturedContent({
  title,
  subtitle,
  description,
  items,
  viewAllHref,
  viewAllLabel = 'View All',
}: FeaturedContentProps) {
  return (
    <section className="relative overflow-hidden bg-white py-24 md:py-32">
      <Container className="relative">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.7 }} className="mb-12 max-w-2xl">
          {subtitle && (
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-indigo-700">
              <Sparkles size={13} />
              {subtitle}
            </span>
          )}
          <h2 className="text-3xl font-semibold tracking-[-0.02em] text-midnight-950 sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          {description && <p className="mt-4 text-lg leading-8 text-gray-600">{description}</p>}
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item, index) => {
            const pill = PILL_TONES[index % PILL_TONES.length];
            return (
              <motion.div key={item.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.6, delay: index * 0.06 }}>
                <Link href={item.href || '#'} className="group block h-full rounded-[1.6rem] border border-gray-200/80 bg-[#fcfcfd] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-[0_16px_50px_-24px_rgba(79,70,229,0.35)]">
                  <div className="flex items-start justify-between gap-4">
                    {item.category && <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${pill}`}>{item.category}</span>}
                    <div className="rounded-full border border-gray-200 bg-white p-2 text-gray-500 transition-colors duration-300 group-hover:text-indigo-600">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold tracking-[-0.02em] text-midnight-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-gray-600">{item.description}</p>
                  {item.metadata && <p className="mt-6 border-t border-gray-100 pt-4 text-xs font-medium uppercase tracking-[0.2em] text-gray-500">{item.metadata}</p>}
                </Link>
              </motion.div>
            );
          })}
        </div>

        {viewAllHref && (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="mt-10 text-center">
            <Link href={viewAllHref} className="inline-flex items-center gap-2 text-base font-semibold text-midnight-950 transition-colors duration-300 hover:text-indigo-600">
              {viewAllLabel}
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        )}
      </Container>
    </section>
  );
}
