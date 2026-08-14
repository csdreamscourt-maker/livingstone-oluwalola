'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Input, Textarea, Select, Button } from '@/components/ui';
import { ArrowRight } from 'lucide-react';

type Connection = {
  id: string;
  platform: 'substack' | 'youtube';
  label: string;
  feed_url?: string;
  auto_sync: boolean;
  last_synced_at?: string;
  last_sync_status: 'idle' | 'syncing' | 'ok' | 'failed';
  last_sync_message?: string;
  new_content_count: number;
  failed_content_count: number;
};

const SYNC_STATUS_STYLES: Record<string, string> = {
  idle: 'border border-midnight-950/15 text-gray-500',
  syncing: 'bg-blue-100 text-blue-700',
  ok: 'bg-emerald-100 text-emerald-700',
  failed: 'bg-red-100 text-red-700',
};

const CONNECTION_PLATFORM_OPTIONS = [
  { value: 'substack', label: 'Substack (RSS feed)' },
  { value: 'youtube', label: 'YouTube (channel video feed)' },
];

const MANUAL_PLATFORM_OPTIONS = [
  { value: 'tiktok', label: 'TikTok' },
  { value: 'instagram', label: 'Instagram' },
];

const emptyConnectionForm = { label: '', platform: 'substack', feed_url: '', auto_sync: false };
const emptyManualForm = { platform: 'tiktok', title: '', url: '', content: '' };

