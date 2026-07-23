import { Container, Section, Badge } from '@/components/ui';
import { getIdeasArticleBySlug } from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

type ArticlePageProps = {
  params: Promise<{ id: string }>;
};

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { id } = await params;
  const article = await getIdeasArticleBySlug(id);

  if (!article || !article.is_published) {
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

        {article.category && (
          <Badge variant="outline" className="mb-4">
            {article.category}
          </Badge>
        )}
        <h1 className="text-2xl font-semibold text-midnight-950 mb-4 sm:text-3xl leading-tight">
          {article.title}
        </h1>
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-10">
          {article.published_date && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(article.published_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          )}
          {article.read_time && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {article.read_time}
            </span>
          )}
        </div>

        {article.body && (
          <div className="space-y-5">
            {article.body.map((paragraph, index) => (
              <p key={index} className="text-[15px] text-gray-600 leading-7">
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
