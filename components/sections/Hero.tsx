'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui';
import { ArrowRight, Sparkles, BrainCircuit, ShieldCheck, Orbit } from 'lucide-react';

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
    <section className="relative overflow-hidden bg-[#f7f7fb]">
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#111827 1px, transparent 1px), linear-gradient(90deg, #111827 1px, transparent 1px)', backgroundSize: '52px 52px' }} />
      <Container className="relative z-10 py-20 md:py-28 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-2xl">
            {subtitle && (
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-indigo-700">
                <Sparkles size={14} className="text-indigo-700" />
                {subtitle}
              </span>
            )}
            <h1 className="text-4xl font-semibold leading-[0.95] tracking-[-0.03em] text-midnight-950 sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            {description && (
              <p className="mt-6 max-w-xl text-lg leading-8 text-gray-700 sm:text-xl">
                {description}
              </p>
            )}
            {(cta || cta2) && (
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                {cta && (
                  <Link href={cta.href} className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-midnight-950 px-6 py-3.5 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-midnight-900">
                    {cta.label}
                    <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                )}
                {cta2 && (
                  <Link href={cta2.href} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-300 bg-white px-6 py-3.5 font-semibold text-midnight-950 transition-all duration-300 hover:border-indigo-300 hover:text-indigo-700">
                    {cta2.label}
                  </Link>
                )}
              </div>
            )}
            <div className="mt-10 flex flex-wrap gap-3 text-sm text-gray-700">
              <span className="rounded-full border border-gray-200 bg-white px-3 py-1.5">Faith-led systems</span>
              <span className="rounded-full border border-gray-200 bg-white px-3 py-1.5">Strategic clarity</span>
              <span className="rounded-full border border-gray-200 bg-white px-3 py-1.5">Product thinking</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="relative">
            <div className="relative rounded-[2rem] border border-gray-200 bg-white p-5 shadow-[0_20px_70px_-35px_rgba(15,23,42,0.28)]">
              <div className="rounded-[1.5rem] border border-gray-200 bg-[#f8f8fc] p-5 text-midnight-950">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-500">Live OS</p>
                    <p className="mt-2 text-xl font-semibold">Livingstone Intelligence Layer</p>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-white p-2 text-indigo-700">
                    <Orbit size={18} />
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-gray-200 bg-white p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
                      <BrainCircuit size={18} />
                    </div>
                    <p className="text-sm font-semibold">Adaptive insight</p>
                    <p className="mt-1 text-sm text-gray-600">A thoughtful operating layer for leaders and builders.</p>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-white p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-100 text-midnight-950">
                      <ShieldCheck size={18} />
                    </div>
                    <p className="text-sm font-semibold">Trusted systems</p>
                    <p className="mt-1 text-sm text-gray-600">Designed with calm, precision and long-term clarity.</p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Operational maturity</span>
                    <span className="font-semibold text-midnight-950">92%</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-gray-100">
                    <div className="h-2 w-[92%] rounded-full bg-midnight-950" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
