import { Container, Section, Badge } from '@/components/ui';
import { Hero } from '@/components/sections';

export default function AboutPage() {
  return (
    <>
      <Hero
        title="Building Systems for Lasting Impact"
        description="A journey of discovery, innovation, and transformation across faith, leadership, technology, and human development."
      />

      <Section padding="lg">
        <Container size="md">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-4xl font-serif font-bold text-midnight-950 mb-6">
              The Vision
            </h2>
            <p className="text-lg text-stone-600 mb-8 leading-relaxed">
              At the intersection of faith, strategy, and innovation lies a powerful opportunity for transformation. This isn't about isolated success or individual achievement—it's about building systems, frameworks, and institutions that create lasting impact.
            </p>

            <p className="text-lg text-stone-600 mb-12 leading-relaxed">
              Livingstone operates at the nexus of multiple domains: theology and business, individual development and institutional capacity, ancient wisdom and cutting-edge innovation. This unique positioning enables the creation of integrated frameworks that address the wholeness of human and organizational transformation.
            </p>

            <h3 className="text-3xl font-serif font-bold text-midnight-950 mt-12 mb-6">
              Core Pillars
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {[
                {
                  title: 'Faith-Driven',
                  description:
                    'Spiritual grounding as the foundation for strategic thinking and organizational excellence.',
                },
                {
                  title: 'Systems-Based',
                  description:
                    'Designing integrated frameworks that create sustainable competitive advantage and institutional resilience.',
                },
                {
                  title: 'Human-Centered',
                  description:
                    'Understanding neuroscience, psychology, and behavioral dynamics to drive personal and team transformation.',
                },
                {
                  title: 'Intellectually Rigorous',
                  description:
                    'Grounding every framework in research, evidence, and time-tested principles across multiple domains.',
                },
              ].map((pillar) => (
                <div key={pillar.title} className="border-l-4 border-gold-600 pl-6">
                  <h4 className="text-xl font-serif font-bold text-midnight-950 mb-3">
                    {pillar.title}
                  </h4>
                  <p className="text-stone-600 leading-relaxed">{pillar.description}</p>
                </div>
              ))}
            </div>

            <h3 className="text-3xl font-serif font-bold text-midnight-950 mt-12 mb-6">
              Areas of Focus
            </h3>
            <div className="mb-12">
              {[
                'Leadership Development',
                'Institutional Transformation',
                'Strategic Innovation',
                'Human Potential',
                'Faith Integration',
                'Technology Solutions',
                'Organizational Design',
                'Systems Thinking',
                'Neuroscience Applications',
                'Educational Models',
                'Media & Communication',
                'Social Impact',
              ].map((area) => (
                <Badge key={area} variant="secondary" className="mr-2 mb-2 inline-block">
                  {area}
                </Badge>
              ))}
            </div>

            <h3 className="text-3xl font-serif font-bold text-midnight-950 mt-12 mb-6">
              Philosophy
            </h3>
            <p className="text-lg text-stone-600 mb-8 leading-relaxed">
              Transformation is not a destination but a continuous process. It requires understanding the interconnectedness of all systems—personal, organizational, cultural, and spiritual. The most powerful changes come not from quick fixes but from building the right infrastructure, mindsets, and practices.
            </p>

            <p className="text-lg text-stone-600 mb-8 leading-relaxed">
              We believe in the power of frameworks to create clarity from complexity. Every tool we develop is designed to help individuals and organizations think systematically, act strategically, and maintain integrity in their mission.
            </p>

            <h3 className="text-3xl font-serif font-bold text-midnight-950 mt-12 mb-6">
              The Ecosystem
            </h3>
            <p className="text-lg text-stone-600 mb-8 leading-relaxed">
              Our work operates through multiple integrated channels. From one-on-one advisory to large institutional partnerships, from technology platforms to educational initiatives, we've created an ecosystem designed to meet leaders and organizations wherever they are.
            </p>

            <p className="text-lg text-stone-600 leading-relaxed">
              Whether through Dreamscourt's AI-powered personal development, House of Uphaz's institutional work, or our publishing efforts, every initiative is grounded in the same commitment: to help build a world where excellence, integrity, and transformative impact are the norm rather than the exception.
            </p>
          </div>
        </Container>
      </Section>

      <Section padding="lg" background="light">
        <Container size="md">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-midnight-950 mb-8 text-center">
            A Personal Journey
          </h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-stone-600 mb-6 leading-relaxed">
              This work didn't emerge from abstract theory. It comes from decades of lived experience—building businesses, developing leaders, navigating institutional complexity, studying at the intersection of theology and technology, and wrestling with the deepest questions of meaning, purpose, and impact.
            </p>
            <p className="text-lg text-stone-600 leading-relaxed">
              Every framework here has been tested in the crucible of real-world application. Every insight comes from direct engagement with the challenges leaders and organizations actually face. This is practical wisdom, not theoretical abstraction.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
