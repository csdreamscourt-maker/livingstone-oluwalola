'use client';

import { motion } from 'framer-motion';
import { FeaturedContent, FounderPortrait } from '@/components/sections';
import { Container } from '@/components/ui';
import { FRAMEWORKS, COMPANIES, ARTICLES } from '@/lib/constants';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.5, ease: EASE },
  }),
};

const stats = [
  { number: String(COMPANIES.length), label: 'Ventures in the ecosystem' },
  { number: String(FRAMEWORKS.length), label: 'Signature frameworks' },
  { number: '3', label: 'Domains: faith, systems, technology' },
];

const pillars = [
  {
    title: 'Systems thinking',
    description: 'Clarity, discipline and durable strategy for mission-driven organizations.',
  },
  {
    title: 'Reflective product design',
    description: 'Experiences shaped for calm, modern use and long-term trust.',
  },
  {
    title: 'Human-centered leadership',
    description: 'A platform built to support growth, wisdom and meaningful execution.',
  },
];

export default function Home() {
  return (
    <>
      <section className="border-b border-midnight-950/8 bg-paper">
        <Container className="py-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <motion.div initial="hidden" animate="show" variants={fadeUp} className="max-w-xl">
              <span className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                <span className="h-[5px] w-[5px] rounded-full bg-gold-600" />
                Livingstone Oluwalola — systems for human growth
              </span>
              <h1 className="text-3xl font-semibold leading-[1.12] tracking-[-0.02em] text-midnight-950 sm:text-4xl">
                The digital headquarters for bold thinking and calm execution.
              </h1>
              <p className="mt-5 max-w-md text-base leading-7 text-gray-600">
                Explore strategic frameworks, elegant digital experiences, and living institutions — built at the intersection of faith, leadership, and technology.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/frameworks" className="inline-flex items-center justify-center gap-2 rounded-md bg-midnight-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-midnight-800">
                  Explore frameworks
                  <ArrowRight size={16} />
                </Link>
                <Link href="/about" className="inline-flex items-center justify-center gap-2 rounded-md border border-midnight-950/15 px-5 py-2.5 text-sm font-semibold text-midnight-950 transition-colors duration-200 hover:border-midnight-950/30">
                  Meet Livingstone
                </Link>
              </div>

              <div className="mt-10 border-t border-midnight-950/10">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex items-baseline justify-between border-b border-midnight-950/10 py-3.5">
                    <span className="text-[13px] text-gray-500">{stat.label}</span>
                    <span className="font-mono text-lg font-semibold tabular-nums text-midnight-950">{stat.number}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial="hidden" animate="show" custom={1} variants={fadeUp}>
              <FounderPortrait
                src="/founder/founder-01-tan-confident.jpg"
                alt="Livingstone Oluwalola"
                aspect="tall"
                priority
                eyebrow="The Mastermind"
                caption="Coach · Consultant · Reformer · Polymath"
                className="mx-auto max-w-sm lg:max-w-none"
              />
            </motion.div>
          </div>
        </Container>
      </section>

      <section className="border-b border-midnight-950/8 bg-white py-16 md:py-24">
        <Container>
          <div className="mb-10 max-w-xl">
            <span className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
              <span className="h-[5px] w-[5px] rounded-full bg-gold-600" />
              What we stand for
            </span>
            <h2 className="text-xl font-semibold tracking-[-0.015em] text-midnight-950 sm:text-2xl">
              Built for leaders who want both depth and elegance.
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              The Livingstone ecosystem blends strategic thinking, product craft, and spiritual reflection into a single operating system.
            </p>
          </div>

          <div className="border-t border-midnight-950/10">
            {pillars.map((pillar, index) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="grid gap-2 border-b border-midnight-950/10 py-5 sm:grid-cols-[220px_1fr] sm:gap-8"
              >
                <span className="text-[15px] font-semibold tracking-[-0.01em] text-midnight-950">{pillar.title}</span>
                <span className="max-w-xl text-sm leading-6 text-gray-600">{pillar.description}</span>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <FeaturedContent
        subtitle="Signature systems"
        title="Frameworks for transformation"
        description="Practical models, strategic lenses, and structures for growth at every level."
        items={FRAMEWORKS.map((fw) => ({
          id: fw.id,
          title: fw.title,
          description: fw.description,
          category: fw.category,
          href: `/frameworks/${fw.id}`,
        }))}
        viewAllHref="/frameworks"
        viewAllLabel="Explore all frameworks"
      />

      <section className="border-b border-midnight-950/8 bg-paper py-16 md:py-24">
        <Container>
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <span className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                <span className="h-[5px] w-[5px] rounded-full bg-gold-600" />
                Ecosystem
              </span>
              <h2 className="text-xl font-semibold tracking-[-0.015em] text-midnight-950 sm:text-2xl">
                A portfolio of focused initiatives.
              </h2>
            </div>
            <Link href="/companies" className="whitespace-nowrap border-b border-midnight-950/20 pb-0.5 text-sm font-semibold text-gray-600 transition-colors duration-200 hover:border-midnight-950 hover:text-midnight-950">
              View all companies
            </Link>
          </div>

          <div className="grid gap-px overflow-hidden rounded-lg border border-midnight-950/10 bg-midnight-950/10 sm:grid-cols-2 xl:grid-cols-4">
            {COMPANIES.slice(0, 4).map((company, index) => (
              <motion.div key={company.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.4, delay: index * 0.05 }}>
                <Link href={company.href} className="group flex h-full flex-col gap-3 bg-white p-6 transition-colors duration-200 hover:bg-midnight-950/[0.03]">
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-gray-400">{company.category}</span>
                    <ArrowUpRight size={16} className="text-gray-400 transition-colors duration-200 group-hover:text-midnight-700" />
                  </div>
                  <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-midnight-950">{company.name}</h3>
                  <p className="text-sm leading-6 text-gray-600">{company.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <FeaturedContent
        subtitle="Ideas library"
        title="Recent essays & perspectives"
        description="Thoughtful writing for leaders navigating complexity with clarity."
        items={ARTICLES.map((article) => ({
          id: article.id,
          title: article.title,
          description: article.excerpt,
          category: article.category,
          metadata: article.readTime,
          href: `/articles/${article.id}`,
        }))}
        viewAllHref="/articles"
        viewAllLabel="Read all articles"
      />

      <section className="bg-white py-16 md:py-24">
        <Container size="md">
          <div className="rounded-lg border border-midnight-950/10 p-8 text-center md:p-12">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">Take the next step</span>
            <h2 className="mt-3 text-xl font-semibold tracking-[-0.015em] text-midnight-950 sm:text-2xl">
              Ready to build something enduring?
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-600 max-w-md mx-auto">
              Bring strategy, reflection and modern product thinking into one coherent operating system.
            </p>
            <Link href="/contact" className="mt-6 inline-flex items-center gap-2 rounded-md bg-midnight-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-midnight-800">
              Get started
              <ArrowRight size={16} />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