export default function AdminSocialPage() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectionForm, setConnectionForm] = useState(emptyConnectionForm);
  const [creatingConnection, setCreatingConnection] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [manualForm, setManualForm] = useState(emptyManualForm);
  const [savingManual, setSavingManual] = useState(false);
  const [manualError, setManualError] = useState<string | null>(null);
  const [manualSaved, setManualSaved] = useState(false);

  const load = async () => {
    const res = await fetch('/api/admin/social/connections');
    if (res.ok) setConnections((await res.json()).connections);
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, []);

  const createConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectionForm.label.trim() || !connectionForm.feed_url.trim()) return;
    setCreatingConnection(true);
    setConnectionError(null);
    try {
      const res = await fetch('/api/admin/social/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(connectionForm),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to add connection');
      setConnectionForm(emptyConnectionForm);
      await load();
    } catch (err) {
      setConnectionError(err instanceof Error ? err.message : 'Failed to add connection');
    } finally {
      setCreatingConnection(false);
    }
  };

  const syncNow = async (id: string) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/social/connections/${id}/sync`, { method: 'POST' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        window.alert(data.error || 'Sync failed');
      }
      await load();
    } finally {
      setBusyId(null);
    }
  };

  const toggleAutoSync = async (connection: Connection) => {
    const res = await fetch(`/api/admin/social/connections/${connection.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ auto_sync: !connection.auto_sync }),
    });
    if (res.ok) await load();
  };

  const removeConnection = async (id: string) => {
    const res = await fetch(`/api/admin/social/connections/${id}`, { method: 'DELETE' });
    if (res.ok) await load();
  };

  const addManualContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.title.trim() || !manualForm.content.trim()) return;
    setSavingManual(true);
    setManualError(null);
    setManualSaved(false);
    try {
      const res = await fetch('/api/admin/social/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(manualForm),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to add content');
      setManualForm(emptyManualForm);
      setManualSaved(true);
    } catch (err) {
      setManualError(err instanceof Error ? err.message : 'Failed to add content');
    } finally {
      setSavingManual(false);
    }
  };

  return (
    <AdminLayout title="Social Ingestion">
      <div className="space-y-8">
        <p className="max-w-2xl text-sm text-gray-600">
          Pull the founder&apos;s public content into the Founder Knowledge library. Substack and YouTube publish public
          feeds, so those sync automatically; TikTok and Instagram have no such feed, so their content is added by hand
          below. Everything lands as a new knowledge source at{' '}
          <Link href="/admin/knowledge" className="text-gold-700 underline">
            Founder Knowledge
          </Link>
          , where it still needs to be ingested and published like any other source.
        </p>

        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-2xl border border-midnight-950/10 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-midnight-950">Add an automated connection</h3>
            {connectionError && <p className="mb-3 text-sm text-red-600">{connectionError}</p>}
            <form onSubmit={createConnection} className="space-y-3">
              <Input placeholder="Label, e.g. 'Livingstone's Substack'" value={connectionForm.label} onChange={(e) => setConnectionForm({ ...connectionForm, label: e.target.value })} />
              <Select
                options={CONNECTION_PLATFORM_OPTIONS}
                value={connectionForm.platform}
                onChange={(e) => setConnectionForm({ ...connectionForm, platform: e.target.value })}
              />
              <Input
                placeholder={connectionForm.platform === 'substack' ? 'Feed URL, e.g. https://name.substack.com/feed' : 'Feed URL, e.g. https://www.youtube.com/feeds/videos.xml?channel_id=...'}
                value={connectionForm.feed_url}
                onChange={(e) => setConnectionForm({ ...connectionForm, feed_url: e.target.value })}
              />
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={connectionForm.auto_sync}
                  onChange={(e) => setConnectionForm({ ...connectionForm, auto_sync: e.target.checked })}
                />
                Sync automatically (daily, requires CRON_SECRET — see Integrations &amp; keys)
              </label>
              <Button type="submit" variant="gold" disabled={creatingConnection} className="w-full">
                {creatingConnection ? 'Adding...' : 'Add connection'}
              </Button>
            </form>
            {connectionForm.platform === 'youtube' && (
              <p className="mt-3 text-xs leading-5 text-gray-500">
                YouTube&apos;s public feed only carries title and description — no transcript. New videos land as
                &quot;needs review&quot; sources; open one on the Founder Knowledge page and paste in the real transcript
                (from YouTube&apos;s own &quot;Show transcript&quot; panel) before ingesting.
              </p>
            )}
          </div>

          <div className="space-y-3">
            {loading && <p className="text-sm text-gray-500">Loading...</p>}
            {!loading && connections.length === 0 && <p className="text-sm text-gray-500">No connections yet.</p>}
            {connections.map((connection) => (
              <div key={connection.id} className="rounded-xl border border-midnight-950/10 bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-midnight-950">{connection.label}</p>
                    <p className="text-xs text-gray-500">
                      {connection.platform} · {connection.feed_url}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${SYNC_STATUS_STYLES[connection.last_sync_status] ?? ''}`}>
                    {connection.last_sync_status}
                  </span>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  {connection.last_synced_at
                    ? `Last synced ${new Date(connection.last_synced_at).toLocaleString()} · ${connection.new_content_count} new, ${connection.failed_content_count} failed`
                    : 'Never synced'}
                </p>
                {connection.last_sync_message && <p className="mt-1 text-xs text-gray-500">{connection.last_sync_message}</p>}
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <Button variant="secondary" onClick={() => syncNow(connection.id)} disabled={busyId === connection.id}>
                    {busyId === connection.id ? 'Syncing...' : 'Sync now'}
                  </Button>
                  <label className="flex items-center gap-2 text-xs text-gray-600">
                    <input type="checkbox" checked={connection.auto_sync} onChange={() => toggleAutoSync(connection)} />
                    Sync automatically
                  </label>
                  <button onClick={() => removeConnection(connection.id)} className="ml-auto rounded-full p-1.5 text-gray-400 hover:text-red-600">×</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-midnight-950/10 bg-white p-6">
          <h3 className="mb-1 text-sm font-semibold text-midnight-950">Add TikTok or Instagram content manually</h3>
          <p className="mb-4 text-xs text-gray-500">
            There&apos;s no public feed for these platforms, so paste the caption or spoken transcript directly.
          </p>
          {manualError && <p className="mb-3 text-sm text-red-600">{manualError}</p>}
          {manualSaved && <p className="mb-3 text-sm text-emerald-700">Added — find it on the Founder Knowledge page to ingest and publish.</p>}
          <form onSubmit={addManualContent} className="grid gap-3 md:grid-cols-2">
            <Select
              options={MANUAL_PLATFORM_OPTIONS}
              value={manualForm.platform}
              onChange={(e) => setManualForm({ ...manualForm, platform: e.target.value })}
            />
            <Input placeholder="Title, e.g. 'On dreams about falling'" value={manualForm.title} onChange={(e) => setManualForm({ ...manualForm, title: e.target.value })} />
            <Input placeholder="Post URL (optional)" value={manualForm.url} onChange={(e) => setManualForm({ ...manualForm, url: e.target.value })} className="md:col-span-2" />
            <Textarea
              placeholder="Caption or transcript text"
              value={manualForm.content}
              onChange={(e) => setManualForm({ ...manualForm, content: e.target.value })}
              className="min-h-[140px] md:col-span-2"
            />
            <Button type="submit" variant="gold" disabled={savingManual} className="md:col-span-2">
              {savingManual ? 'Saving...' : 'Add content'}
            </Button>
          </form>
        </div>

        <Link
          href="/admin/knowledge"
          className="group flex items-center justify-between rounded-xl border border-gold-600/30 bg-gold-100/50 p-5 transition-colors duration-200 hover:border-gold-600/50"
        >
          <div>
            <p className="text-sm font-semibold text-midnight-950">Review, ingest, and publish synced content</p>
            <p className="text-xs text-gray-600">Everything added here shows up on the Founder Knowledge page alongside books and journals.</p>
          </div>
          <ArrowRight className="w-4 h-4 shrink-0 text-gold-700 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </AdminLayout>
  );
}
