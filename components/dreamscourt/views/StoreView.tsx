'use client';

import { useEffect, useState } from 'react';
import { Eyebrow, GlassCard } from '../ui';
import { ArrowUpRight, ShoppingBag } from 'lucide-react';
import type { StoreProduct } from '@/types/database';

export function StoreView() {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/store-products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-5">
      <GlassCard>
        <Eyebrow>DC Store</Eyebrow>
        <h1 className="mt-3 text-2xl font-semibold text-midnight-950">Books &amp; materials</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
          Checkout is handled securely via Selar — each product opens in a new tab to complete your purchase.
        </p>
      </GlassCard>

      {loading && <p className="text-sm text-gray-500">Loading products...</p>}
      {!loading && products.length === 0 && (
        <GlassCard>
          <p className="text-sm text-gray-500">No products published yet — check back soon.</p>
        </GlassCard>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <div key={product.id} className="flex h-full flex-col gap-3 rounded-xl border border-midnight-950/10 bg-white p-6">
            <div className="flex items-center gap-2 text-gold-700">
              <ShoppingBag className="h-4 w-4" />
              {product.price_display && <span className="text-xs font-semibold uppercase tracking-[0.1em]">{product.price_display}</span>}
            </div>
            <h3 className="text-[15px] font-semibold text-midnight-950">{product.title}</h3>
            {product.description && <p className="line-clamp-3 text-sm leading-6 text-gray-600">{product.description}</p>}
            {product.selar_url ? (
              <a
                href={product.selar_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700 transition-colors duration-200 hover:text-midnight-950"
              >
                Get this
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            ) : (
              <span className="mt-auto text-sm text-gray-400">Checkout link coming soon</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
