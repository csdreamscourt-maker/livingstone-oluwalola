import { Container, Section, Button } from '@/components/ui';
import { Hero } from '@/components/sections';

export const metadata = {
  title: 'Speaking | Livingstone',
  description: 'Speaking engagements, conferences, and presentations on leadership, innovation, and transformation.',
};

export default function SpeakingPage() {
  return (
    <>
      <Hero
        subtitle="On the Platform"
        title="Speaking & Engagements"
        description="Bringing frameworks, insights, and vision to organizations, conferences, and communities around the world."
      />

      <Section padding="lg">
        <Container size="md">
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-stone-600 leading-relaxed mb-12">
              Speaking engagements range from keynote presentations to workshop facilitations, executive retreats, and institutional strategy sessions.
            </p>

            <div className="bg-stone-100 rounded-lg p-8">
              <h2 className="text-2xl font-serif font-bold text-midnight-950 mb-4 text-center">
                Interested in a Speaking Engagement?
              </h2>
              <p className="text-lg text-stone-600 mb-6 text-center">
                Let's explore how we can bring strategic insights and transformational frameworks to your organization or event.
              </p>
              <div className="flex justify-center">
                <Button href="/contact">Request an Engagement</Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
