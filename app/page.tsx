import { Hero, FeaturedContent, NewsletterCTA } from '@/components/sections';
import { Container, Section, Button } from '@/components/ui';
import { FRAMEWORKS, COMPANIES, SAMPLE_ARTICLES } from '@/lib/constants';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Hero
        subtitle="Welcome to"
        title="The Digital Headquarters of Leadership & Innovation"
        description="Explore frameworks, ideas, and systems for building people, businesses, and institutions through faith-driven strategic thinking."
        cta={{ label: 'Explore Frameworks', href: '/frameworks' }}
        cta2={{ label: 'Read Latest Insights', href: '/articles' }}
      />

      <Section padding="lg" background="light">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-sm font-medium text-gold-600 mb-4 uppercase tracking-wider">
              Our Philosophy
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-midnight-950 mb-6">
              Building Systems That Transform
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed">
              At the intersection of faith, leadership, technology, and human development lies a
              powerful opportunity. We believe lasting transformation happens when vision, systems,
              and people align. Our work spans institutional development, strategic innovation, and
              human capacity building.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                number: '7',
                label: 'Operating Companies',
              },
              {
                number: '100+',
                label: 'Frameworks & Models',
              },
              {
                number: '1000+',
                label: 'Leaders Impacted',
              },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-5xl font-serif font-bold text-gold-600 mb-2">
                  {stat.number}
                </p>
                <p className="text-lg text-stone-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <FeaturedContent
        subtitle="Signature Systems"
        title="Frameworks for Transformation"
        items={FRAMEWORKS.map((fw) => ({
          id: fw.id,
          title: fw.title,
          description: fw.description,
          category: fw.category,
          href: `/frameworks/${fw.id}`,
        }))}
        viewAllHref="/frameworks"
        viewAllLabel="Explore All Frameworks"
      />

      <Section padding="lg" background="white">
        <Container>
          <div className="mb-12">
            <p className="text-sm font-medium text-gold-600 mb-2 uppercase tracking-wider">
              Our Ecosystem
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-midnight-950 mb-4">
              Companies & Initiatives
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl">
              A collection of mission-driven organizations operating at the frontlines of
              leadership, technology, and social impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {COMPANIES.slice(0, 6).map((company) => (
              <Link
                key={company.id}
                href={company.href}
                className="group p-6 rounded-lg border border-stone-200 hover:border-gold-600 hover:bg-stone-50 transition-all"
              >
                <h3 className="text-lg font-serif font-bold text-midnight-950 mb-2 group-hover:text-gold-600 transition-colors">
                  {company.name}
                </h3>
                <p className="text-sm text-stone-600">{company.description}</p>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/companies"
              className="text-base font-medium text-midnight-950 hover:text-gold-600 transition-colors"
            >
              View All Companies →
            </Link>
          </div>
        </Container>
      </Section>

      <FeaturedContent
        subtitle="Latest Insights"
        title="Articles & Perspectives"
        items={SAMPLE_ARTICLES.map((article) => ({
          id: article.id,
          title: article.title,
          description: article.excerpt,
          category: article.category,
          metadata: `${article.date} • ${article.readTime}`,
        }))}
        viewAllHref="/articles"
        viewAllLabel="Read All Articles"
      />

      <NewsletterCTA />

      <Section padding="lg" background="midnight-950">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-6">
              Ready to Transform Your Leadership?
            </h2>
            <p className="text-lg text-stone-200 mb-8">
              Join thousands of leaders accessing tools, frameworks, and community through our
              integrated platform.
            </p>
            <Button href="/contact" size="lg" variant="primary" className="bg-gold-600 text-midnight-950 hover:bg-gold-500">
              Get Started
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
