'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { BarChart3, BookOpen, GraduationCap, Inbox, Mail, ShoppingBag, Users } from 'lucide-react';

type OverviewStats = {
  user_count: string;
  dream_count: string;
  journal_count: string;
  message_count: string;
  newsletter_count: string;
  course_count: string;
  product_count: string;
};

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<OverviewStats | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/admin/overview');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
    })();
  }, []);

  const tiles = [
    { label: 'Registered users', value: stats?.user_count, icon: Users },
    { label: 'Dreams recorded', value: stats?.dream_count, icon: BookOpen },
    { label: 'Journal entries', value: stats?.journal_count, icon: BarChart3 },
    { label: 'Contact messages', value: stats?.message_count, icon: Inbox },
    { label: 'Newsletter subscribers', value: stats?.newsletter_count, icon: Mail },
    { label: 'Courses', value: stats?.course_count, icon: GraduationCap },
    { label: 'Store products', value: stats?.product_count, icon: ShoppingBag },
  ];

  return (
    <AdminLayout title="Overview">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <div key={tile.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-md border border-white/10 bg-white/[0.04] p-2.5 text-gold-300">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-mono text-xl font-semibold tabular-nums text-white">{tile.value ?? '—'}</p>
                  <p className="text-xs text-white/40">{tile.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
