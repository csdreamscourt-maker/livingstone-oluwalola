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

const GRADIENTS = [
  'from-indigo-500 to-violet-600',
  'from-fuchsia-500 to-pink-600',
  'from-cyan-500 to-indigo-600',
  'from-amber-500 to-pink-500',
  'from-violet-500 to-fuchsia-600',
  'from-emerald-500 to-cyan-500',
];

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
  const titleWords = title.split(' ');
  const splitPoint = Math.ceil(titleWords.length / 2);

  return (
    <section className="relative py-24 md:py-32 bg-mesh overflow-hidden">
      <Container className="relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 md:mb-20 max-w-3xl"
        >
          {subtitle && (
            <span className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/70 backdrop-blur-sm border border-indigo-200 text-indigo-600 text-xs font-bold uppercase tracking-[0.2em]">
              <Sparkles size={14} />
              {subtitle}
            </span>
          )}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-[1.1]">
            {titleWords.slice(0, splitPoint).join(' ')}{' '}
            <span className="text-gradient-primary">
              {titleWords.slice(splitPoint).join(' ')}
            </span>
          </h2>
          {description && (
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              {description}
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 mb-12">
          {items.map((item, index) => {
            const gradient = GRADIENTS[index % GRADIENTS.length];
            const pill = PILL_TONES[index % PILL_TONES.length];
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6 }}
              >
                <Link href={item.href || '#'} className="group block h-full">
                  <div className="relative h-full p-7 md:p-8 rounded-3xl bg-white border border-gray-200/80 shadow-card group-hover:shadow-card-hover transition-all duration-500 flex flex-col overflow-hidden">
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />
                    <div className={`absolute -right-20 -top-20 w-40 h-40 rounded-full bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500`} />

                    <div className="relative flex-1">
                      {item.category && (
                        <span className={`inline-block px-3 py-1 mb-5 text-[11px] font-bold uppercase tracking-wider rounded-full border ${pill}`}>
                          {item.category}
                        </span>
                      )}
                      <h3 className="text-xl md:text-2xl font-serif font-bold text-midnight-950 mb-3 group-hover:text-indigo-600 transition-colors duration-300 leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-base leading-relaxed mb-4">
                        {item.description}
                      </p>
                    </div>

                    {item.metadata && (
                      <p className="relative text-xs font-medium text-gray-500 py-4 border-t border-gray-100 mb-4">
                        {item.metadata}
                      </p>
                    )}

                    {item.href && (
                      <div className={`relative inline-flex items-center gap-2 font-semibold text-sm bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                        <span>Learn More</span>
                        <ArrowRight size={16} className="text-indigo-600 transition-transform duration-300 group-hover:translate-x-1.5" />
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {viewAllHref && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <Link
              href={viewAllHref}
              className="inline-flex items-center gap-2 text-lg font-semibold text-midnight-950 hover:text-indigo-600 group transition-colors duration-300 link-underline"
            >
              {viewAllLabel}
              <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          </motion.div>
        )}
      </Container>
    </section>
  );
}
