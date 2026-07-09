import { Container, Section, Badge } from '@/components/ui';
import { ARTICLES } from '@/lib/constants';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

type ArticlePageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return ARTICLES.map((article) => ({ id: article.id }));
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { id } = await params;
  const article = ARTICLES.find((a) => a.id === id);

  if (!article) {
    notFound();
  }

  return (
    <Section padding="xl">
      <Container size="md">
        <div className="mb-8">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-midnight-950 font-semibold transition-colors duration-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to articles
          </Link>
        </div>

        <Badge variant="outline" className="mb-4">
          {article.category}
        </Badge>
        <h1 className="text-2xl font-semibold text-midnight-950 mb-4 sm:text-3xl leading-tight">
          {article.title}
        </h1>
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-10">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {article.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {article.readTime}
          </span>
        </div>

        <div className="space-y-5">
          {article.body.map((paragraph, index) => (
            <p key={index} className="text-[15px] text-gray-600 leading-7">
              {paragraph}
            </p>
          ))}
        </div>
      </Container>
    </Section>
  );
}
