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
      <div className="overflow-hidden rounded-2xl border border-midnight-950/10 bg-white">
        {loading && <p className="p-5 text-sm text-gray-500">Loading...</p>}
        {!loading && subscribers.length === 0 && <p className="p-5 text-sm text-gray-500">No subscribers yet.</p>}
        {subscribers.map((sub) => (
          <div key={sub.id} className="flex items-center justify-between border-b border-midnight-950/8 px-5 py-3.5 last:border-b-0">
            <span className="text-sm text-midnight-950">{sub.email}</span>
            <div className="flex items-center gap-3">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${sub.is_subscribed ? 'bg-emerald-100 text-emerald-700' : 'bg-midnight-950/8 text-gray-500'}`}>
                {sub.is_subscribed ? 'Subscribed' : 'Unsubscribed'}
              </span>
              <span className="text-xs text-gray-500">{new Date(sub.subscribed_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
