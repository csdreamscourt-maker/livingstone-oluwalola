import { Container, Section, Card } from '@/components/ui';
import { FounderPortrait } from '@/components/sections';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const topics = [
  {
    title: 'Faith-driven leadership',
    description: 'Grounding strategic decision-making in eternal principle without sacrificing rigor.',
  },
  {
    title: 'Systems thinking for institutions',
    description: 'Designing organizations built for posterity rather than a single leader or cycle.',
  },
  {
    title: 'The outlier edge',
    description: 'Why conventional strategy caps results — and how to think past it.',
  },
  {
    title: 'Mind engineering',
    description: 'Practical disciplines for shaping conviction, focus, and execution.',
  },
];

const formats = ['Keynote address', 'Workshop / masterclass', 'Panel discussion', 'Teaching & ministry sessions'];

export default function SpeakingPage() {
  return (
    <>
      <Section padding="xl">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-14 items-center">
            <FounderPortrait
              src="/founder/founder-04-casual-seated.jpg"
              alt="Livingstone Oluwalola speaking"
              aspect="portrait"
              priority
              className="max-w-md mx-auto lg:max-w-none"
            />
            <div>
              <span className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                <span className="h-[5px] w-[5px] rounded-full bg-gold-600" />
                Speaking &amp; teaching
              </span>
              <h1 className="text-2xl font-semibold leading-[1.15] tracking-[-0.02em] text-midnight-950 sm:text-3xl mb-5">
                Bringing clarity to rooms that need it
              </h1>
              <p className="text-[15px] text-gray-600 leading-7 mb-8">
                Livingstone speaks and teaches at the intersection of faith, leadership, and strategy — for organizations, congregations, and communities seeking practical wisdom, not just inspiration.
              </p>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-md bg-midnight-950 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.03] hover:bg-midnight-800 active:scale-[0.98]"
              >
                Inquire about an engagement
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      <Section padding="xl" background="light">
        <Container size="lg">
          <h2 className="text-xl font-semibold text-midnight-950 mb-8 sm:text-2xl">
            Topics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topics.map((topic, index) => {
              const tone = index % 2 === 0 ? 'navy' : 'gold';
              return (
                <div
                  key={topic.title}
                  className={`rounded-xl p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
                    tone === 'navy' ? 'bg-midnight-950 text-white' : 'bg-gold-600 text-white'
                  }`}
                >
                  <h3 className="text-[15px] font-semibold text-white mb-2">{topic.title}</h3>
                  <p className={`text-sm leading-6 ${tone === 'navy' ? 'text-white/70' : 'text-white/85'}`}>{topic.description}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section padding="xl">
        <Container size="lg">
          <Card variant="gold" padding="lg">
            <h2 className="text-lg font-semibold text-white mb-4">Formats</h2>
            <div className="flex flex-wrap gap-2">
              {formats.map((format) => (
                <span
                  key={format}
                  className="rounded-full border border-white/30 px-3.5 py-1.5 text-sm text-white"
                >
                  {format}
                </span>
              ))}
            </div>
          </Card>
        </Container>
      </Section>
    </>
  );
}
