import { Container, Section, Card, Badge } from '@/components/ui';
import { COMPANIES } from '@/lib/constants';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

const COMPANY_DETAILS: Record<string, { name: string; tagline: string; summary: string; highlights: string[]; logo?: string }> = {
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
    logo: '/brand/dreamscourt-logo-color.png',
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
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-midnight-950 font-semibold transition-colors duration-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to companies
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <Card variant="bordered" padding="lg">
              {company.logo && (
                <div className="mb-5 inline-flex rounded-lg bg-black p-4">
                  <Image src={company.logo} alt={`${company.name} logo`} width={990} height={402} className="h-8 w-auto" />
                </div>
              )}
              <Badge variant="outline" className="mb-4">
                Active initiative
              </Badge>
              <h1 className="text-2xl font-semibold text-midnight-950 mb-3 sm:text-3xl">
                {company.name}
              </h1>
              <p className="text-[15px] text-gold-700 font-semibold mb-5">
                {company.tagline}
              </p>
              <p className="text-[15px] text-gray-600 leading-7 mb-6">
                {company.summary}
              </p>

              <ul className="space-y-2">
                {company.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-2.5 text-sm text-gray-600 leading-6"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold-600" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </Card>

            <Card variant="bordered" padding="lg">
              <h2 className="text-lg font-semibold mb-3 text-midnight-950">What this work looks like</h2>
              <p className="text-sm text-gray-600 leading-6">
                This initiative is part of Livingstone&rsquo;s broader ecosystem of mission-driven work, connecting faith, leadership, systems, and innovation in practical ways.
              </p>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
}
