import { Container, Section, Button } from '@/components/ui';
import { Hero } from '@/components/sections';

export const metadata = {
  title: 'Ideas | Livingstone',
  description: 'Explore big ideas on leadership, strategy, innovation, and transformation.',
};

export default function IdeasPage() {
  return (
    <>
      <Hero
        subtitle="Thinking Forward"
        title="Ideas & Perspectives"
        description="Deep dives into the ideas that shape our work and the thinking that drives our approach to leadership and innovation."
      />

      <Section padding="lg">
        <Container size="md">
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-stone-600 leading-relaxed mb-12">
              This section will showcase in-depth explorations of the key ideas, concepts, and frameworks that shape our approach to leadership, innovation, and organizational transformation.
            </p>

            <div className="bg-stone-100 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-serif font-bold text-midnight-950 mb-4">
                Coming Soon
              </h2>
              <p className="text-lg text-stone-600 mb-6">
                We're preparing a collection of comprehensive essays and idea explorations.
              </p>
              <Button href="/articles">Explore Articles in the Meantime</Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
