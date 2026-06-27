'use client';

import { Container, Section } from '@/components/ui';
import { Hero } from '@/components/sections';
import { Users, ArrowRight } from 'lucide-react';

export default function CommunityPage() {
  return (
    <>
      <Hero
        subtitle="Collective Growth"
        title="Community"
        description="Join a global community of leaders, innovators, and thought leaders committed to transformation, excellence, and lasting impact."
      />

      <Section padding="2xl">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-midnight-950 mb-4">
              Coming Soon
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              We're building an exclusive community of leaders and innovators. Be among the first to join when we launch.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gold-600 text-midnight-950 font-semibold rounded-lg hover:bg-gold-500 hover:shadow-lg hover:shadow-gold-500/50 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Express Interest
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </Container>
      </Section>
    </>
  );
}
