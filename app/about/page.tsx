'use client';

import { Container, Section, Badge, Card } from '@/components/ui';
import { Hero } from '@/components/sections';
import { ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <>
      <Hero
        title="Building Systems for Lasting Impact"
        description="A journey of discovery, innovation, and transformation across faith, leadership, technology, and human development."
      />

      <Section padding="2xl">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-midnight-950 mb-6 leading-tight">
                The Vision
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                At the intersection of faith, strategy, and innovation lies a powerful opportunity for transformation. This isn't about isolated success or individual achievement—it's about building systems, frameworks, and institutions that create lasting impact.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Livingstone operates at the nexus of multiple domains: theology and business, individual development and institutional capacity, ancient wisdom and cutting-edge innovation. This unique positioning enables the creation of integrated frameworks that address the wholeness of human and organizational transformation.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-gold-500 opacity-5 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-midnight-900 opacity-5 rounded-full blur-3xl" />
              <div className="relative z-10 bg-gradient-to-br from-midnight-900 to-midnight-950 rounded-2xl p-8 border border-gold-600 border-opacity-20">
                <div className="text-gold-600 text-5xl font-serif font-bold mb-4">✦</div>
                <p className="text-white text-lg leading-relaxed">
                  "Every framework here has been tested in the crucible of real-world application."
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {[
              {
                icon: '◆',
                title: 'Faith-Driven',
                description:
                  'Spiritual grounding as the foundation for strategic thinking and organizational excellence.',
              },
              {
                icon: '◆',
                title: 'Systems-Based',
                description:
                  'Designing integrated frameworks that create sustainable competitive advantage and institutional resilience.',
              },
              {
                icon: '◆',
                title: 'Human-Centered',
                description:
                  'Understanding neuroscience, psychology, and behavioral dynamics to drive personal and team transformation.',
              },
              {
                icon: '◆',
                title: 'Intellectually Rigorous',
                description:
                  'Grounding every framework in research, evidence, and time-tested principles across multiple domains.',
              },
            ].map((pillar, index) => (
              <Card
                key={pillar.title}
                variant="bordered"
                className="group hover:border-gold-600 transition-all duration-300 animate-slideUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex gap-4">
                  <div className="text-gold-600 text-3xl flex-shrink-0 group-hover:text-gold-500 transition-colors">
                    {pillar.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-serif font-bold text-midnight-950 mb-2 group-hover:text-gold-600 transition-colors">
                      {pillar.title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mb-20">
            <h3 className="text-3xl font-serif font-bold text-midnight-950 mb-8">
              Areas of Focus
            </h3>
            <div className="flex flex-wrap gap-3">
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
                <Badge key={area} variant="outline" className="hover:bg-gold-600 hover:text-midnight-950 transition-colors">
                  {area}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute -top-20 -left-20 w-60 h-60 bg-gold-500 opacity-5 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-midnight-900 opacity-5 rounded-full blur-3xl" />
              <div className="relative z-10 bg-gradient-to-br from-midnight-900 to-midnight-950 rounded-2xl p-8 border border-gold-600 border-opacity-20">
                <div className="text-gold-600 text-5xl font-serif font-bold mb-4">✦</div>
                <p className="text-white text-lg leading-relaxed">
                  "We believe in the power of frameworks to create clarity from complexity."
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h3 className="text-3xl font-serif font-bold text-midnight-950 mb-6">
                Philosophy
              </h3>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Transformation is not a destination but a continuous process. It requires understanding the interconnectedness of all systems—personal, organizational, cultural, and spiritual.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                The most powerful changes come not from quick fixes but from building the right infrastructure, mindsets, and practices. Every tool we develop is designed to help individuals and organizations think systematically, act strategically, and maintain integrity in their mission.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-midnight-900 via-midnight-800 to-midnight-950 rounded-2xl p-12 md:p-16 border border-gold-600 border-opacity-20 mb-20">
            <h3 className="text-3xl font-serif font-bold text-white mb-8">
              The Ecosystem
            </h3>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Our work operates through multiple integrated channels. From one-on-one advisory to large institutional partnerships, from technology platforms to educational initiatives, we've created an ecosystem designed to meet leaders and organizations wherever they are.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              Whether through Dreamscourt's AI-powered personal development, House of Uphaz's institutional work, or our publishing efforts, every initiative is grounded in the same commitment: to help build a world where excellence, integrity, and transformative impact are the norm rather than the exception.
            </p>
          </div>
        </Container>
      </Section>

      <Section padding="2xl" background="light">
        <Container size="md">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-midnight-950 mb-6 leading-tight">
              A Personal Journey
            </h2>
            <p className="text-xl text-gray-600">
              The work behind Livingstone
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <Card variant="elevated" className="mb-8">
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                This work didn't emerge from abstract theory. It comes from decades of lived experience—building businesses, developing leaders, navigating institutional complexity, studying at the intersection of theology and technology, and wrestling with the deepest questions of meaning, purpose, and impact.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Every framework here has been tested in the crucible of real-world application. Every insight comes from direct engagement with the challenges leaders and organizations actually face. This is practical wisdom, not theoretical abstraction.
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      <Section padding="2xl">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-midnight-950 mb-8">
              Ready to Explore Our Frameworks?
            </h2>
            <a href="/frameworks" className="inline-flex items-center gap-2 px-8 py-4 bg-gold-600 text-midnight-950 font-semibold rounded-lg hover:bg-gold-500 hover:shadow-lg hover:shadow-gold-500/50 transition-all duration-300 hover:scale-105 active:scale-95 group">
              Browse Frameworks
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </Container>
      </Section>
    </>
  );
}
