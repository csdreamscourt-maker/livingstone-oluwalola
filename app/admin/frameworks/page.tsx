'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Input, Textarea, Button } from '@/components/ui';
import type { Framework } from '@/types/database';

const emptyForm = { title: '', slug: '', category: '', description: '', overview: '', applications: '' };

export default function AdminFrameworksPage() {
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const res = await fetch('/api/admin/frameworks');
    if (res.ok) {
      const data = await res.json();
      setFrameworks(data.frameworks);
    }
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, []);

  const startEdit = (framework: Framework) => {
    setEditingId(framework.id);
    setForm({
      title: framework.title,
      slug: framework.slug,
      category: framework.category ?? '',
      description: framework.description ?? '',
      overview: framework.overview ?? '',
      applications: (framework.applications ?? []).join('\n'),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title.trim() || !form.slug.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(editingId ? `/api/admin/frameworks/${editingId}` : '/api/admin/frameworks', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          applications: form.applications.split('\n').map((s) => s.trim()).filter(Boolean),
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to save framework');
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save framework');
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (framework: Framework) => {
    const res = await fetch(`/api/admin/frameworks/${framework.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_published: !framework.is_published }),
    });
    if (res.ok) await load();
  };

  const remove = async (id: string) => {
    const res = await fetch(`/api/admin/frameworks/${id}`, { method: 'DELETE' });
    if (res.ok) {
      if (editingId === id) cancelEdit();
      await load();
    }
  };

  return (
    <AdminLayout title="Frameworks">
      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-midnight-950/10 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold text-midnight-950">{editingId ? 'Edit framework' : 'New framework'}</h3>
          {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Input placeholder="Slug (e.g. mind-engineering)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            <Input placeholder="Category (e.g. Growth, Strategy, Faith, Leadership)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <Textarea placeholder="Short description (shown on the listing card)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Textarea placeholder="Overview (shown on the detail page)" value={form.overview} onChange={(e) => setForm({ ...form, overview: e.target.value })} />
            <Textarea placeholder={'Applications, one per line'} value={form.applications} onChange={(e) => setForm({ ...form, applications: e.target.value })} className="min-h-[100px]" />
            <div className="flex gap-2">
              <Button type="submit" variant="gold" disabled={saving} className="flex-1">
                {saving ? 'Saving...' : editingId ? 'Save changes' : 'Create framework'}
              </Button>
              {editingId && (
                <Button type="button" variant="secondary" onClick={cancelEdit}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>

        <div className="space-y-3">
          {loading && <p className="text-sm text-gray-500">Loading...</p>}
          {!loading && frameworks.length === 0 && <p className="text-sm text-gray-500">No frameworks yet.</p>}
          {frameworks.map((framework) => (
            <div key={framework.id} className="rounded-xl border border-midnight-950/10 bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-midnight-950">{framework.title}</p>
                  <p className="text-xs text-gray-500">/{framework.slug} · {framework.category || 'uncategorized'}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button onClick={() => togglePublished(framework)} className={`rounded-full px-3 py-1 text-xs font-semibold ${framework.is_published ? 'bg-emerald-100 text-emerald-700' : 'border border-midnight-950/15 text-gray-500'}`}>
                    {framework.is_published ? 'Published' : 'Draft'}
                  </button>
                  <button onClick={() => startEdit(framework)} className="rounded-full border border-midnight-950/15 px-3 py-1 text-xs font-semibold text-gray-600 hover:border-midnight-950/30 hover:text-midnight-950">
                    Edit
                  </button>
                  <button onClick={() => remove(framework.id)} className="rounded-full p-1.5 text-gray-400 hover:text-red-600">×</button>
                </div>
              </div>
              {framework.description && <p className="mt-2 text-sm leading-6 text-gray-600">{framework.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
