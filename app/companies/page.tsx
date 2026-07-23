import { Container, Section, Card, Badge } from '@/components/ui';
import { Hero } from '@/components/sections';
import { listCompanies } from '@/lib/db';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Companies | Livingstone',
  description: 'Explore the ecosystem of mission-driven organizations operating at the frontlines of leadership, technology, and social impact.',
};

export const dynamic = 'force-dynamic';

const categoryBackground = {
  'Companies & Startups': 'white',
  'Social Impact': 'gold',
  'Faith-Based': 'dark',
} as const;

export default async function CompaniesPage() {
  const COMPANIES = await listCompanies(true);
  return (
    <>
      <Hero
        subtitle="The ecosystem"
        title="Mission-driven organizations"
        description="A portfolio of integrated companies and initiatives working at the intersection of faith, leadership, technology, and social impact."
      />

      {(['Companies & Startups', 'Social Impact', 'Faith-Based'] as const).map((category) => {
        const background = categoryBackground[category];
        const isSolid = background !== 'white';
        return (
          <Section key={category} padding="lg" background={background}>
            <Container>
              <h2 className={`text-xl font-semibold mb-8 sm:text-2xl ${isSolid ? 'text-white' : 'text-midnight-950'}`}>
                {category}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {COMPANIES.filter((company) => company.category === category).map((company) => (
                  <Card
                    key={company.id}
                    variant={isSolid ? 'elevated' : 'bordered'}
                    className="group flex flex-col h-full"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-midnight-950">
                        {company.name}
                      </h3>
                      <Badge variant="outline" className="flex-shrink-0">
                        Active
                      </Badge>
                    </div>

                    <p className="text-[15px] text-gray-600 mb-6 flex-1 leading-6">
                      {company.description}
                    </p>

                    <Link
                      href={`/companies/${company.slug}`}
                      className="flex items-center gap-1.5 text-sm text-midnight-700 hover:text-midnight-950 font-semibold group/link transition-colors duration-200"
                    >
                      Learn more
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5" />
                    </Link>
                  </Card>
                ))}
              </div>
            </Container>
          </Section>
        );
      })}

      <Section padding="xl">
        <Container>
          <Card variant="dark" padding="xl">
            <h2 className="text-xl font-semibold text-white mb-4 sm:text-2xl">
              A unified vision
            </h2>
            <p className="text-[15px] text-white/70 mb-4 leading-7">
              These organizations aren&apos;t separate ventures. They operate as an integrated ecosystem, each bringing specialized expertise while contributing to a singular mission: building people, businesses, and institutions that stand the test of time.
            </p>
            <p className="text-[15px] text-white/70 leading-7">
              Through technology, education, advisory, publishing, and direct engagement, we work to create a world where excellence, integrity, and transformative impact are the norm rather than the exception.
            </p>
          </Card>
        </Container>
      </Section>
    </>
  );
}
