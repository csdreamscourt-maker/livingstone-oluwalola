'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Textarea, Button } from '@/components/ui';

type Slot = {
  key: string;
  label: string;
  description?: string;
  published_version_id?: string;
  published_content?: string | null;
};

type Version = {
  id: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  author?: string;
  created_at: string;
};

export default function AdminPromptsPage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [versions, setVersions] = useState<Version[]>([]);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const [busyVersionId, setBusyVersionId] = useState<string | null>(null);

  const loadSlots = async () => {
    const res = await fetch('/api/admin/ai-prompts');
    if (res.ok) {
      const data = await res.json();
      setSlots(data.slots);
      if (!selectedKey && data.slots.length > 0) {
        setSelectedKey(data.slots[0].key);
        setDraft(data.slots[0].published_content ?? '');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await loadSlots();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadVersions = async (key: string) => {
    const res = await fetch(`/api/admin/ai-prompts/${key}/versions`);
    if (res.ok) setVersions((await res.json()).versions);
  };

  useEffect(() => {
    if (!selectedKey) return;
    (async () => {
      await loadVersions(selectedKey);
    })();
  }, [selectedKey]);

  const selectSlot = (slot: Slot) => {
    setSelectedKey(slot.key);
    setDraft(slot.published_content ?? '');
  };

  const saveDraft = async () => {
    if (!selectedKey || !draft.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/ai-prompts/${selectedKey}/versions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: draft }),
      });
      if (res.ok) await loadVersions(selectedKey);
    } finally {
      setSaving(false);
    }
  };

  const publish = async (versionId: string) => {
    if (!selectedKey) return;
    setBusyVersionId(versionId);
    try {
      const res = await fetch(`/api/admin/ai-prompts/${selectedKey}/versions/${versionId}/publish`, { method: 'POST' });
      if (res.ok) {
        await Promise.all([loadSlots(), loadVersions(selectedKey)]);
      }
    } finally {
      setBusyVersionId(null);
    }
  };

  const removeVersion = async (versionId: string) => {
    if (!selectedKey) return;
    const res = await fetch(`/api/admin/ai-prompts/${selectedKey}/versions/${versionId}`, { method: 'DELETE' });
    if (res.ok) await loadVersions(selectedKey);
  };

  const selectedSlot = slots.find((s) => s.key === selectedKey);

  return (
    <AdminLayout title="AI Prompts">
      <div className="space-y-4">
        <p className="max-w-2xl text-sm text-gray-600">
          Every edit creates a new draft version — nothing changes for live traffic until you publish it. Previous
          published versions stay in history, so you can roll back by re-publishing an older one.
        </p>

        <div className="grid gap-5 xl:grid-cols-[0.7fr_1.3fr]">
          <div className="space-y-2">
            {loading && <p className="text-sm text-gray-500">Loading...</p>}
            {slots.map((slot) => (
              <button
                key={slot.key}
                onClick={() => selectSlot(slot)}
                className={`block w-full rounded-xl border p-4 text-left transition-colors duration-200 ${
                  slot.key === selectedKey ? 'border-gold-600/50 bg-gold-100/40' : 'border-midnight-950/10 bg-white hover:border-midnight-950/20'
                }`}
              >
                <p className="text-sm font-semibold text-midnight-950">{slot.label}</p>
                {slot.description && <p className="mt-1 text-xs leading-5 text-gray-500">{slot.description}</p>}
              </button>
            ))}
          </div>

          {selectedSlot && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-midnight-950/10 bg-white p-6">
                <h3 className="mb-3 text-sm font-semibold text-midnight-950">Edit &amp; save as draft</h3>
                <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} className="min-h-[280px] font-mono text-xs" />
                <Button variant="gold" onClick={saveDraft} disabled={saving} className="mt-3">
                  {saving ? 'Saving...' : 'Save as new draft'}
                </Button>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold text-midnight-950">Version history</h3>
                <div className="space-y-2">
                  {versions.length === 0 && <p className="text-sm text-gray-500">No versions yet.</p>}
                  {versions.map((version) => (
                    <div key={version.id} className="rounded-xl border border-midnight-950/10 bg-white p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              version.status === 'published'
                                ? 'bg-emerald-100 text-emerald-700'
                                : version.status === 'draft'
                                  ? 'border border-midnight-950/15 text-gray-500'
                                  : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {version.status}
                          </span>
                          <p className="mt-1 text-xs text-gray-500">
                            {new Date(version.created_at).toLocaleString()} {version.author ? `· ${version.author}` : ''}
                          </p>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          {version.status !== 'published' && (
                            <Button variant="secondary" onClick={() => publish(version.id)} disabled={busyVersionId === version.id}>
                              {busyVersionId === version.id ? 'Publishing...' : 'Publish'}
                            </Button>
                          )}
                          {version.status !== 'published' && (
                            <button onClick={() => removeVersion(version.id)} className="rounded-full p-1.5 text-gray-400 hover:text-red-600">×</button>
                          )}
                        </div>
                      </div>
                      <p className="mt-2 max-h-24 overflow-hidden text-xs leading-5 text-gray-600">{version.content.slice(0, 300)}...</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
