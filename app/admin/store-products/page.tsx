'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Input, Textarea, Button } from '@/components/ui';
import type { StoreProduct } from '@/types/database';

const emptyForm = { title: '', description: '', price_display: '', selar_url: '', cover_image_url: '' };

export default function AdminStoreProductsPage() {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const res = await fetch('/api/admin/store-products');
    if (res.ok) {
      const data = await res.json();
      setProducts(data.products);
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
    if (!form.title.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/store-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to create product');
      setForm(emptyForm);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (product: StoreProduct) => {
    const res = await fetch(`/api/admin/store-products/${product.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_published: !product.is_published }),
    });
    if (res.ok) await load();
  };

  const remove = async (id: string) => {
    const res = await fetch(`/api/admin/store-products/${id}`, { method: 'DELETE' });
    if (res.ok) await load();
  };

  return (
    <AdminLayout title="Store products">
      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-midnight-950/10 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold text-midnight-950">New product</h3>
          {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
          <form onSubmit={handleCreate} className="space-y-3">
            <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Input placeholder="Price display (e.g. ₦8,000)" value={form.price_display} onChange={(e) => setForm({ ...form, price_display: e.target.value })} />
            <Input placeholder="Selar checkout URL" value={form.selar_url} onChange={(e) => setForm({ ...form, selar_url: e.target.value })} />
            <Input placeholder="Cover image URL" value={form.cover_image_url} onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })} />
            <Button type="submit" variant="gold" disabled={saving} className="w-full">
              {saving ? 'Saving...' : 'Create product'}
            </Button>
          </form>
        </div>

        <div className="space-y-3">
          {loading && <p className="text-sm text-gray-500">Loading...</p>}
          {!loading && products.length === 0 && <p className="text-sm text-gray-500">No products yet.</p>}
          {products.map((product) => (
            <div key={product.id} className="rounded-xl border border-midnight-950/10 bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-midnight-950">{product.title}</p>
                  <p className="text-xs text-gray-500">{product.price_display || 'no price set'}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button onClick={() => togglePublished(product)} className={`rounded-full px-3 py-1 text-xs font-semibold ${product.is_published ? 'bg-emerald-100 text-emerald-700' : 'border border-midnight-950/15 text-gray-500'}`}>
                    {product.is_published ? 'Published' : 'Draft'}
                  </button>
                  <button onClick={() => remove(product.id)} className="rounded-full p-1.5 text-gray-400 hover:text-red-600">×</button>
                </div>
              </div>
              {product.description && <p className="mt-2 text-sm leading-6 text-gray-600">{product.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
