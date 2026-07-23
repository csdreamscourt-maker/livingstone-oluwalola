'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Input, Textarea, Button } from '@/components/ui';
import type { DreamArticle } from '@/types/database';

const emptyForm = { title: '', slug: '', excerpt: '', body: '', category: '' };

export default function AdminDreamArticlesPage() {
  const [articles, setArticles] = useState<DreamArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const res = await fetch('/api/admin/dream-articles');
    if (res.ok) {
      const data = await res.json();
      setArticles(data.articles);
    }
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, []);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title.trim() || !form.slug.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/dream-articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to create article');
      setForm(emptyForm);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create article');
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (article: DreamArticle) => {
    const res = await fetch(`/api/admin/dream-articles/${article.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_published: !article.is_published }),
    });
    if (res.ok) await load();
  };

  const remove = async (id: string) => {
    const res = await fetch(`/api/admin/dream-articles/${id}`, { method: 'DELETE' });
    if (res.ok) await load();
  };

  return (
    <AdminLayout title="Dream articles">
      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <h3 className="mb-4 text-sm font-semibold text-white">New article</h3>
          {error && <p className="mb-3 text-sm text-red-300">{error}</p>}
          <form onSubmit={handleCreate} className="space-y-3">
            <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="!bg-white/[0.03] !border-white/10 !text-white" />
            <Input placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="!bg-white/[0.03] !border-white/10 !text-white" />
            <Textarea placeholder="Excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="!bg-white/[0.03] !border-white/10 !text-white" />
            <Textarea placeholder="Body" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="!bg-white/[0.03] !border-white/10 !text-white min-h-[160px]" />
            <Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="!bg-white/[0.03] !border-white/10 !text-white" />
            <Button type="submit" variant="gold" disabled={saving} className="w-full">
              {saving ? 'Saving...' : 'Publish article'}
            </Button>
          </form>
        </div>

        <div className="space-y-3">
          {loading && <p className="text-sm text-white/50">Loading...</p>}
          {!loading && articles.length === 0 && <p className="text-sm text-white/50">No articles yet.</p>}
          {articles.map((article) => (
            <div key={article.id} className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{article.title}</p>
                  <p className="text-xs text-white/40">/{article.slug}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button onClick={() => togglePublished(article)} className={`rounded-full px-3 py-1 text-xs font-semibold ${article.is_published ? 'bg-emerald-500/15 text-emerald-300' : 'border border-white/15 text-white/50'}`}>
                    {article.is_published ? 'Published' : 'Draft'}
                  </button>
                  <button onClick={() => remove(article.id)} className="rounded-full p-1.5 text-white/30 hover:text-red-400">×</button>
                </div>
              </div>
              {article.excerpt && <p className="mt-2 text-sm leading-6 text-white/60">{article.excerpt}</p>}
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
