import { Container, Section, Card, Badge } from '@/components/ui';
import { FRAMEWORKS } from '@/lib/constants';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const FRAMEWORK_DETAILS: Record<string, { overview: string; applications: string[] }> = {
  'mind-engineering': {
    overview: 'Mind Engineering is a discipline for deliberately shaping thought patterns, convictions, and mental infrastructure — treating the mind as a system that can be designed for high-level execution rather than left to drift.',
    applications: [
      'Auditing inherited beliefs before they drive decisions',
      'Designing daily disciplines that reinforce chosen convictions',
      'Building mental models that hold up under pressure',
    ],
  },
  'outlier-potential': {
    overview: 'A framework for identifying where conventional thinking is quietly capping your results, and deliberately choosing a less-traveled — but more honest — path.',
    applications: [
      'Stress-testing "best practice" against first principles',
      'Distinguishing genuine risk from mere unfamiliarity',
      'Building strategy around uncommon, defensible advantages',
    ],
  },
  'redemptive-sagacity': {
    overview: 'Grounding strategic wisdom in eternal principle rather than personal preference — sourcing models for growth from biblical truth so they hold up over time.',
    applications: [
      'Evaluating strategy against enduring principle, not just market trend',
      'Integrating spiritual conviction into business decision-making',
      'Building institutions designed to serve people, not just outcomes',
    ],
  },
  'building-convictions': {
    overview: 'A discipline for forming the character and clarity of purpose that outlast circumstance — because charisma without conviction does not survive pressure.',
    applications: [
      'Clarifying non-negotiables before a crisis forces the question',
      'Developing leaders whose character matches their competence',
      'Creating cultures where integrity is structural, not incidental',
    ],
  },
  'nation-building': {
    overview: 'Institutional design principles for leaders working at the scale of communities and nations — building for posterity rather than a single administration or cycle.',
    applications: [
      'Designing institutions that outlive their founders',
      'Sequencing reform for durability over speed',
      'Aligning social impact work with long-term capacity building',
    ],
  },
  'systems-thinking': {
    overview: 'Faith-Driven Systems Thinking integrates spiritual principle with strategic planning, designing for purposeful endurance rather than short-term wins.',
    applications: [
      'Mapping how spiritual conviction shapes organizational strategy',
      'Designing feedback loops that reinforce mission over metrics alone',
      'Building plans that account for both the seen and the unseen',
    ],
  },
};

type FrameworkPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return FRAMEWORKS.map((framework) => ({ id: framework.id }));
}

export default async function FrameworkDetailPage({ params }: FrameworkPageProps) {
  const { id } = await params;
  const framework = FRAMEWORKS.find((f) => f.id === id);
  const detail = FRAMEWORK_DETAILS[id];

  if (!framework || !detail) {
    notFound();
  }

  return (
    <Section padding="xl">
      <Container size="md">
        <div className="mb-8">
          <Link
            href="/frameworks"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-midnight-950 font-semibold transition-colors duration-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to frameworks
          </Link>
        </div>

        <Badge variant="outline" className="mb-4">
          {framework.category}
        </Badge>
        <h1 className="text-2xl font-semibold text-midnight-950 mb-4 sm:text-3xl">
          {framework.title}
        </h1>
        <p className="text-[15px] text-gray-600 leading-7 mb-10">
          {detail.overview}
        </p>

        <Card variant="bordered" padding="lg" className="mb-10">
          <h2 className="text-lg font-semibold text-midnight-950 mb-4">Where this applies</h2>
          <ul className="space-y-2.5">
            {detail.applications.map((application) => (
              <li key={application} className="flex items-start gap-2.5 text-sm text-gray-600 leading-6">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold-600" />
                {application}
              </li>
            ))}
          </ul>
        </Card>

        <div className="text-center">
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-md bg-midnight-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-midnight-800"
          >
            Discuss this framework
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
