import { Container, Section, Card, Badge, Button } from '@/components/ui';
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
        subtitle="Intellectual Infrastructure"
        title="Signature Frameworks & Models"
        description="A collection of signature frameworks designed to create clarity, drive strategy, and enable transformation across organizations and individuals."
      />

      <Section padding="2xl">
        <Container>
          <div className="mb-24">
            <div className="mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-midnight-950 mb-4">
                All Frameworks by Category
              </h2>
              <p className="text-xl text-gray-600">
                Industry-leading frameworks organized by domain of application
              </p>
            </div>

            {categories.map((category, categoryIndex) => (
              <div key={category} className="mb-20">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-1.5 h-10 bg-gradient-to-b from-gold-600 to-gold-500 rounded-full" />
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-midnight-950">
                    {category}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {FRAMEWORKS.filter((f) => f.category === category).map((framework, frameIndex) => (
                    <Card
                      key={framework.id}
                      variant="bordered"
                      className="group flex flex-col h-full hover:border-gold-600 hover:shadow-lg transition-all duration-300 animate-slideUp"
                      style={{ animationDelay: `${(categoryIndex * 3 + frameIndex) * 100}ms` }}
                    >
                      <Badge variant="outline" className="mb-4 w-fit group-hover:bg-gold-600 group-hover:text-midnight-950 transition-all">
                        {framework.category}
                      </Badge>
                      <h4 className="text-xl font-serif font-bold text-midnight-950 mb-3 group-hover:text-gold-600 transition-colors">
                        {framework.title}
                      </h4>
                      <p className="text-gray-600 leading-relaxed mb-6 flex-1">
                        {framework.description}
                      </p>
                      <Link
                        href={`/frameworks/${framework.id}`}
                        className="flex items-center gap-2 text-gold-600 hover:text-gold-700 font-semibold group/link transition-all"
                      >
                        Explore Framework
                        <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-midnight-900 via-midnight-800 to-midnight-950 p-12 md:p-16 border border-gold-600 border-opacity-20">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gold-500 opacity-5 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gold-500 opacity-5 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
                Ready to Apply These Frameworks?
              </h2>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl leading-relaxed">
                Access detailed framework guides, implementation templates, and community insights through our integrated platform. Transform your organization with proven intellectual systems.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gold-600 text-midnight-950 font-semibold rounded-lg hover:bg-gold-500 hover:shadow-lg hover:shadow-gold-500/50 transition-all duration-300 hover:scale-105 active:scale-95 group"
              >
                Access the Platform
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
