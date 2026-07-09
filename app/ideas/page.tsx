import { Container, Section } from '@/components/ui';
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {THEMES.map((theme, index) => {
              const article = theme.articleId ? ARTICLES.find((a) => a.id === theme.articleId) : undefined;
              const tone = index % 2 === 0 ? 'navy' : 'gold';
              return (
                <div
                  key={theme.title}
                  className={`flex h-full flex-col gap-3 rounded-xl p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
                    tone === 'navy' ? 'bg-midnight-950 text-white' : 'bg-gold-600 text-white'
                  }`}
                >
                  <span className={`text-[11px] font-semibold uppercase tracking-[0.1em] w-fit ${tone === 'navy' ? 'text-gold-300' : 'text-white/80'}`}>
                    {theme.title}
                  </span>
                  <p className={`text-sm leading-6 flex-1 ${tone === 'navy' ? 'text-white/70' : 'text-white/85'}`}>
                    {theme.description}
                  </p>
                  {article ? (
                    <Link
                      href={`/articles/${article.id}`}
                      className="group flex items-center gap-1.5 text-sm font-semibold text-white transition-colors duration-200"
                    >
                      Read &ldquo;{article.title}&rdquo;
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Link>
                  ) : (
                    <span className={`text-sm italic ${tone === 'navy' ? 'text-white/40' : 'text-white/60'}`}>An essay on this theme is in progress.</span>
                  )}
                </div>
              );
            })}
          </div>
        </Container>
      </Section>
    </>
  );
}
