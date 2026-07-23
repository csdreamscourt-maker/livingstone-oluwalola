'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';

type Subscriber = {
  id: string;
  email: string;
  is_subscribed: boolean;
  subscribed_at: string;
};

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/admin/newsletter');
      if (res.ok) {
        const data = await res.json();
        setSubscribers(data.subscribers);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <AdminLayout title="Newsletter subscribers">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
        {loading && <p className="p-5 text-sm text-white/50">Loading...</p>}
        {!loading && subscribers.length === 0 && <p className="p-5 text-sm text-white/50">No subscribers yet.</p>}
        {subscribers.map((sub) => (
          <div key={sub.id} className="flex items-center justify-between border-b border-white/8 px-5 py-3.5 last:border-b-0">
            <span className="text-sm text-white">{sub.email}</span>
            <div className="flex items-center gap-3">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${sub.is_subscribed ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/10 text-white/40'}`}>
                {sub.is_subscribed ? 'Subscribed' : 'Unsubscribed'}
              </span>
              <span className="text-xs text-white/40">{new Date(sub.subscribed_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
