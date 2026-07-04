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
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.2),_transparent_28%),linear-gradient(135deg,_#0b0d1d_0%,_#11162f_45%,_#1d2562_100%)]">
      <div className="absolute inset-0 opacity-[0.12] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.16) 1px, transparent 1px)', backgroundSize: '54px 54px' }} />
      <Container className="relative z-10 py-20 md:py-28 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-2xl">
            {subtitle && (
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/80 backdrop-blur">
                <Sparkles size={14} className="text-gold-400" />
                {subtitle}
              </span>
            )}
            <h1 className="text-4xl font-semibold leading-[0.95] tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            {description && (
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/75 sm:text-xl">
                {description}
              </p>
            )}
            {(cta || cta2) && (
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                {cta && (
                  <Link href={cta.href} className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 font-semibold text-indigo-700 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl">
                    {cta.label}
                    <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                )}
                {cta2 && (
                  <Link href={cta2.href} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 font-semibold text-white backdrop-blur transition-all duration-300 hover:bg-white/15">
                    {cta2.label}
                  </Link>
                )}
              </div>
            )}
            <div className="mt-10 flex flex-wrap gap-3 text-sm text-white/70">
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5">Faith-led systems</span>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5">Strategic clarity</span>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5">Product thinking</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="relative">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-gold-400/20 via-transparent to-indigo-400/20 blur-3xl" />
            <div className="relative rounded-[2rem] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-xl">
              <div className="rounded-[1.5rem] border border-white/10 bg-[#070913] p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">Live OS</p>
                    <p className="mt-2 text-xl font-semibold">Livingstone Intelligence Layer</p>
                  </div>
                  <div className="rounded-2xl border border-gold-400/20 bg-gold-400/10 p-2 text-gold-300">
                    <Orbit size={18} />
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-200">
                      <BrainCircuit size={18} />
                    </div>
                    <p className="text-sm font-semibold">Adaptive insight</p>
                    <p className="mt-1 text-sm text-white/60">A thoughtful operating layer for leaders and builders.</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-gold-400/15 text-gold-300">
                      <ShieldCheck size={18} />
                    </div>
                    <p className="text-sm font-semibold">Trusted systems</p>
                    <p className="mt-1 text-sm text-white/60">Designed with calm, precision and long-term clarity.</p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-gradient-to-r from-white/10 to-transparent p-4">
                  <div className="flex items-center justify-between text-sm text-white/65">
                    <span>Operational maturity</span>
                    <span className="font-semibold text-white">92%</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-white/10">
                    <div className="h-2 w-[92%] rounded-full bg-gradient-to-r from-gold-400 to-indigo-400" />
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
