import { Container, Section, Badge, Card } from '@/components/ui';
import { Hero } from '@/components/sections';
import { ArrowRight } from 'lucide-react';

const pillars = [
  {
    title: 'Faith-driven',
    description: 'Spiritual grounding as the foundation for strategic thinking and organizational excellence.',
  },
  {
    title: 'Systems-based',
    description: 'Designing integrated frameworks that create sustainable competitive advantage and institutional resilience.',
  },
  {
    title: 'Human-centered',
    description: 'Understanding neuroscience, psychology, and behavioral dynamics to drive personal and team transformation.',
  },
  {
    title: 'Intellectually rigorous',
    description: 'Grounding every framework in research, evidence, and time-tested principles across multiple domains.',
  },
];

const focusAreas = [
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
];

export default function AboutPage() {
  return (
    <>
      <Hero
        title="Building systems for lasting impact"
        description="A journey of discovery, innovation, and transformation across faith, leadership, technology, and human development."
      />

      <Section padding="xl">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
            <div>
              <h2 className="text-xl font-semibold text-midnight-950 mb-4 sm:text-2xl">
                The vision
              </h2>
              <p className="text-[15px] text-gray-600 mb-4 leading-7">
                At the intersection of faith, strategy, and innovation lies a powerful opportunity for transformation. This isn&apos;t about isolated success or individual achievement—it&apos;s about building systems, frameworks, and institutions that create lasting impact.
              </p>
              <p className="text-[15px] text-gray-600 leading-7">
                Livingstone operates at the nexus of multiple domains: theology and business, individual development and institutional capacity, ancient wisdom and cutting-edge innovation.
              </p>
            </div>
            <Card variant="bordered" padding="lg">
              <div className="text-gold-600 text-2xl mb-3">&#10022;</div>
              <p className="text-midnight-950 text-[15px] leading-7">
                &ldquo;Every framework here has been tested in the crucible of real-world application.&rdquo;
              </p>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px overflow-hidden rounded-lg border border-midnight-950/10 bg-midnight-950/10 mb-16">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="bg-white p-6">
                <h4 className="text-[15px] font-semibold text-midnight-950 mb-2">
                  {pillar.title}
                </h4>
                <p className="text-gray-600 text-sm leading-6">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mb-16">
            <h3 className="text-lg font-semibold text-midnight-950 mb-5">
              Areas of focus
            </h3>
            <div className="flex flex-wrap gap-2">
              {focusAreas.map((area) => (
                <Badge key={area} variant="outline">
                  {area}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
            <Card variant="bordered" padding="lg" className="order-2 lg:order-1">
              <div className="text-gold-600 text-2xl mb-3">&#10022;</div>
              <p className="text-midnight-950 text-[15px] leading-7">
                &ldquo;We believe in the power of frameworks to create clarity from complexity.&rdquo;
              </p>
            </Card>
            <div className="order-1 lg:order-2">
              <h3 className="text-xl font-semibold text-midnight-950 mb-4 sm:text-2xl">
                Philosophy
              </h3>
              <p className="text-[15px] text-gray-600 mb-4 leading-7">
                Transformation is not a destination but a continuous process. It requires understanding the interconnectedness of all systems—personal, organizational, cultural, and spiritual.
              </p>
              <p className="text-[15px] text-gray-600 leading-7">
                The most powerful changes come not from quick fixes but from building the right infrastructure, mindsets, and practices.
              </p>
            </div>
          </div>

          <Card variant="bordered" padding="xl">
            <h3 className="text-lg font-semibold text-midnight-950 mb-4">
              The ecosystem
            </h3>
            <p className="text-[15px] text-gray-600 mb-4 leading-7">
              Our work operates through multiple integrated channels. From one-on-one advisory to large institutional partnerships, from technology platforms to educational initiatives, we&apos;ve created an ecosystem designed to meet leaders and organizations wherever they are.
            </p>
            <p className="text-[15px] text-gray-600 leading-7">
              Whether through Dreamscourt&apos;s AI-powered personal development, House of Uphaz&apos;s institutional work, or our publishing efforts, every initiative is grounded in the same commitment: to help build a world where excellence, integrity, and transformative impact are the norm rather than the exception.
            </p>
          </Card>
        </Container>
      </Section>

      <Section padding="xl" background="light">
        <Container size="md">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-midnight-950 mb-2 sm:text-2xl">
              A personal journey
            </h2>
            <p className="text-[15px] text-gray-500">
              The work behind Livingstone
            </p>
          </div>
          <Card variant="elevated" padding="lg" className="max-w-3xl mx-auto">
            <p className="text-[15px] text-gray-600 mb-4 leading-7">
              This work didn&apos;t emerge from abstract theory. It comes from decades of lived experience—building businesses, developing leaders, navigating institutional complexity, studying at the intersection of theology and technology, and wrestling with the deepest questions of meaning, purpose, and impact.
            </p>
            <p className="text-[15px] text-gray-600 leading-7">
              Every framework here has been tested in the crucible of real-world application. Every insight comes from direct engagement with the challenges leaders and organizations actually face.
            </p>
          </Card>
        </Container>
      </Section>

      <Section padding="xl">
        <Container>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-midnight-950 mb-6 sm:text-2xl">
              Ready to explore our frameworks?
            </h2>
            <a href="/frameworks" className="group inline-flex items-center gap-2 rounded-md bg-midnight-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-midnight-800">
              Browse frameworks
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>
          </div>
        </Container>
      </Section>
    </>
  );
}
