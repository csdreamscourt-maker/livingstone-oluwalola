'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Input, Button } from '@/components/ui';

type SecretStatus = { key: string; configured: boolean };

const GROUPS: { label: string; keys: string[] }[] = [
  { label: 'OpenAI (AI discernment & Dream Lab images)', keys: ['OPENAI_API_KEY'] },
  { label: 'Resend (email)', keys: ['RESEND_API_KEY', 'EMAIL_FROM', 'ADMIN_NOTIFICATION_EMAIL'] },
  {
    label: 'Cloudflare R2 (file storage)',
    keys: ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET_NAME', 'R2_PUBLIC_URL'],
  },
];

export default function AdminIntegrationsPage() {
  const [statuses, setStatuses] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const load = async () => {
    const res = await fetch('/api/admin/secrets');
    if (res.ok) {
      const data = await res.json();
      setStatuses(Object.fromEntries(data.secrets.map((s: SecretStatus) => [s.key, s.configured])));
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
      const res = await fetch('/api/admin/secrets', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value: drafts[key] ?? '' }),
      });
      if (res.ok) {
        setDrafts({ ...drafts, [key]: '' });
        await load();
      }
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <AdminLayout title="Integrations & API keys">
      <div className="max-w-2xl space-y-8">
        <p className="text-sm text-gray-600">
          Credentials are encrypted at rest and never shown once saved. Leave a field blank and save to clear it.
        </p>
        {loading && <p className="text-sm text-gray-500">Loading...</p>}
        {!loading &&
          GROUPS.map((group) => (
            <div key={group.label}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-gray-500">{group.label}</h3>
              <div className="space-y-4">
                {group.keys.map((key) => (
                  <div key={key} className="rounded-xl border border-midnight-950/10 bg-white p-5">
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-sm font-semibold text-midnight-950">{key}</label>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          statuses[key] ? 'bg-emerald-100 text-emerald-700' : 'border border-midnight-950/15 text-gray-500'
                        }`}
                      >
                        {statuses[key] ? 'Configured ✓' : 'Not set'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        type="password"
                        placeholder={statuses[key] ? '••••••••••••' : 'Enter value'}
                        value={drafts[key] ?? ''}
                        onChange={(e) => setDrafts({ ...drafts, [key]: e.target.value })}
                      />
                      <Button onClick={() => save(key)} disabled={savingKey === key} variant="gold">
                        {savingKey === key ? 'Saving...' : 'Save'}
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
