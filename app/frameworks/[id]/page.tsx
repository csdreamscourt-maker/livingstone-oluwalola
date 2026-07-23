import { Container, Section, Card, Badge } from '@/components/ui';
import { getFrameworkBySlug } from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';

type FrameworkPageProps = {
  params: Promise<{ id: string }>;
};

export default async function FrameworkDetailPage({ params }: FrameworkPageProps) {
  const { id } = await params;
  const framework = await getFrameworkBySlug(id);

  if (!framework || !framework.is_published) {
    notFound();
  }

  return (
    <Section padding="xl">
      <Container size="md">
        <div className="mb-8">
          <Link
            href="/frameworks"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-midnight-950 font-semibold transition-colors duration-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to frameworks
          </Link>
        </div>

        {framework.category && (
          <Badge variant="outline" className="mb-4">
            {framework.category}
          </Badge>
        )}
        <h1 className="text-2xl font-semibold text-midnight-950 mb-4 sm:text-3xl">
          {framework.title}
        </h1>
        {framework.overview && (
          <p className="text-[15px] text-gray-600 leading-7 mb-10">
            {framework.overview}
          </p>
        )}

        {framework.applications && framework.applications.length > 0 && (
          <Card variant="bordered" padding="lg" className="mb-10">
            <h2 className="text-lg font-semibold text-midnight-950 mb-4">Where this applies</h2>
            <ul className="space-y-2.5">
              {framework.applications.map((application) => (
                <li key={application} className="flex items-start gap-2.5 text-sm text-gray-600 leading-6">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold-600" />
                  {application}
                </li>
              ))}
            </ul>
          </Card>
        )}

        <div className="text-center">
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-md bg-midnight-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-midnight-800"
          >
            Discuss this framework
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
