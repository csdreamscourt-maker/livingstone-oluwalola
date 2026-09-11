'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Eyebrow, GlassCard, IconBadge } from '../ui';
import { ArrowUpRight, BookOpen, Search, Sparkles } from 'lucide-react';
import { DREAM_SYMBOL_CATEGORIES } from '@/lib/dreamSymbolCategories';
import type { DreamArticle, DreamSymbol } from '@/types/database';

const UNCATEGORIZED = 'Uncategorized';

export function LibraryView() {
  const [tab, setTab] = useState<'symbols' | 'articles'>('symbols');
  const [symbols, setSymbols] = useState<DreamSymbol[]>([]);
  const [articles, setArticles] = useState<DreamArticle[]>([]);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [symbolsRes, articlesRes] = await Promise.all([fetch('/api/dream-symbols'), fetch('/api/dream-articles')]);
      if (symbolsRes.ok) setSymbols((await symbolsRes.json()).symbols);
      if (articlesRes.ok) setArticles((await articlesRes.json()).articles);
      setLoading(false);
    })();
  }, []);

  const filteredSymbols = symbols.filter((symbol) => symbol.term.toLowerCase().includes(query.trim().toLowerCase()));

  const categoriesInUse = useMemo(
    () => DREAM_SYMBOL_CATEGORIES.filter((c) => symbols.some((s) => s.category === c)),
    [symbols]
  );

  const groupedSymbols = useMemo(() => {
    const groups: { category: string; items: DreamSymbol[] }[] = [];
    const order = activeCategory === 'All' ? [...categoriesInUse, UNCATEGORIZED] : [activeCategory];
    for (const category of order) {
      const items = filteredSymbols
        .filter((s) => (category === UNCATEGORIZED ? !s.category : s.category === category))
        .sort((a, b) => a.term.localeCompare(b.term));
      if (items.length > 0) groups.push({ category, items });
    }
    return groups;
  }, [filteredSymbols, activeCategory, categoriesInUse]);

  return (
    <div className="space-y-5">
      <GlassCard>
        <Eyebrow>DC Library</Eyebrow>
        <h1 className="mt-3 text-2xl font-semibold text-midnight-950">Dream Directory and articles</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
          A growing, categorized reference of common dream elements to help you understand the language of your dreams.
        </p>
      </GlassCard>

      <div className="flex gap-2">
        <button
          onClick={() => setTab('symbols')}
          className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors duration-200 ${tab === 'symbols' ? 'bg-midnight-950/8 text-midnight-950' : 'text-gray-500 hover:text-midnight-950'}`}
        >
          Dream Directory
        </button>
        <button
          onClick={() => setTab('articles')}
          className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors duration-200 ${tab === 'articles' ? 'bg-midnight-950/8 text-midnight-950' : 'text-gray-500 hover:text-midnight-950'}`}
        >
          Articles
        </button>
      </div>

      {loading && <p className="text-sm text-gray-500">Loading...</p>}

      {!loading && tab === 'symbols' && (
        <div className="space-y-5">
          <GlassCard className="border-gold-600/20 bg-gold-100/30">
            <p className="text-sm leading-6 text-gray-700">
              These are common possible <strong>translations</strong> — not fixed meanings. A symbol&apos;s significance depends
              on the whole dream it appears in, so hold each entry loosely and read it alongside everything else you saw.
              Translation (what a symbol might mean) is a different skill from interpretation (what God is saying to you) —
              this directory only offers the former.
            </p>
          </GlassCard>

          <GlassCard>
            <div className="mb-4 flex items-center gap-2 rounded-md border border-midnight-950/10 bg-gray-50 px-3 py-2.5">
              <Search className="h-4 w-4 text-gray-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search a symbol (e.g. water, fire, flying)"
                className="w-full bg-transparent text-sm text-midnight-950 outline-none placeholder:text-gray-400"
              />
            </div>

            <div className="mb-5 flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory('All')}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors duration-200 ${
                  activeCategory === 'All' ? 'bg-midnight-950 text-white' : 'border border-midnight-950/15 text-gray-600 hover:border-midnight-950/30'
                }`}
              >
                All
              </button>
              {categoriesInUse.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors duration-200 ${
                    activeCategory === category ? 'bg-midnight-950 text-white' : 'border border-midnight-950/15 text-gray-600 hover:border-midnight-950/30'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {groupedSymbols.length === 0 && <p className="text-sm text-gray-500">No symbols match yet.</p>}

            <div className="space-y-7">
              {groupedSymbols.map((group) => (
                <div key={group.category}>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-gray-500">
                    {group.category} <span className="font-normal normal-case tracking-normal text-gray-400">· {group.items.length}</span>
                  </h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    {group.items.map((symbol) => (
                      <div key={symbol.id} className="rounded-md border border-midnight-950/8 bg-gray-50 p-4">
                        <div className="mb-1.5 flex items-center gap-2">
                          <IconBadge>
                            <Sparkles className="h-3.5 w-3.5" />
                          </IconBadge>
                          <p className="text-sm font-semibold text-midnight-950">{symbol.term}</p>
                        </div>
                        <p className="text-sm leading-6 text-gray-600">{symbol.meaning}</p>
                        {symbol.scripture_reference && <p className="mt-1.5 text-xs text-gold-700">{symbol.scripture_reference}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {!loading && tab === 'articles' && (
        <div className="grid gap-4 md:grid-cols-2">
          {articles.length === 0 && (
            <GlassCard>
              <p className="text-sm text-gray-500">No articles published yet.</p>
            </GlassCard>
          )}
          {articles.map((article) => (
            <Link key={article.id} href={`/library/${article.slug}`} className="group flex h-full flex-col gap-3 rounded-xl border border-midnight-950/10 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-midnight-950/20">
              <div className="flex items-center gap-2 text-gold-700">
                <BookOpen className="h-4 w-4" />
                {article.category && <span className="text-xs font-semibold uppercase tracking-[0.1em]">{article.category}</span>}
              </div>
              <h3 className="text-[15px] font-semibold text-midnight-950">{article.title}</h3>
              {article.excerpt && <p className="line-clamp-3 text-sm leading-6 text-gray-600">{article.excerpt}</p>}
              <span className="mt-auto flex items-center gap-1.5 text-sm font-semibold text-gray-700 group-hover:text-midnight-950">
                Read
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
