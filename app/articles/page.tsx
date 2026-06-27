'use client';

import { useState } from 'react';
import { Container, Section, Card, Badge } from '@/components/ui';
import { Hero } from '@/components/sections';
import { SAMPLE_ARTICLES } from '@/lib/constants';
import Link from 'next/link';

const CATEGORIES = Array.from(new Set(SAMPLE_ARTICLES.map((a) => a.category)));

export default function ArticlesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredArticles = selectedCategory
    ? SAMPLE_ARTICLES.filter((a) => a.category === selectedCategory)
    : SAMPLE_ARTICLES;

  return (
    <>
      <Hero
        subtitle="Insights & Perspectives"
        title="Latest Articles & Writings"
        description="Thoughtful perspectives on leadership, strategy, faith, innovation, and the frameworks that drive transformation."
      />

      <Section padding="lg">
        <Container>
          <div className="mb-12">
            <h2 className="text-2xl font-serif font-bold text-midnight-950 mb-6">
              Filter by Category
            </h2>
            <div className="flex flex-wrap gap-3 mb-12">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === null
                    ? 'bg-midnight-950 text-white'
                    : 'bg-stone-200 text-midnight-950 hover:bg-stone-300'
                }`}
              >
                All Articles
              </button>
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-midnight-950 text-white'
                      : 'bg-stone-200 text-midnight-950 hover:bg-stone-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredArticles.map((article) => (
              <Card key={article.id} variant="bordered" hover className="flex flex-col">
                <div className="mb-4">
                  <Badge variant="primary">{article.category}</Badge>
                </div>

                <h3 className="text-xl font-serif font-bold text-midnight-950 mb-3">
                  {article.title}
                </h3>

                <p className="text-stone-600 mb-6 flex-1 leading-relaxed">
                  {article.excerpt}
                </p>

                <div className="border-t border-stone-200 pt-4 flex justify-between items-center text-sm text-stone-500">
                  <span>{article.date}</span>
                  <span>{article.readTime}</span>
                </div>

                <Link
                  href={`/articles/${article.id}`}
                  className="text-sm font-medium text-gold-600 hover:text-gold-700 transition-colors mt-4"
                >
                  Read Article →
                </Link>
              </Card>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-stone-600">
                No articles found in this category. Try another selection.
              </p>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
