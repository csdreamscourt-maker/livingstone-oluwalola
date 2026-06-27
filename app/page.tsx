'use client';

import { Hero, FeaturedContent, NewsletterCTA } from '@/components/sections';
import { Container, Section, Card } from '@/components/ui';
import { FRAMEWORKS, COMPANIES, SAMPLE_ARTICLES } from '@/lib/constants';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <>
      <Hero
        subtitle="Welcome to"
        title="The Digital Headquarters of Leadership & Innovation"
        description="Explore frameworks, ideas, and systems for building people, businesses, and institutions through faith-driven strategic thinking."
        cta={{ label: 'Explore Frameworks', href: '/frameworks' }}
        cta2={{ label: 'Read Latest Insights', href: '/articles' }}
      />

      <Section padding="lg" background="gradient-subtle">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
            <p className="text-sm md:text-base font-bold text-gold-600 mb-4 uppercase tracking-widest">
              Our Philosophy
            </p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-midnight-950 mb-6 leading-tight">
              Building Systems That Transform
            </h2>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              At the intersection of faith, leadership, technology, and human development lies a
              powerful opportunity. We believe lasting transformation happens when vision, systems,
              and people align. Our work spans institutional development, strategic innovation, and
              human capacity building.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {[
              {
                number: '7',
                label: 'Operating Companies',
              },
              {
                number: '100+',
                label: 'Frameworks & Models',
              },
              {
                number: '1000+',
                label: 'Leaders Impacted',
              },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="text-center p-8 rounded-xl bg-white border border-gray-200 hover:border-gold-600 hover:shadow-lg transition-all duration-300"
                style={{
                  animation: `slideUp 600ms ease-out ${index * 100}ms both`,
                }}
              >
                <p className="text-6xl md:text-7xl font-serif font-bold text-gold-600 mb-3">
                  {stat.number}
                </p>
                <p className="text-lg text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

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

      <Section padding="lg" background="white">
        <Container>
          <div className="mb-16 md:mb-20 max-w-2xl">
            <p className="text-sm md:text-base font-bold text-gold-600 mb-4 uppercase tracking-widest">
              Our Ecosystem
            </p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-midnight-950 mb-6 leading-tight">
              Companies & Initiatives
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              A collection of mission-driven organizations operating at the frontlines of
              leadership, technology, and social impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
            {COMPANIES.slice(0, 6).map((company, index) => (
              <Link
                key={company.id}
                href={company.href}
                className="group"
                style={{
                  animation: `slideUp 600ms ease-out ${index * 100}ms both`,
                }}
              >
                <Card variant="bordered" padding="lg" className="h-full flex flex-col">
                  <div>
                    <h3 className="text-xl md:text-2xl font-serif font-bold text-midnight-950 mb-3 group-hover:text-gold-600 transition-colors duration-300">
                      {company.name}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {company.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-gold-600 font-semibold pt-4 border-t border-gray-200 group-hover:gap-3 transition-all duration-300">
                    <span className="text-sm">Learn More</span>
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/companies"
              className="inline-flex items-center gap-2 text-lg font-semibold text-midnight-950 hover:text-gold-600 group transition-colors duration-300"
            >
              View All Companies
              <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Container>
      </Section>

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

      <Section padding="xl" background="midnight-950">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
              Ready to Transform Your Leadership?
            </h2>
            <p className="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed">
              Join thousands of leaders accessing tools, frameworks, and community through our
              integrated platform.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-10 py-5 bg-gold-600 text-midnight-950 font-semibold rounded-lg hover:bg-gold-500 hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Get Started
              <ArrowRight size={20} />
            </Link>
          </div>
        </Container>
      </Section>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
