'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eyebrow, GlassCard } from '../ui';
import { ArrowLeft } from 'lucide-react';
import type { DreamArticle } from '@/types/database';

export function LibraryArticleView({ slug }: { slug: string }) {
  const [article, setArticle] = useState<DreamArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/dream-articles/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setArticle(data.article);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    })();
  }, [slug]);

  if (loading) return <p className="text-sm text-white/50">Loading...</p>;

  if (notFound || !article) {
    return (
      <GlassCard>
        <p className="text-sm text-white/60">Article not found.</p>
        <Link href="/library" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-300">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Library
        </Link>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-5">
      <Link href="/library" className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/50 hover:text-white">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Library
      </Link>

      <GlassCard>
        {article.category && <Eyebrow>{article.category}</Eyebrow>}
        <h1 className="mt-3 text-2xl font-semibold text-white">{article.title}</h1>
        <div className="mt-5 space-y-4">
          {(article.body || '').split('\n').filter(Boolean).map((paragraph, index) => (
            <p key={index} className="text-sm leading-7 text-white/70">{paragraph}</p>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
