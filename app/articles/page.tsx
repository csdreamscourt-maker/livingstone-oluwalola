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
        subtitle="Insights & Perspectives"
        title="Latest Articles & Writings"
        description="Thoughtful perspectives on leadership, strategy, faith, innovation, and the frameworks that drive transformation."
      />

      <Section padding="2xl">
        <Container>
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-midnight-950 mb-8">
              Filter by Category
            </h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  selectedCategory === null
                    ? 'bg-gold-600 text-midnight-950 shadow-lg shadow-gold-600/30'
                    : 'border border-gray-300 text-midnight-950 hover:border-gold-600 hover:text-gold-600'
                }`}
              >
                All Articles
              </button>
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-gold-600 text-midnight-950 shadow-lg shadow-gold-600/30'
                      : 'border border-gray-300 text-midnight-950 hover:border-gold-600 hover:text-gold-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {filteredArticles.map((article, index) => (
              <Card
                key={article.id}
                variant="bordered"
                className="group flex flex-col h-full hover:border-gold-600 hover:shadow-lg transition-all duration-300 animate-slideUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-6">
                  <Badge variant="outline" className="group-hover:bg-gold-600 group-hover:text-midnight-950 transition-all">
                    {article.category}
                  </Badge>
                </div>

                <h3 className="text-xl font-serif font-bold text-midnight-950 mb-4 group-hover:text-gold-600 transition-colors leading-snug">
                  {article.title}
                </h3>

                <p className="text-gray-600 mb-8 flex-1 leading-relaxed">
                  {article.excerpt}
                </p>

                <div className="border-t border-gray-200 pt-6 flex items-center justify-between text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {article.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {article.readTime}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/articles/${article.id}`}
                  className="flex items-center gap-2 text-gold-600 hover:text-gold-700 font-semibold group/link transition-all"
                >
                  Read Article
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </Card>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-20">
              <p className="text-lg text-gray-600 mb-4">
                No articles found in this category.
              </p>
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-gold-600 hover:text-gold-700 font-semibold transition-colors"
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
