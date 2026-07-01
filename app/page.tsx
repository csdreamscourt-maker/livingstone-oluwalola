'use client';

import { motion } from 'framer-motion';
import { Hero, FeaturedContent, NewsletterCTA } from '@/components/sections';
import { Container } from '@/components/ui';
import { FRAMEWORKS, COMPANIES, SAMPLE_ARTICLES } from '@/lib/constants';
import Link from 'next/link';
import { ArrowRight, Layers, Building2, Users, Sparkles } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: EASE },
  }),
};

const stats = [
  { number: '7', label: 'Operating Companies', icon: Building2, gradient: 'from-indigo-500 to-violet-500' },
  { number: '100+', label: 'Frameworks & Models', icon: Layers, gradient: 'from-fuchsia-500 to-pink-500' },
  { number: '1000+', label: 'Leaders Impacted', icon: Users, gradient: 'from-cyan-500 to-indigo-500' },
];

export default function Home() {
  return (
    <>
      <Hero
        subtitle="Welcome to Livingstone"
        title="The Digital Headquarters of Leadership & Innovation"
        description="Explore frameworks, ideas, and systems for building people, businesses, and institutions through faith-driven strategic thinking."
        cta={{ label: 'Explore Frameworks', href: '/frameworks' }}
        cta2={{ label: 'Read Latest Insights', href: '/articles' }}
      />

      {/* Philosophy / Stats */}
      <section className="relative py-24 md:py-32 bg-mesh overflow-hidden">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeUp}
            className="max-w-3xl mx-auto text-center mb-16 md:mb-20"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/70 backdrop-blur-sm border border-indigo-200 text-indigo-600 text-xs font-bold uppercase tracking-[0.2em]">
              <Sparkles size={14} />
              Our Philosophy
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-[1.1]">
              Building Systems That{' '}
              <span className="text-gradient-primary">Transform</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              At the intersection of faith, leadership, technology, and human development lies a
              powerful opportunity. We believe lasting transformation happens when vision, systems,
              and people align.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  custom={index}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-50px' }}
                  variants={fadeUp}
                  whileHover={{ y: -8 }}
                  className="group relative"
                >
                  <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-br opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #d946ef)' }}
                  />
                  <div className="relative h-full p-8 md:p-10 rounded-3xl bg-white border border-gray-200/80 shadow-card group-hover:shadow-card-hover transition-all duration-500">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} mb-6 shadow-lg`}>
                      <Icon size={26} className="text-white" />
                    </div>
                    <p className={`text-6xl md:text-7xl font-serif font-extrabold bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent mb-3 tracking-tight`}>
                      {stat.number}
                    </p>
                    <p className="text-base md:text-lg text-gray-600 font-medium">{stat.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Frameworks */}
      <FeaturedContent
        subtitle="Signature Systems"
        title="Frameworks for Transformation"
        description="Industry-leading frameworks and strategic models designed for organizational excellence."
        items={FRAMEWORKS.map((fw) => ({
          id: fw.id,
          title: fw.title,
          description: fw.description,
          category: fw.category,
          href: `/frameworks/${fw.id}`,
        }))}
        viewAllHref="/frameworks"
        viewAllLabel="Explore All Frameworks"
      />

      {/* Companies */}
      <section className="relative py-24 md:py-32 bg-white overflow-hidden">
        {/* Background accent */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }}
        />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)' }}
        />

        <Container className="relative">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeUp}
            className="mb-16 md:mb-20 max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-fuchsia-50 border border-fuchsia-200 text-fuchsia-600 text-xs font-bold uppercase tracking-[0.2em]">
              <Building2 size={14} />
              Our Ecosystem
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-[1.1]">
              Companies &{' '}
              <span className="text-gradient-sunset">Initiatives</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              A collection of mission-driven organizations operating at the frontlines of
              leadership, technology, and social impact.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 mb-12">
            {COMPANIES.slice(0, 6).map((company, index) => {
              const gradients = [
                'from-indigo-500 to-violet-600',
                'from-fuchsia-500 to-pink-600',
                'from-cyan-500 to-indigo-600',
                'from-amber-500 to-pink-500',
                'from-violet-500 to-fuchsia-600',
                'from-emerald-500 to-cyan-500',
              ];
              return (
                <motion.div
                  key={company.id}
                  custom={index}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-50px' }}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                >
                  <Link href={company.href} className="group block h-full">
                    <div className="relative h-full p-7 md:p-8 rounded-3xl bg-white border border-gray-200/80 shadow-card group-hover:shadow-card-hover transition-all duration-500 overflow-hidden">
                      {/* Gradient accent on top */}
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradients[index % gradients.length]}`} />

                      {/* Hover gradient overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index % gradients.length]} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />

                      <div className="relative">
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${gradients[index % gradients.length]} mb-5 shadow-md`}>
                          <Building2 size={22} className="text-white" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-serif font-bold text-midnight-950 mb-3 group-hover:text-indigo-600 transition-colors duration-300">
                          {company.name}
                        </h3>
                        <p className="text-gray-600 leading-relaxed mb-5 line-clamp-3">
                          {company.description}
                        </p>
                        <div className={`inline-flex items-center gap-2 font-semibold text-sm bg-gradient-to-r ${gradients[index % gradients.length]} bg-clip-text text-transparent pt-4 border-t border-gray-100 w-full`}>
                          <span>Learn More</span>
                          <ArrowRight size={16} className="text-indigo-600 transition-transform duration-300 group-hover:translate-x-1.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center">
            <Link
              href="/companies"
              className="inline-flex items-center gap-2 text-lg font-semibold text-midnight-950 hover:text-indigo-600 group transition-colors duration-300 link-underline"
            >
              View All Companies
              <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          </div>
        </Container>
      </section>

      <FeaturedContent
        subtitle="Latest Insights"
        title="Articles & Perspectives"
        description="Discover in-depth articles, case studies, and leadership insights from our team."
        items={SAMPLE_ARTICLES.map((article) => ({
          id: article.id,
          title: article.title,
          description: article.excerpt,
          category: article.category,
          metadata: `${article.date} • ${article.readTime}`,
        }))}
        viewAllHref="/articles"
        viewAllLabel="Read All Articles"
      />

      <NewsletterCTA />

      {/* Final CTA */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-cosmic noise-overlay">
        {/* Animated gradient blobs */}
        <motion.div
          className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)', filter: 'blur(60px)' }}
          animate={{ x: [0, 60, -40, 0], y: [0, -40, 30, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, #d946ef 0%, transparent 70%)', filter: 'blur(60px)' }}
          animate={{ x: [0, -50, 30, 0], y: [0, 40, -20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />

        <Container className="relative">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeUp}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full glass-dark text-indigo-200 text-xs font-bold uppercase tracking-[0.2em] border border-indigo-400/30">
              <Sparkles size={14} className="text-amber-400" />
              Take The Next Step
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-[1.1]">
              Ready to Transform Your{' '}
              <span className="text-gradient-primary">Leadership?</span>
            </h2>
            <p className="text-lg md:text-xl text-indigo-100/80 mb-10 leading-relaxed">
              Join thousands of leaders accessing tools, frameworks, and community through our
              integrated platform.
            </p>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 px-10 py-5 rounded-2xl font-semibold text-white shadow-glow-violet hover:scale-105 active:scale-95 transition-transform duration-300"
              style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)' }}
            >
              Get Started
              <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          </motion.div>
        </Container>
      </section>
    </>
  );
}
