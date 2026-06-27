import { Container, Section, Card, Badge, Button } from '@/components/ui';
import { Hero } from '@/components/sections';
import { FRAMEWORKS } from '@/lib/constants';
import Link from 'next/link';

export const metadata = {
  title: 'Frameworks | Livingstone',
  description: 'Explore signature intellectual models and systems for leadership, strategy, and transformation.',
};

export default function FrameworksPage() {
  const categories = Array.from(new Set(FRAMEWORKS.map((f) => f.category)));

  return (
    <>
      <Hero
        subtitle="Intellectual Infrastructure"
        title="Signature Frameworks & Models"
        description="A collection of signature frameworks designed to create clarity, drive strategy, and enable transformation across organizations and individuals."
      />

      <Section padding="lg">
        <Container>
          <div className="mb-16">
            <h2 className="text-3xl font-serif font-bold text-midnight-950 mb-8">
              All Frameworks by Category
            </h2>

            {categories.map((category) => (
              <div key={category} className="mb-16">
                <h3 className="text-xl font-serif font-bold text-midnight-950 mb-6 flex items-center">
                  <span className="w-1 h-8 bg-gold-600 mr-4 rounded" />
                  {category}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-4">
                  {FRAMEWORKS.filter((f) => f.category === category).map((framework) => (
                    <Card
                      key={framework.id}
                      variant="bordered"
                      hover
                      className="flex flex-col"
                    >
                      <Badge variant="primary" className="mb-3 w-fit">
                        {framework.category}
                      </Badge>
                      <h4 className="text-lg font-serif font-bold text-midnight-950 mb-3">
                        {framework.title}
                      </h4>
                      <p className="text-stone-600 text-sm leading-relaxed mb-6 flex-1">
                        {framework.description}
                      </p>
                      <Link
                        href={`/frameworks/${framework.id}`}
                        className="text-sm font-medium text-gold-600 hover:text-gold-700 transition-colors"
                      >
                        Explore Framework →
                      </Link>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-stone-200 pt-12">
            <h2 className="text-2xl font-serif font-bold text-midnight-950 mb-6">
              Ready to Apply These Frameworks?
            </h2>
            <p className="text-lg text-stone-600 mb-8 max-w-2xl">
              Access detailed framework guides, implementation templates, and community insights through our integrated platform.
            </p>
            <Button href="/dashboard" size="lg">
              Access the Platform
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
