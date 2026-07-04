'use client';

import { useMemo, useState } from 'react';
import { Container, Section, Card } from '@/components/ui';
import { getDreamEntries } from '@/lib/dreams';
import { BrainCircuit, Compass, Sparkles, Waves } from 'lucide-react';

export default function InsightsPage() {
  const [dreams] = useState(getDreamEntries());

  const overview = useMemo(() => {
    const themes = dreams.flatMap((dream) => dream.tags);
    const uniqueThemes = Array.from(new Set(themes)).slice(0, 5);
    return {
      uniqueThemes,
      latestMood: dreams[0]?.mood || 'reflective',
      averageClarity: dreams.length
        ? Math.round((dreams.reduce((sum, dream) => sum + dream.clarity, 0) / dreams.length) * 10) / 10
        : 0,
    };
  }, [dreams]);

  return (
    <Section padding="2xl" className="bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.12),_transparent_40%)]">
      <Container>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-600/20 bg-gold-50 px-3 py-1 text-sm font-semibold text-gold-700 mb-4">
            <BrainCircuit className="w-4 h-4" />
            AI insights
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-midnight-950">A thoughtful companion for interpretation</h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl">
            Dreamscourt blends reflection, pattern recognition, and calm guidance so each dream becomes an opportunity for awareness.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card variant="bordered">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-2xl bg-gold-50 p-3 text-gold-700"><Sparkles className="w-5 h-5" /></div>
              <div>
                <p className="text-sm font-semibold text-gold-700">Overview</p>
                <p className="text-sm text-gray-600">From your recent dreams</p>
              </div>
            </div>
            <p className="text-lg font-serif font-semibold text-midnight-950">Your most recent dreams suggest a season of {overview.latestMood} growth.</p>
            <p className="mt-3 text-sm text-gray-600">Average clarity: {overview.averageClarity}/5</p>
          </Card>

          <Card variant="bordered">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-2xl bg-gold-50 p-3 text-gold-700"><Compass className="w-5 h-5" /></div>
              <div>
                <p className="text-sm font-semibold text-gold-700">Themes</p>
                <p className="text-sm text-gray-600">Recurring patterns</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {overview.uniqueThemes.map((theme) => (
                <span key={theme} className="rounded-full bg-midnight-950/5 px-3 py-1 text-sm text-midnight-700">{theme}</span>
              ))}
            </div>
          </Card>

          <Card variant="bordered">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-2xl bg-gold-50 p-3 text-gold-700"><Waves className="w-5 h-5" /></div>
              <div>
                <p className="text-sm font-semibold text-gold-700">Reflection prompt</p>
                <p className="text-sm text-gray-600">A gentle question to hold</p>
              </div>
            </div>
            <p className="text-lg font-serif font-semibold text-midnight-950">What is asking to be received with greater care?</p>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
