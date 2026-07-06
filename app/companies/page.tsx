import { Container, Section, Card, Badge } from '@/components/ui';
import { Hero } from '@/components/sections';
import { COMPANIES } from '@/lib/constants';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Companies | Livingstone',
  description: 'Explore the ecosystem of mission-driven organizations operating at the frontlines of leadership, technology, and social impact.',
};

export default function CompaniesPage() {
  return (
    <>
      <Hero
        subtitle="The ecosystem"
        title="Mission-driven organizations"
        description="A portfolio of integrated companies and initiatives working at the intersection of faith, leadership, technology, and social impact."
      />

      <Section padding="xl">
        <Container>
          <div className="mb-16">
            <h2 className="text-xl font-semibold text-midnight-950 mb-8 sm:text-2xl">
              Our organizations
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
              {COMPANIES.map((company) => (
                <Card
                  key={company.id}
                  variant="bordered"
                  className="group flex flex-col h-full"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-midnight-950">
                      {company.name}
                    </h3>
                    <Badge variant="outline" className="flex-shrink-0">
                      {company.status}
                    </Badge>
                  </div>

                  <p className="text-[15px] text-gray-600 mb-6 flex-1 leading-6">
                    {company.description}
                  </p>

                  <Link
                    href={company.href}
                    className="flex items-center gap-1.5 text-sm text-gold-600 hover:text-gold-700 font-semibold group/link transition-colors duration-200"
                  >
                    Learn more
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5" />
                  </Link>
                </Card>
              ))}
            </div>
          </div>

          <Card variant="bordered" padding="xl">
            <h2 className="text-xl font-semibold text-midnight-950 mb-4 sm:text-2xl">
              A unified vision
            </h2>
            <p className="text-[15px] text-gray-600 mb-4 leading-7">
              These organizations aren&apos;t separate ventures. They operate as an integrated ecosystem, each bringing specialized expertise while contributing to a singular mission: building people, businesses, and institutions that stand the test of time.
            </p>
            <p className="text-[15px] text-gray-600 leading-7">
              Through technology, education, advisory, publishing, and direct engagement, we work to create a world where excellence, integrity, and transformative impact are the norm rather than the exception.
            </p>
          </Card>
        </Container>
      </Section>
    </>
  );
}
