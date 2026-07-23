'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Input, Textarea, Button } from '@/components/ui';
import type { DreamSymbol } from '@/types/database';

const emptyForm = { term: '', meaning: '', category: '', scripture_reference: '' };

export default function AdminDreamSymbolsPage() {
  const [symbols, setSymbols] = useState<DreamSymbol[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const res = await fetch('/api/admin/dream-symbols');
    if (res.ok) {
      const data = await res.json();
      setSymbols(data.symbols);
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
    if (!form.term.trim() || !form.meaning.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/dream-symbols', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to create symbol');
      setForm(emptyForm);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create symbol');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    const res = await fetch(`/api/admin/dream-symbols/${id}`, { method: 'DELETE' });
    if (res.ok) await load();
  };

  return (
    <AdminLayout title="Dream symbols">
      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-midnight-950/10 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold text-midnight-950">New symbol</h3>
          {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
          <form onSubmit={handleCreate} className="space-y-3">
            <Input placeholder="Term (e.g. Water)" value={form.term} onChange={(e) => setForm({ ...form, term: e.target.value })} />
            <Textarea placeholder="Meaning" value={form.meaning} onChange={(e) => setForm({ ...form, meaning: e.target.value })} />
            <Input placeholder="Category (e.g. Nature)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <Input placeholder="Scripture reference (optional)" value={form.scripture_reference} onChange={(e) => setForm({ ...form, scripture_reference: e.target.value })} />
            <Button type="submit" variant="gold" disabled={saving} className="w-full">
              {saving ? 'Saving...' : 'Add symbol'}
            </Button>
          </form>
        </div>

        <div className="space-y-2">
          {loading && <p className="text-sm text-gray-500">Loading...</p>}
          {!loading && symbols.length === 0 && <p className="text-sm text-gray-500">No symbols yet.</p>}
          {symbols.map((symbol) => (
            <div key={symbol.id} className="rounded-xl border border-midnight-950/10 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-midnight-950">{symbol.term}</p>
                  {symbol.category && <p className="text-xs text-gold-700">{symbol.category}</p>}
                </div>
                <button onClick={() => remove(symbol.id)} className="shrink-0 rounded-full p-1.5 text-gray-400 hover:text-red-600">×</button>
              </div>
              <p className="mt-2 text-sm leading-6 text-gray-600">{symbol.meaning}</p>
              {symbol.scripture_reference && <p className="mt-1 text-xs text-gray-500">{symbol.scripture_reference}</p>}
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
