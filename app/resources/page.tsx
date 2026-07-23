import { Container, Section, Card } from '@/components/ui';
import { Hero } from '@/components/sections';
import { listFrameworks } from '@/lib/db';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ResourcesPage() {
  const FRAMEWORKS = await listFrameworks(true);
  return (
    <>
      <Hero
        subtitle="Framework vault"
        title="Signature models, ready to apply"
        description="A working vault of frameworks, with templates and guides added over time as each one is developed into a practical, shareable tool."
        cta={{ label: 'Explore Dreamscourt', href: '/dashboard' }}
        cta2={{ label: 'View all frameworks', href: '/frameworks' }}
      />

      <Section padding="xl" background="light">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
            {FRAMEWORKS.map((framework, index) => {
              const tone = index % 2 === 0 ? 'navy' : 'gold';
              return (
                <Link
                  key={framework.id}
                  href={`/frameworks/${framework.slug}`}
                  className={`group flex h-full flex-col gap-3 rounded-xl p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
                    tone === 'navy' ? 'bg-midnight-950 text-white' : 'bg-gold-600 text-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className={`text-[11px] font-semibold uppercase tracking-[0.1em] ${tone === 'navy' ? 'text-gold-300' : 'text-white/80'}`}>
                      {framework.category}
                    </span>
                    <ArrowUpRight size={16} className="shrink-0 text-white/60 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
                  </div>
                  <h3 className="text-[15px] font-semibold text-white">{framework.title}</h3>
                  <p className={`text-sm leading-6 flex-1 ${tone === 'navy' ? 'text-white/70' : 'text-white/85'}`}>{framework.description}</p>
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-white">
                    Open framework
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>

          <Card variant="bordered" padding="lg">
            <h2 className="text-lg font-semibold text-midnight-950 mb-3">In development</h2>
            <p className="text-sm text-gray-600 leading-6">
              Downloadable templates and implementation guides for each framework are actively being developed and will be added to the vault over time. In the meantime, Dreamscourt offers a live, interactive way to apply the reflective side of this work.
            </p>
          </Card>
        </Container>
      </Section>
    </>
  );
}
