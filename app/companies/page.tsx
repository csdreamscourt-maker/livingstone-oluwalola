import { Container, Section, Card } from '@/components/ui';
import { Hero } from '@/components/sections';
import { COMPANIES } from '@/lib/constants';
import Link from 'next/link';

export const metadata = {
  title: 'Companies | Livingstone',
  description: 'Explore the ecosystem of mission-driven organizations operating at the frontlines of leadership, technology, and social impact.',
};

export default function CompaniesPage() {
  return (
    <>
      <Hero
        subtitle="The Ecosystem"
        title="Mission-Driven Organizations"
        description="A portfolio of integrated companies and initiatives working at the intersection of faith, leadership, technology, and social impact."
      />

      <Section padding="lg">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {COMPANIES.map((company) => (
              <Card
                key={company.id}
                variant="bordered"
                padding="lg"
                hover
                className="flex flex-col"
              >
                <h3 className="text-2xl font-serif font-bold text-midnight-950 mb-3">
                  {company.name}
                </h3>

                <p className="text-lg text-stone-600 mb-6 flex-1 leading-relaxed">
                  {company.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-gold-600">
                    {company.status}
                  </span>
                  <Link
                    href={company.href}
                    className="text-sm font-medium text-midnight-950 hover:text-gold-600 transition-colors"
                  >
                    Learn More →
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          <div className="bg-stone-100 rounded-lg p-8 sm:p-12">
            <h2 className="text-3xl font-serif font-bold text-midnight-950 mb-6">
              A Unified Vision
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed mb-6">
              These organizations aren't separate ventures. They operate as an integrated ecosystem,
              each bringing specialized expertise while contributing to a singular mission: building
              people, businesses, and institutions that stand the test of time.
            </p>
            <p className="text-lg text-stone-600 leading-relaxed">
              Through technology, education, advisory, publishing, and direct engagement, we work to
              create a world where excellence, integrity, and transformative impact are the norm rather
              than the exception.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
