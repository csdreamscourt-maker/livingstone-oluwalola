import { Container, Section, Card } from '@/components/ui';
import { Hero } from '@/components/sections';
import { listFrameworks } from '@/lib/db';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

export const metadata = {
  title: 'Frameworks | Livingstone',
  description: 'Explore signature intellectual models and systems for leadership, strategy, and transformation.',
};

export const dynamic = 'force-dynamic';

export default async function FrameworksPage() {
  const FRAMEWORKS = await listFrameworks(true);
  const categories = Array.from(new Set(FRAMEWORKS.map((f) => f.category)));
  let tileIndex = 0;

  return (
    <>
      <Hero
        subtitle="Intellectual infrastructure"
        title="Signature frameworks & models"
        description="A collection of signature frameworks designed to create clarity, drive strategy, and enable transformation across organizations and individuals."
      />

      <Section padding="xl">
        <Container>
          <div className="mb-16">
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-midnight-950 mb-2 sm:text-2xl">
                All frameworks by category
              </h2>
              <p className="text-[15px] text-gray-500">
                Organized by domain of application
              </p>
            </div>

            {categories.map((category) => (
              <div key={category} className="mb-14">
                <h3 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-gray-500 mb-6 pb-3 border-b border-midnight-950/10">
                  {category}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {FRAMEWORKS.filter((f) => f.category === category).map((framework) => {
                    const tone = tileIndex % 2 === 0 ? 'navy' : 'gold';
                    tileIndex += 1;
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
                        <h4 className="text-[15px] font-semibold text-white">
                          {framework.title}
                        </h4>
                        <p className={`text-sm leading-6 flex-1 ${tone === 'navy' ? 'text-white/70' : 'text-white/85'}`}>
                          {framework.description}
                        </p>
                        <span className="flex items-center gap-1.5 text-sm font-semibold text-white">
                          Explore framework
                          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <Card variant="gold" padding="xl">
            <h2 className="text-xl font-semibold text-white mb-3 sm:text-2xl">
              Ready to apply these frameworks?
            </h2>
            <p className="text-[15px] text-white/85 mb-6 max-w-2xl leading-7">
              Access detailed framework guides, implementation templates, and community insights through our integrated platform.
            </p>
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-midnight-950 transition-all duration-200 hover:scale-[1.03] hover:bg-gray-50 active:scale-[0.98]"
            >
              Access the platform
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </Card>
        </Container>
      </Section>
    </>
  );
}
