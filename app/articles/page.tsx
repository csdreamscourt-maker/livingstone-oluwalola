'use client';

import { useState } from 'react';
import { Container, Section, Card, Badge } from '@/components/ui';
import { Hero } from '@/components/sections';
import { SAMPLE_ARTICLES } from '@/lib/constants';
import Link from 'next/link';
import { ArrowRight, Calendar, Clock } from 'lucide-react';

const CATEGORIES = Array.from(new Set(SAMPLE_ARTICLES.map((a) => a.category)));

export default function ArticlesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredArticles = selectedCategory
    ? SAMPLE_ARTICLES.filter((a) => a.category === selectedCategory)
    : SAMPLE_ARTICLES;

  return (
    <>
      <Hero
        subtitle="Insights & perspectives"
        title="Latest articles & writings"
        description="Thoughtful perspectives on leadership, strategy, faith, innovation, and the frameworks that drive transformation."
      />

      <Section padding="xl">
        <Container>
          <div className="mb-10 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-200 ${
                selectedCategory === null
                  ? 'bg-midnight-950 text-white'
                  : 'border border-midnight-950/15 text-midnight-950 hover:border-midnight-950/30'
              }`}
            >
              All articles
            </button>
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-200 ${
                  selectedCategory === category
                    ? 'bg-midnight-950 text-white'
                    : 'border border-midnight-950/15 text-midnight-950 hover:border-midnight-950/30'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            {filteredArticles.map((article) => (
              <Card
                key={article.id}
                variant="bordered"
                className="group flex flex-col h-full"
              >
                <Badge variant="outline" className="mb-4 w-fit">
                  {article.category}
                </Badge>

                <h3 className="text-[15px] font-semibold text-midnight-950 mb-3 leading-snug">
                  {article.title}
                </h3>

                <p className="text-gray-600 mb-6 flex-1 text-sm leading-6">
                  {article.excerpt}
                </p>

                <div className="border-t border-midnight-950/8 pt-4 flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {article.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {article.readTime}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/articles/${article.id}`}
                  className="flex items-center gap-1.5 text-sm text-midnight-700 hover:text-midnight-950 font-semibold group/link transition-colors duration-200"
                >
                  Read article
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5" />
                </Link>
              </Card>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-16">
              <p className="text-[15px] text-gray-600 mb-4">
                No articles found in this category.
              </p>
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-midnight-700 hover:text-midnight-950 font-semibold text-sm transition-colors duration-200"
              >
                View all articles
              </button>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
