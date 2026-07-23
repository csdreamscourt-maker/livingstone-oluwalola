'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Input, Textarea, Button } from '@/components/ui';
import type { Company } from '@/types/database';

const emptyForm = { name: '', slug: '', category: '', description: '', tagline: '', summary: '', highlights: '', logo_url: '' };

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const res = await fetch('/api/admin/companies');
    if (res.ok) {
      const data = await res.json();
      setCompanies(data.companies);
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
    if (!form.name.trim() || !form.slug.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          highlights: form.highlights.split('\n').map((s) => s.trim()).filter(Boolean),
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to create company');
      setForm(emptyForm);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create company');
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (company: Company) => {
    const res = await fetch(`/api/admin/companies/${company.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_published: !company.is_published }),
    });
    if (res.ok) await load();
  };

  const remove = async (id: string) => {
    const res = await fetch(`/api/admin/companies/${id}`, { method: 'DELETE' });
    if (res.ok) await load();
  };

  return (
    <AdminLayout title="Companies">
      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-midnight-950/10 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold text-midnight-950">New company</h3>
          {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
          <form onSubmit={handleCreate} className="space-y-3">
            <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="Slug (e.g. dreamscourt)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            <Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <Input placeholder="Tagline" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
            <Textarea placeholder="Short description (shown on the listing card)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Textarea placeholder="Summary (shown on the detail page)" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
            <Textarea placeholder={'Highlights, one per line'} value={form.highlights} onChange={(e) => setForm({ ...form, highlights: e.target.value })} className="min-h-[100px]" />
            <Input placeholder="Logo URL" value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} />
            <Button type="submit" variant="gold" disabled={saving} className="w-full">
              {saving ? 'Saving...' : 'Create company'}
            </Button>
          </form>
        </div>

        <div className="space-y-3">
          {loading && <p className="text-sm text-gray-500">Loading...</p>}
          {!loading && companies.length === 0 && <p className="text-sm text-gray-500">No companies yet.</p>}
          {companies.map((company) => (
            <div key={company.id} className="rounded-xl border border-midnight-950/10 bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-midnight-950">{company.name}</p>
                  <p className="text-xs text-gray-500">/{company.slug} · {company.category || 'uncategorized'}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button onClick={() => togglePublished(company)} className={`rounded-full px-3 py-1 text-xs font-semibold ${company.is_published ? 'bg-emerald-100 text-emerald-700' : 'border border-midnight-950/15 text-gray-500'}`}>
                    {company.is_published ? 'Published' : 'Draft'}
                  </button>
                  <button onClick={() => remove(company.id)} className="rounded-full p-1.5 text-gray-400 hover:text-red-600">×</button>
                </div>
              </div>
              {company.description && <p className="mt-2 text-sm leading-6 text-gray-600">{company.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
