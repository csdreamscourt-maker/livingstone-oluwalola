'use client';

import { motion } from 'framer-motion';
import { Container } from '@/components/ui';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

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

export function FeaturedContent({
  title,
  subtitle,
  description,
  items,
  viewAllHref,
  viewAllLabel = 'View all',
}: FeaturedContentProps) {
  return (
    <section className="border-b border-midnight-950/8 bg-white py-16 md:py-24">
      <Container>
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            {subtitle && (
              <span className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                <span className="h-[5px] w-[5px] rounded-full bg-gold-600" />
                {subtitle}
              </span>
            )}
            <h2 className="text-xl font-semibold tracking-[-0.015em] text-midnight-950 sm:text-2xl">
              {title}
            </h2>
            {description && <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>}
          </div>
          {viewAllHref && (
            <Link href={viewAllHref} className="whitespace-nowrap border-b border-midnight-950/20 pb-0.5 text-sm font-semibold text-gray-600 transition-colors duration-200 hover:border-midnight-950 hover:text-midnight-950">
              {viewAllLabel}
            </Link>
          )}
        </div>

        <div className="grid gap-px overflow-hidden rounded-lg border border-midnight-950/10 bg-midnight-950/10 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item, index) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.4, delay: index * 0.04 }}>
              <Link href={item.href || '#'} className="group flex h-full flex-col gap-3 bg-white p-6 transition-colors duration-200 hover:bg-gold-600/[0.04]">
                <div className="flex items-start justify-between gap-4">
                  {item.category && (
                    <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-500">{item.category}</span>
                  )}
                  <ArrowUpRight size={16} className="shrink-0 text-gray-400 transition-colors duration-200 group-hover:text-gold-600" />
                </div>
                <h3 className="text-base font-semibold tracking-[-0.01em] text-midnight-950">{item.title}</h3>
                <p className="text-sm leading-6 text-gray-600">{item.description}</p>
                {item.metadata && <p className="mt-auto pt-3 text-xs text-gray-500 font-mono">{item.metadata}</p>}
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
