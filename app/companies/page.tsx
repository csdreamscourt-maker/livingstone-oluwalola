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
        subtitle="The Ecosystem"
        title="Mission-Driven Organizations"
        description="A portfolio of integrated companies and initiatives working at the intersection of faith, leadership, technology, and social impact."
      />

      <Section padding="2xl">
        <Container>
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-1.5 h-10 bg-gradient-to-b from-gold-600 to-gold-500 rounded-full" />
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-midnight-950">
                Our Organizations
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {COMPANIES.map((company, index) => (
                <Card
                  key={company.id}
                  variant="bordered"
                  className="group flex flex-col h-full hover:border-gold-600 hover:shadow-lg transition-all duration-300 animate-slideUp"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-6">
                    <h3 className="text-2xl font-serif font-bold text-midnight-950 group-hover:text-gold-600 transition-colors">
                      {company.name}
                    </h3>
                    <Badge variant="outline" className="flex-shrink-0 group-hover:bg-gold-600 group-hover:text-midnight-950 transition-all">
                      {company.status}
                    </Badge>
                  </div>

                  <p className="text-lg text-gray-600 mb-8 flex-1 leading-relaxed">
                    {company.description}
                  </p>

                  <Link
                    href={company.href}
                    className="flex items-center gap-2 text-gold-600 hover:text-gold-700 font-semibold group/link transition-all"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </Card>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-midnight-900 via-midnight-800 to-midnight-950 p-12 md:p-16 border border-gold-600 border-opacity-20">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gold-500 opacity-5 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gold-500 opacity-5 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-8">
                A Unified Vision
              </h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                These organizations aren't separate ventures. They operate as an integrated ecosystem, each bringing specialized expertise while contributing to a singular mission: building people, businesses, and institutions that stand the test of time.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                Through technology, education, advisory, publishing, and direct engagement, we work to create a world where excellence, integrity, and transformative impact are the norm rather than the exception.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
