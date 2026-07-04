import { Container, Section, Card, Badge } from '@/components/ui';
import { COMPANIES } from '@/lib/constants';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Sparkles } from 'lucide-react';

const COMPANY_DETAILS: Record<string, { name: string; tagline: string; summary: string; highlights: string[] }> = {
  dreamscourt: {
    name: 'Dreamscourt',
    tagline: 'AI-powered dream journal and spiritual insights platform',
    summary:
      'Dreamscourt helps people capture, reflect on, and interpret dreams through a thoughtful blend of technology and spiritual care.',
    highlights: [
      'Daily dream journaling with guided reflection prompts',
      'AI-powered interpretations rooted in personal insight and spiritual context',
      'A calm, modern experience for growth and self-discovery',
    ],
  },
  'house-of-uphaz': {
    name: 'House of Uphaz',
    tagline: 'Institutional development and leadership training',
    summary:
      'House of Uphaz supports organizations and leaders through leadership development, systems thinking, and institutional strengthening.',
    highlights: [
      'Leadership formation for mission-driven institutions',
      'Systems and strategy support for long-term growth',
      'Practical guidance for building durable organizations',
    ],
  },
  'adjunct-corporation': {
    name: 'Adjunct Corporation',
    tagline: 'Strategic advisory and business systems',
    summary:
      'Adjunct Corporation helps businesses design smarter systems, sharpen strategy, and execute with clarity.',
    highlights: [
      'Strategic advisory for founders and teams',
      'Operational systems that support sustainable growth',
      'A disciplined approach to decision-making and execution',
    ],
  },
  'eternity-windows': {
    name: 'Eternity Windows Publication',
    tagline: 'Publishing thought leadership and theological insights',
    summary:
      'Eternity Windows publishes thoughtful writing that connects faith, leadership, and cultural renewal.',
    highlights: [
      'Deep reflections on faith and leadership',
      'Thoughtful publications for modern audiences',
      'A platform for shaping meaningful conversations',
    ],
  },
  'faith-expressions': {
    name: 'Faith Expressions',
    tagline: 'Faith-based media and communications',
    summary:
      'Faith Expressions creates stories and communications that amplify truth, identity, and transformation.',
    highlights: [
      'Content and storytelling for faith-centered missions',
      'Creative communication with purpose and clarity',
      'Tools for reaching audiences with conviction',
    ],
  },
  'young-ministers': {
    name: 'Young Ministers Training School',
    tagline: 'Leadership development for emerging ministers',
    summary:
      'Young Ministers Training School equips emerging leaders with practical skills, spiritual grounding, and institutional awareness.',
    highlights: [
      'Training for new and emerging ministers',
      'Leadership development rooted in service and excellence',
      'Mentorship for sustainable impact',
    ],
  },
  agenda58: {
    name: 'Agenda58 Foundation',
    tagline: 'Social impact and community transformation',
    summary:
      'Agenda58 Foundation focuses on community transformation, social impact, and strategic service initiatives.',
    highlights: [
      'Community-centered transformation efforts',
      'Programs designed for lasting social change',
      'A commitment to practical impact and stewardship',
    ],
  },
};

type CompanyPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return COMPANIES.map((company) => ({ slug: company.id }));
}

export default async function CompanyDetailPage({ params }: CompanyPageProps) {
  const { slug } = await params;
  const company = COMPANY_DETAILS[slug];

  if (!company) {
    notFound();
  }

  return (
    <>
      <Section padding="xl">
        <Container>
          <div className="mb-8">
            <Link
              href="/companies"
              className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-700 font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to companies
            </Link>
          </div>

          <Card variant="bordered" className="overflow-hidden">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <Badge variant="outline" className="mb-4">
                  Active initiative
                </Badge>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-midnight-950 mb-4">
                  {company.name}
                </h1>
                <p className="text-xl text-gold-700 font-semibold mb-6">
                  {company.tagline}
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                  {company.summary}
                </p>

                <div className="flex flex-wrap gap-3">
                  {company.highlights.map((highlight) => (
                    <div
                      key={highlight}
                      className="inline-flex items-center gap-2 rounded-full border border-gold-600/20 bg-gold-50 px-4 py-2 text-sm font-medium text-midnight-900"
                    >
                      <Sparkles className="w-4 h-4 text-gold-600" />
                      {highlight}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-[0_16px_50px_-30px_rgba(15,23,42,0.2)]">
                <h2 className="text-2xl font-serif font-bold mb-4 text-midnight-950">What this work looks like</h2>
                <p className="text-gray-700 leading-relaxed">
                  This initiative is part of Livingstone’s broader ecosystem of mission-driven work, connecting faith, leadership, systems, and innovation in practical ways.
                </p>
              </div>
            </div>
          </Card>
        </Container>
      </Section>
    </>
  );
}
