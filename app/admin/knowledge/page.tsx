'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Input, Textarea, Select, Button } from '@/components/ui';

type Source = {
  id: string;
  title: string;
  author?: string;
  source_type: string;
  tier: number;
  processing_status: 'pending' | 'processing' | 'indexed' | 'published' | 'failed' | 'needs_review';
  processing_error?: string;
  chunk_count: number;
  updated_at: string;
};

const SOURCE_TYPE_OPTIONS = [
  { value: 'book', label: 'Book' },
  { value: 'journal', label: 'Journal' },
  { value: 'article', label: 'Article' },
  { value: 'sermon', label: 'Sermon' },
  { value: 'video_transcript', label: 'Video transcript' },
  { value: 'audio_transcript', label: 'Audio transcript' },
  { value: 'social_post', label: 'Social post' },
  { value: 'document', label: 'Document' },
];

const STATUS_STYLES: Record<string, string> = {
  pending: 'border border-midnight-950/15 text-gray-500',
  processing: 'bg-blue-100 text-blue-700',
  indexed: 'bg-amber-100 text-amber-700',
  published: 'bg-emerald-100 text-emerald-700',
  failed: 'bg-red-100 text-red-700',
  needs_review: 'bg-amber-100 text-amber-700',
};

const emptyForm = { title: '', author: '', source_type: 'article', tier: '3', url: '', description: '', full_text: '' };

export default function AdminKnowledgePage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    const res = await fetch('/api/admin/knowledge/sources');
    if (res.ok) setSources((await res.json()).sources);
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, []);

  const createSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/knowledge/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, tier: Number(form.tier) || 3 }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to add source');
      setForm(emptyForm);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add source');
    } finally {
      setSaving(false);
    }
  };

  const ingest = async (id: string) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/knowledge/sources/${id}/ingest`, { method: 'POST' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        window.alert(data.error || 'Ingestion failed');
      }
      await load();
    } finally {
      setBusyId(null);
    }
  };

  const setStatus = async (id: string, processing_status: string) => {
    const res = await fetch(`/api/admin/knowledge/sources/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ processing_status }),
    });
    if (res.ok) await load();
  };

  const remove = async (id: string) => {
    const res = await fetch(`/api/admin/knowledge/sources/${id}`, { method: 'DELETE' });
    if (res.ok) await load();
  };

  return (
    <AdminLayout title="Founder Knowledge Library">
      <div className="space-y-6">
        <p className="text-sm text-gray-600 max-w-2xl">
          Every piece of founder content — books, journals, articles, transcripts — lives here as a searchable, cited source
          that grounds Dream Lab and dream interpretation. Add a source, paste or upload its text, run ingestion to index it,
          then publish it once you&apos;ve reviewed the result. Only published sources are used in interpretations.
        </p>

        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-2xl border border-midnight-950/10 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-midnight-950">Add a source</h3>
            {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
            <form onSubmit={createSource} className="space-y-3">
              <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Input placeholder="Author (defaults to Livingstone Oluwalola if blank)" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
              <Select options={SOURCE_TYPE_OPTIONS} value={form.source_type} onChange={(e) => setForm({ ...form, source_type: e.target.value })} />
              <Input placeholder="Tier (1 = founder book/journal, 6 = general)" value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value })} />
              <Input placeholder="Source URL (optional)" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
              <Textarea placeholder="Short description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <Textarea
                placeholder="Full text or transcript — paste the complete content here"
                value={form.full_text}
                onChange={(e) => setForm({ ...form, full_text: e.target.value })}
                className="min-h-[200px]"
              />
              <Button type="submit" variant="gold" disabled={saving} className="w-full">
                {saving ? 'Saving...' : 'Add source'}
              </Button>
            </form>
          </div>

          <div className="space-y-3">
            {loading && <p className="text-sm text-gray-500">Loading...</p>}
            {!loading && sources.length === 0 && <p className="text-sm text-gray-500">No knowledge sources yet.</p>}
            {sources.map((source) => (
              <div key={source.id} className="rounded-xl border border-midnight-950/10 bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-midnight-950">{source.title}</p>
                    <p className="text-xs text-gray-500">
                      {source.author || 'Livingstone Oluwalola'} · {source.source_type} · tier {source.tier} · {source.chunk_count} chunks
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[source.processing_status] ?? ''}`}>
                    {source.processing_status}
                  </span>
                </div>
                {source.processing_error && <p className="mt-2 text-xs text-red-600">{source.processing_error}</p>}
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={() => ingest(source.id)} disabled={busyId === source.id}>
                    {busyId === source.id ? 'Ingesting...' : source.chunk_count > 0 ? 'Re-ingest' : 'Ingest'}
                  </Button>
                  {source.processing_status === 'indexed' && (
                    <Button variant="gold" onClick={() => setStatus(source.id, 'published')}>
                      Publish
                    </Button>
                  )}
                  {source.processing_status === 'published' && (
                    <Button variant="secondary" onClick={() => setStatus(source.id, 'needs_review')}>
                      Unpublish
                    </Button>
                  )}
                  <button onClick={() => remove(source.id)} className="rounded-full p-1.5 text-gray-400 hover:text-red-600">×</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
