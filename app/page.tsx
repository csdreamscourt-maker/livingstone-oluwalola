'use client';

import { motion } from 'framer-motion';
import { Hero, FeaturedContent } from '@/components/sections';
import { Container } from '@/components/ui';
import { FRAMEWORKS, COMPANIES, SAMPLE_ARTICLES } from '@/lib/constants';
import Link from 'next/link';
import { ArrowRight, Layers, Building2, Users, Sparkles, BrainCircuit, Compass } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.7, ease: EASE },
  }),
};

const stats = [
  { number: '7', label: 'Operating companies', icon: Building2 },
  { number: '100+', label: 'Frameworks & models', icon: Layers },
  { number: '1000+', label: 'Leaders impacted', icon: Users },
];

const pillars = [
  {
    title: 'Systems thinking',
    description: 'Clarity, discipline and durable strategy for mission-driven organizations.',
    icon: BrainCircuit,
  },
  {
    title: 'Reflective product design',
    description: 'Experiences shaped for calm, modern use and long-term trust.',
    icon: Compass,
  },
  {
    title: 'Human-centered leadership',
    description: 'A platform built to support growth, wisdom and meaningful execution.',
    icon: Sparkles,
  },
];

export default function Home() {
  return (
    <>
      <Hero
        subtitle="Livingstone • Modern Systems for Human Growth"
        title="The digital headquarters for bold thinking and calm execution"
        description="Explore strategic frameworks, elegant digital experiences, and living institutions shaped for the future."
        cta={{ label: 'Explore Frameworks', href: '/frameworks' }}
        cta2={{ label: 'Read Latest Insights', href: '/articles' }}
      />

      <section className="relative overflow-hidden bg-[#f8f8fc] py-24 md:py-32">
        <Container>
          <div className="mb-12 max-w-3xl">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-indigo-700">
              <Sparkles size={13} />
              A sharper operating layer
            </span>
            <h2 className="text-3xl font-semibold tracking-[-0.02em] text-midnight-950 sm:text-4xl lg:text-5xl">
              Built for leaders who want both depth and elegance.
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              The Livingstone ecosystem blends strategic thinking, product craft, and spiritual reflection into a single modern experience.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} variants={fadeUp} className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-[0_18px_60px_-30px_rgba(15,23,42,0.24)]">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-500">What we stand for</p>
              <div className="mt-6 space-y-4">
                {pillars.map((pillar) => {
                  const Icon = pillar.icon;
                  return (
                    <div key={pillar.title} className="flex gap-4 rounded-2xl border border-gray-100 bg-gray-50/80 p-4">
                      <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-midnight-950">{pillar.title}</p>
                        <p className="mt-1 text-sm leading-7 text-gray-600">{pillar.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div key={stat.label} custom={index} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="rounded-[1.6rem] border border-gray-200 bg-white p-6 shadow-[0_10px_40px_-24px_rgba(15,23,42,0.18)]">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
                      <Icon size={18} />
                    </div>
                    <p className="text-3xl font-semibold tracking-[-0.02em] text-midnight-950">{stat.number}</p>
                    <p className="mt-2 text-sm leading-7 text-gray-600">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>
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

      <section className="relative overflow-hidden bg-white py-24 md:py-32">
        <Container>
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-fuchsia-200 bg-fuchsia-50 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-fuchsia-700">
                <Building2 size={13} />
                Ecosystem
              </span>
              <h2 className="text-3xl font-semibold tracking-[-0.02em] text-midnight-950 sm:text-4xl">
                A portfolio of focused initiatives.
              </h2>
            </div>
            <Link href="/companies" className="inline-flex items-center gap-2 text-base font-semibold text-midnight-950 transition-colors duration-300 hover:text-indigo-600">
              View all companies
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {COMPANIES.slice(0, 4).map((company, index) => (
              <motion.div key={company.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.6, delay: index * 0.06 }}>
                <Link href={company.href} className="group block h-full rounded-[1.6rem] border border-gray-200 bg-[#fcfcfd] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-[0_16px_60px_-30px_rgba(79,70,229,0.35)]">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
                    <Building2 size={18} />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold tracking-[-0.02em] text-midnight-950">{company.name}</h3>
                  <p className="mt-3 text-sm leading-7 text-gray-600">{company.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <FeaturedContent
        subtitle="Latest insights"
        title="Articles & perspectives"
        description="Thoughtful writing for leaders navigating complexity with clarity."
        items={SAMPLE_ARTICLES.map((article) => ({
          id: article.id,
          title: article.title,
          description: article.excerpt,
          category: article.category,
          metadata: `${article.date} • ${article.readTime}`,
        }))}
        viewAllHref="/articles"
        viewAllLabel="Read all articles"
      />

      <section className="relative overflow-hidden bg-[#f8f8fc] py-24 md:py-28">
        <Container>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7 }} className="mx-auto max-w-3xl rounded-[2rem] border border-gray-200 bg-white p-8 text-center shadow-[0_20px_70px_-35px_rgba(15,23,42,0.28)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-500">Take the next step</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.02em] text-midnight-950 sm:text-4xl">
              Ready to build something enduring?
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Bring strategy, reflection and modern product thinking into one coherent operating system.
            </p>
            <Link href="/contact" className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-midnight-950 px-6 py-3.5 font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5">
              Get started
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </Container>
      </section>
    </>
  );
}
