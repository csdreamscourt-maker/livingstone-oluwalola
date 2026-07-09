import { Container, Section, Card, Badge } from '@/components/ui';
import { Hero } from '@/components/sections';
import { FRAMEWORKS } from '@/lib/constants';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function ResourcesPage() {
  return (
    <>
      <Hero
        subtitle="Framework vault"
        title="Signature models, ready to apply"
        description="A working vault of frameworks, with templates and guides added over time as each one is developed into a practical, shareable tool."
        cta={{ label: 'Explore Dreamscourt', href: '/dashboard' }}
        cta2={{ label: 'View all frameworks', href: '/frameworks' }}
      />

      <Section padding="xl">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
            {FRAMEWORKS.map((framework) => (
              <Card key={framework.id} variant="bordered" className="flex flex-col h-full">
                <Badge variant="outline" className="mb-3 w-fit">
                  {framework.category}
                </Badge>
                <h3 className="text-[15px] font-semibold text-midnight-950 mb-2">{framework.title}</h3>
                <p className="text-sm text-gray-600 leading-6 mb-5 flex-1">{framework.description}</p>
                <Link
                  href={`/frameworks/${framework.id}`}
                  className="flex items-center gap-1.5 text-sm text-midnight-700 hover:text-midnight-950 font-semibold group transition-colors duration-200"
                >
                  Open framework
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </Card>
            ))}
          </div>

          <Card variant="bordered" padding="lg">
            <h2 className="text-lg font-semibold text-midnight-950 mb-3">In development</h2>
            <p className="text-sm text-gray-600 leading-6">
              Downloadable templates and implementation guides for each framework are actively being developed and will be added to the vault over time. In the meantime, Dreamscourt offers a live, interactive way to apply the reflective side of this work.
            </p>
          </Card>
        </Container>
      </Section>
    </>
  );
}
