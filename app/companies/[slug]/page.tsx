import { Container, Section, Card, Badge } from '@/components/ui';
import { getCompanyBySlug } from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

type CompanyPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CompanyDetailPage({ params }: CompanyPageProps) {
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);

  if (!company || !company.is_published) {
    notFound();
  }

  return (
    <>
      <Section padding="xl">
        <Container>
          <div className="mb-8">
            <Link
              href="/companies"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-midnight-950 font-semibold transition-colors duration-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to companies
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <Card variant="bordered" padding="lg">
              {company.logo_url && (
                <div className="mb-5 inline-flex rounded-lg bg-black p-4">
                  <Image src={company.logo_url} alt={`${company.name} logo`} width={990} height={402} className="h-8 w-auto" />
                </div>
              )}
              <Badge variant="outline" className="mb-4">
                Active initiative
              </Badge>
              <h1 className="text-2xl font-semibold text-midnight-950 mb-3 sm:text-3xl">
                {company.name}
              </h1>
              {company.tagline && (
                <p className="text-[15px] text-gold-700 font-semibold mb-5">
                  {company.tagline}
                </p>
              )}
              {company.summary && (
                <p className="text-[15px] text-gray-600 leading-7 mb-6">
                  {company.summary}
                </p>
              )}

              {company.highlights && company.highlights.length > 0 && (
                <ul className="space-y-2">
                  {company.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-start gap-2.5 text-sm text-gray-600 leading-6"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold-600" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card variant="bordered" padding="lg">
              <h2 className="text-lg font-semibold mb-3 text-midnight-950">What this work looks like</h2>
              <p className="text-sm text-gray-600 leading-6">
                This initiative is part of Livingstone&rsquo;s broader ecosystem of mission-driven work, connecting faith, leadership, systems, and innovation in practical ways.
              </p>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
}
