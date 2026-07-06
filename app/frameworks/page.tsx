import { Container, Section, Card, Badge } from '@/components/ui';
import { Hero } from '@/components/sections';
import { FRAMEWORKS } from '@/lib/constants';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Frameworks | Livingstone',
  description: 'Explore signature intellectual models and systems for leadership, strategy, and transformation.',
};

export default function FrameworksPage() {
  const categories = Array.from(new Set(FRAMEWORKS.map((f) => f.category)));

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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {FRAMEWORKS.filter((f) => f.category === category).map((framework) => (
                    <Card
                      key={framework.id}
                      variant="bordered"
                      className="group flex flex-col h-full"
                    >
                      <Badge variant="outline" className="mb-3 w-fit">
                        {framework.category}
                      </Badge>
                      <h4 className="text-[15px] font-semibold text-midnight-950 mb-2">
                        {framework.title}
                      </h4>
                      <p className="text-gray-600 text-sm leading-6 mb-5 flex-1">
                        {framework.description}
                      </p>
                      <Link
                        href={`/frameworks/${framework.id}`}
                        className="flex items-center gap-1.5 text-sm text-midnight-700 hover:text-midnight-950 font-semibold group/link transition-colors duration-200"
                      >
                        Explore framework
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5" />
                      </Link>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Card variant="bordered" padding="xl">
            <h2 className="text-xl font-semibold text-midnight-950 mb-3 sm:text-2xl">
              Ready to apply these frameworks?
            </h2>
            <p className="text-[15px] text-gray-600 mb-6 max-w-2xl leading-7">
              Access detailed framework guides, implementation templates, and community insights through our integrated platform.
            </p>
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 rounded-md bg-midnight-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-midnight-800"
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
