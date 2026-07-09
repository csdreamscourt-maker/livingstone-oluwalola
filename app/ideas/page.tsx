import { Container, Section, Card, Badge } from '@/components/ui';
import { Hero } from '@/components/sections';
import { ARTICLES } from '@/lib/constants';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const THEMES: { title: string; description: string; articleId?: string }[] = [
  {
    title: 'Mind Engineering',
    description: 'Deliberately shaping thought patterns, convictions, and mental infrastructure for high-level execution.',
  },
  {
    title: 'Outlier Potential',
    description: 'Breaking free from conventional thinking to access uncommon results.',
    articleId: 'outlier-edge',
  },
  {
    title: 'Redemptive Sagacity',
    description: 'Sourcing strategic wisdom from eternal principle rather than preference.',
    articleId: 'faith-and-strategy',
  },
  {
    title: 'Nation Building',
    description: 'Institutional design for leaders working at the scale of communities and nations.',
    articleId: 'building-what-lasts',
  },
  {
    title: 'Building Convictions',
    description: 'The character and clarity of purpose that outlast circumstance.',
  },
  {
    title: 'Leadership',
    description: 'Guiding people and institutions with both authority and humility.',
  },
  {
    title: 'Social Constructs',
    description: 'Questioning inherited norms that quietly shape what people believe is possible.',
  },
  {
    title: 'Entrepreneurship',
    description: 'Building ventures that generate both profit and lasting impact.',
  },
];

export default function IdeasPage() {
  return (
    <>
      <Hero
        subtitle="Intellectual exploration"
        title="The Ideas Library"
        description="A growing collection of essays organized around the themes that anchor this work — faith, systems thinking, leadership, and outlier strategy."
      />

      <Section padding="xl">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {THEMES.map((theme) => {
              const article = theme.articleId ? ARTICLES.find((a) => a.id === theme.articleId) : undefined;
              return (
                <Card key={theme.title} variant="bordered" className="flex flex-col h-full">
                  <Badge variant="outline" className="mb-3 w-fit">
                    {theme.title}
                  </Badge>
                  <p className="text-sm text-gray-600 leading-6 mb-5 flex-1">
                    {theme.description}
                  </p>
                  {article ? (
                    <Link
                      href={`/articles/${article.id}`}
                      className="flex items-center gap-1.5 text-sm text-midnight-700 hover:text-midnight-950 font-semibold group transition-colors duration-200"
                    >
                      Read &ldquo;{article.title}&rdquo;
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Link>
                  ) : (
                    <span className="text-sm text-gray-400 italic">An essay on this theme is in progress.</span>
                  )}
                </Card>
              );
            })}
          </div>
        </Container>
      </Section>
    </>
  );
}
