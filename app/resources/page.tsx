import { Container, Section, Card } from '@/components/ui';
import { Hero } from '@/components/sections';
import Link from 'next/link';

export const metadata = {
  title: 'Resources | Livingstone',
  description: 'Tools, templates, guides, and resources for leadership, strategy, and transformation.',
};

export default function ResourcesPage() {
  const resources = [
    {
      title: 'Framework Templates',
      description: 'Downloadable templates for implementing our signature frameworks in your organization.',
      category: 'Tools',
    },
    {
      title: 'Reading List',
      description: 'Curated books, research papers, and resources that inform our thinking.',
      category: 'Learning',
    },
    {
      title: 'Strategic Planning Guide',
      description: 'Step-by-step guide for developing strategic plans using our integrated approach.',
      category: 'Guides',
    },
    {
      title: 'Leadership Assessment',
      description: 'Self-assessment tools for evaluating your leadership capabilities and growth areas.',
      category: 'Tools',
    },
    {
      title: 'Innovation Worksheets',
      description: 'Practical worksheets for identifying and evaluating innovation opportunities.',
      category: 'Tools',
    },
    {
      title: 'Research Papers',
      description: 'Original research on leadership, strategy, and organizational transformation.',
      category: 'Learning',
    },
  ];

  return (
    <>
      <Hero
        subtitle="Tools & Learning"
        title="Resources for Transformation"
        description="A curated collection of tools, guides, templates, and learning materials to support your leadership and organizational journey."
      />

      <Section padding="lg">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {resources.map((resource, idx) => (
              <Card key={idx} variant="bordered" hover>
                <div className="inline-block px-3 py-1 bg-gold-400 text-midnight-950 text-xs font-medium rounded-full mb-4">
                  {resource.category}
                </div>
                <h3 className="text-lg font-serif font-bold text-midnight-950 mb-3">
                  {resource.title}
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  {resource.description}
                </p>
              </Card>
            ))}
          </div>

          <div className="bg-light rounded-lg p-8 sm:p-12 text-center">
            <h2 className="text-3xl font-serif font-bold text-midnight-950 mb-4">
              Unlock Full Access
            </h2>
            <p className="text-lg text-stone-600 mb-6 max-w-2xl mx-auto">
              Access premium resources, exclusive frameworks, and community insights through our integrated platform.
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-8 py-3 bg-midnight-950 text-white font-medium rounded-lg hover:bg-midnight-800 transition-colors"
            >
              Join the Platform
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
