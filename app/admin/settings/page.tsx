'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Input, Button } from '@/components/ui';
import { SETTINGS_GROUPS } from '@/lib/settingsSchema';

type Setting = { key: string; value: string; updated_at: string };

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const load = async () => {
    const res = await fetch('/api/admin/settings');
    if (res.ok) {
      const data = await res.json();
      const byKey = Object.fromEntries(data.settings.map((s: Setting) => [s.key, s.value]));
      setDrafts(byKey);
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
        body: JSON.stringify({ key, value: drafts[key] ?? '' }),
      });
      if (res.ok) await load();
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <AdminLayout title="Site settings">
      <div className="max-w-2xl space-y-8">
        {loading && <p className="text-sm text-gray-500">Loading...</p>}
        {!loading &&
          SETTINGS_GROUPS.map((group) => (
            <div key={group.label}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-gray-500">{group.label}</h3>
              <div className="space-y-4">
                {group.fields.map((field) => (
                  <div key={field.key} className="rounded-xl border border-midnight-950/10 bg-white p-5">
                    <label className="mb-2 block text-sm font-semibold text-midnight-950">{field.label}</label>
                    <div className="flex gap-2">
                      <Input
                        value={drafts[field.key] ?? ''}
                        placeholder={field.default}
                        onChange={(e) => setDrafts({ ...drafts, [field.key]: e.target.value })}
                      />
                      <Button onClick={() => save(field.key)} disabled={savingKey === field.key} variant="gold">
                        {savingKey === field.key ? 'Saving...' : 'Save'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </AdminLayout>
  );
}
