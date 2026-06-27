'use client';

import { Container, Section } from '@/components/ui';
import { Hero } from '@/components/sections';
import { BookOpen, ArrowRight } from 'lucide-react';

export default function ResourcesPage() {
  return (
    <>
      <Hero
        subtitle="Learning Materials"
        title="Resources & Tools"
        description="Access curated resources, tools, templates, and learning materials to support your leadership journey and organizational transformation."
      />

      <Section padding="2xl">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-midnight-950 mb-4">
              Coming Soon
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              We're preparing a comprehensive collection of resources, templates, guides, and tools to support your transformation journey.
            </p>
            <a
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gold-600 text-midnight-950 font-semibold rounded-lg hover:bg-gold-500 hover:shadow-lg hover:shadow-gold-500/50 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Access Dashboard
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </Container>
      </Section>
    </>
  );
}
