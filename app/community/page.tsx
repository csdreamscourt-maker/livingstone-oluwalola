import { Container, Section, Button } from '@/components/ui';
import { Hero } from '@/components/sections';

export const metadata = {
  title: 'Community | Livingstone',
  description: 'Join a global community of leaders committed to excellence, impact, and transformation.',
};

export default function CommunityPage() {
  return (
    <>
      <Hero
        subtitle="Together"
        title="Join Our Community"
        description="Connect with leaders, entrepreneurs, and innovators committed to building excellence and creating lasting impact."
      />

      <Section padding="lg">
        <Container size="md">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-serif font-bold text-midnight-950 mb-6">
              A Community of Purpose
            </h2>

            <p className="text-lg text-stone-600 leading-relaxed mb-8">
              Our community brings together leaders from diverse backgrounds—business executives, nonprofit directors, academics, faith leaders, and innovators—united by a commitment to transformational impact.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
              {[
                {
                  title: 'Monthly Masterminds',
                  description: 'Executive roundtables exploring strategic challenges and opportunities.',
                },
                {
                  title: 'Framework Deep Dives',
                  description: 'Guided explorations of our signature frameworks with peer discussion.',
                },
                {
                  title: 'Expert Q&A',
                  description: 'Direct access to thought leaders for guidance on your specific challenges.',
                },
                {
                  title: 'Resource Library',
                  description: 'Exclusive access to templates, research, and implementation guides.',
                },
                {
                  title: 'Peer Network',
                  description: 'Connect with others on similar transformation journeys.',
                },
                {
                  title: 'Annual Summit',
                  description: 'Gather in person for vision, strategy, and deep relationship building.',
                },
              ].map((benefit) => (
                <div key={benefit.title} className="border-l-4 border-gold-600 pl-6">
                  <h3 className="text-lg font-serif font-bold text-midnight-950 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-stone-600">{benefit.description}</p>
                </div>
              ))}
            </div>

            <div className="bg-stone-100 rounded-lg p-8 sm:p-12 text-center">
              <h2 className="text-2xl font-serif font-bold text-midnight-950 mb-4">
                Ready to Connect?
              </h2>
              <p className="text-lg text-stone-600 mb-6">
                Join a global network of leaders committed to excellence and transformation.
              </p>
              <Button href="/dashboard" size="lg">
                Get Started
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
