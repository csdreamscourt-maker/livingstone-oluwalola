'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button, Select } from '@/components/ui';

type Summary = {
  total: number;
  successes: number;
  failures: number;
  fallback_uses: number;
  avg_latency_ms: number;
  by_task: { task_key: string; total: number; successes: number }[];
  by_provider: { provider: string; total: number; successes: number }[];
};

type LogRow = {
  id: string;
  task_key: string;
  provider: string;
  model: string;
  success: boolean;
  used_fallback: boolean;
  latency_ms: number;
  error_message?: string;
  created_at: string;
};

const RANGE_OPTIONS = [
  { value: '24', label: 'Last 24 hours' },
  { value: '168', label: 'Last 7 days' },
  { value: '720', label: 'Last 30 days' },
];

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-midnight-950/10 bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-midnight-950">{value}</p>
    </div>
  );
}

export default function AdminAiUsagePage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [recent, setRecent] = useState<LogRow[]>([]);
  const [hours, setHours] = useState('24');
  const [loading, setLoading] = useState(true);
  const [purging, setPurging] = useState(false);

  const load = async (range: string) => {
    setLoading(true);
    const res = await fetch(`/api/admin/ai-usage?hours=${range}`);
    if (res.ok) {
      const data = await res.json();
      setSummary(data.summary);
      setRecent(data.recent);
    }
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await load(hours);
    })();
  }, [hours]);

  const purgeOld = async () => {
    if (!window.confirm('Delete AI usage logs older than 90 days?')) return;
    setPurging(true);
    try {
      const res = await fetch('/api/admin/ai-usage?olderThanDays=90', { method: 'DELETE' });
      if (res.ok) {
        const data = await res.json();
        window.alert(`Deleted ${data.deleted} old log entries.`);
        await load(hours);
      }
    } finally {
      setPurging(false);
    }
  };

  return (
    <AdminLayout title="AI Usage">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="w-48">
            <Select options={RANGE_OPTIONS} value={hours} onChange={(e) => setHours(e.target.value)} />
          </div>
          <Button variant="secondary" onClick={purgeOld} disabled={purging}>
            {purging ? 'Purging...' : 'Purge logs older than 90 days'}
          </Button>
        </div>

        {loading && <p className="text-sm text-gray-500">Loading...</p>}

        {summary && !loading && (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
              <StatTile label="Requests" value={summary.total} />
              <StatTile label="Succeeded" value={summary.successes} />
              <StatTile label="Failed" value={summary.failures} />
              <StatTile label="Used fallback" value={summary.fallback_uses} />
              <StatTile label="Avg latency" value={`${summary.avg_latency_ms}ms`} />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-xl border border-midnight-950/10 bg-white p-5">
                <h3 className="mb-3 text-sm font-semibold text-midnight-950">By task</h3>
                <div className="space-y-2">
                  {summary.by_task.length === 0 && <p className="text-sm text-gray-500">No activity in this range.</p>}
                  {summary.by_task.map((row) => (
                    <div key={row.task_key} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{row.task_key}</span>
                      <span className="font-mono text-midnight-950">
                        {row.successes}/{row.total}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-midnight-950/10 bg-white p-5">
                <h3 className="mb-3 text-sm font-semibold text-midnight-950">By provider</h3>
                <div className="space-y-2">
                  {summary.by_provider.length === 0 && <p className="text-sm text-gray-500">No activity in this range.</p>}
                  {summary.by_provider.map((row) => (
                    <div key={row.provider} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{row.provider}</span>
                      <span className="font-mono text-midnight-950">
                        {row.successes}/{row.total}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-midnight-950">Recent requests</h3>
              <div className="space-y-2">
                {recent.length === 0 && <p className="text-sm text-gray-500">No requests logged yet.</p>}
                {recent.map((row) => (
                  <div key={row.id} className="rounded-xl border border-midnight-950/10 bg-white p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-semibold text-midnight-950">
                        {row.task_key} · {row.provider}/{row.model}
                      </span>
                      <span className="flex items-center gap-2 text-gray-500">
                        {row.used_fallback && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-700">fallback</span>}
                        <span className={row.success ? 'text-emerald-700' : 'text-red-600'}>{row.success ? 'ok' : 'failed'}</span>
                        <span>{row.latency_ms}ms</span>
                        <span>{new Date(row.created_at).toLocaleString()}</span>
                      </span>
                    </div>
                    {row.error_message && <p className="mt-1 text-xs text-red-600">{row.error_message}</p>}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
