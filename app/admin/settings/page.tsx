'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Input, Button } from '@/components/ui';

type Setting = { key: string; value: string; updated_at: string };

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const load = async () => {
    const res = await fetch('/api/admin/settings');
    if (res.ok) {
      const data = await res.json();
      setSettings(data.settings);
      setDrafts(Object.fromEntries(data.settings.map((s: Setting) => [s.key, s.value])));
    }
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, []);

  const save = async (key: string) => {
    setSavingKey(key);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value: drafts[key] }),
      });
      if (res.ok) await load();
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <AdminLayout title="Site settings">
      <div className="max-w-xl space-y-4">
        {loading && <p className="text-sm text-white/50">Loading...</p>}
        {!loading && settings.length === 0 && <p className="text-sm text-white/50">No settings yet.</p>}
        {settings.map((setting) => (
          <div key={setting.key} className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.1em] text-white/40">{setting.key}</label>
            <div className="flex gap-2">
              <Input
                value={drafts[setting.key] ?? ''}
                onChange={(e) => setDrafts({ ...drafts, [setting.key]: e.target.value })}
                className="!bg-white/[0.03] !border-white/10 !text-white"
              />
              <Button onClick={() => save(setting.key)} disabled={savingKey === setting.key} variant="gold">
                {savingKey === setting.key ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
