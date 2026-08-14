'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  BookOpen,
  Bot,
  GraduationCap,
  Inbox,
  Library,
  Mail,
  Radio,
  ShoppingBag,
  Sparkles,
  Users,
} from 'lucide-react';

type OverviewStats = {
  user_count: string;
  dream_count: string;
  journal_count: string;
  message_count: string;
  newsletter_count: string;
  course_count: string;
  product_count: string;
  dream_lab_session_count: string;
  knowledge_source_count: string;
  knowledge_published_count: string;
  knowledge_pending_review_count: string;
  knowledge_failed_count: string;
  ai_provider_count: string;
  ai_requests_today: string;
  ai_errors_today: string;
  social_connection_count: string;
  social_sync_failed_count: string;
};

function Tile({ label, value, icon: Icon, href, warn }: { label: string; value?: string; icon: typeof Users; href?: string; warn?: boolean }) {
  const content = (
    <div className={`rounded-2xl border p-5 transition-colors duration-200 ${warn ? 'border-red-200 bg-red-50' : 'border-midnight-950/10 bg-white'} ${href ? 'hover:border-midnight-950/25' : ''}`}>
      <div className="flex items-center gap-3">
        <div className={`rounded-md border p-2.5 ${warn ? 'border-red-200 text-red-600' : 'border-midnight-950/10 text-gold-700'}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="font-mono text-xl font-semibold tabular-nums text-midnight-950">{value ?? '—'}</p>
          <p className="text-xs text-gray-500">{label}</p>
        </div>
      </div>
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

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

  return (
    <AdminLayout title="Overview">
      <div className="space-y-8">
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-gray-500">Dreamscourt</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Tile label="Registered users" value={stats?.user_count} icon={Users} />
            <Tile label="Dreams recorded" value={stats?.dream_count} icon={BookOpen} />
            <Tile label="Dream Lab sessions" value={stats?.dream_lab_session_count} icon={Sparkles} />
            <Tile label="Journal entries" value={stats?.journal_count} icon={BarChart3} />
            <Tile label="Contact messages" value={stats?.message_count} icon={Inbox} />
            <Tile label="Newsletter subscribers" value={stats?.newsletter_count} icon={Mail} />
            <Tile label="Courses" value={stats?.course_count} icon={GraduationCap} />
            <Tile label="Store products" value={stats?.product_count} icon={ShoppingBag} />
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-gray-500">Founder Knowledge</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Tile label="Knowledge sources" value={stats?.knowledge_source_count} icon={Library} href="/admin/knowledge" />
            <Tile label="Published" value={stats?.knowledge_published_count} icon={Library} href="/admin/knowledge" />
            <Tile label="Pending review" value={stats?.knowledge_pending_review_count} icon={Library} href="/admin/knowledge" />
            <Tile
              label="Failed ingestion"
              value={stats?.knowledge_failed_count}
              icon={AlertTriangle}
              href="/admin/knowledge"
              warn={Boolean(stats && Number(stats.knowledge_failed_count) > 0)}
            />
            <Tile label="Social connections" value={stats?.social_connection_count} icon={Radio} href="/admin/social" />
            <Tile
              label="Failed syncs"
              value={stats?.social_sync_failed_count}
              icon={AlertTriangle}
              href="/admin/social"
              warn={Boolean(stats && Number(stats.social_sync_failed_count) > 0)}
            />
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-gray-500">Artificial Intelligence</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Tile label="Active providers" value={stats?.ai_provider_count} icon={Bot} href="/admin/ai" />
            <Tile label="Requests (24h)" value={stats?.ai_requests_today} icon={Activity} href="/admin/ai-usage" />
            <Tile
              label="Errors (24h)"
              value={stats?.ai_errors_today}
              icon={AlertTriangle}
              href="/admin/ai-usage"
              warn={Boolean(stats && Number(stats.ai_errors_today) > 0)}
            />
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
