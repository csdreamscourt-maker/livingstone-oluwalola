'use client';

import { Container, Section, Card, Button } from '@/components/ui';
import { Hero } from '@/components/sections';
import { Lightbulb, ArrowRight } from 'lucide-react';

export default function IdeasPage() {
  return (
    <>
      <Hero
        subtitle="Intellectual Exploration"
        title="Ideas & Concepts"
        description="Explore thought-provoking ideas, conceptual frameworks, and emerging perspectives that shape our understanding of leadership and innovation."
      />

      <Section padding="2xl">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-midnight-950 mb-4">
              Coming Soon
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              We're curating a collection of original ideas and conceptual explorations that push the boundaries of strategic thinking and innovation.
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gold-600 text-midnight-950 font-semibold rounded-lg hover:bg-gold-500 hover:shadow-lg hover:shadow-gold-500/50 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Back to Home
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </Container>
      </Section>
    </>
  );
}
