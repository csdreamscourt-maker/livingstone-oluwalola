'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Input, Select, Button } from '@/components/ui';

type SafeProvider = {
  id: string;
  slug: string;
  name: string;
  kind: 'openai' | 'anthropic' | 'google' | 'nvidia' | 'custom';
  base_url?: string;
  has_api_key: boolean;
  enabled: boolean;
  last_tested_at?: string;
  last_test_ok?: boolean;
  last_test_message?: string;
};

type ModelRow = {
  id: string;
  provider_id: string;
  model_id: string;
  display_name: string;
  supports_text: boolean;
  supports_vision: boolean;
  supports_image_generation: boolean;
  supports_embeddings: boolean;
  context_window?: number;
  cost_tier?: string;
  enabled: boolean;
  provider_slug: string;
  provider_name: string;
};

type Assignment = {
  task_key: string;
  primary_model_id?: string;
  fallback_model_ids: string[];
  updated_at: string;
};

const TASKS = [
  { key: 'dream_interpretation', label: 'Dream interpretation', description: 'Dream Lab discernment and dream journal AI interpretation (text/chat completions).' },
  { key: 'image_generation', label: 'Dream Lab image generation', description: 'Symbolic imagery generated for a dream in Dream Lab.' },
];

const KIND_OPTIONS = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'google', label: 'Google' },
  { value: 'nvidia', label: 'NVIDIA' },
  { value: 'custom', label: 'Custom (OpenAI-compatible)' },
];

const emptyProviderForm = { slug: '', name: '', kind: 'openai', base_url: '', api_key: '' };
const emptyModelForm = {
  provider_id: '',
  model_id: '',
  display_name: '',
  supports_text: true,
  supports_vision: false,
  supports_image_generation: false,
  context_window: '',
  cost_tier: '',
};

export default function AdminAiPage() {
  const [providers, setProviders] = useState<SafeProvider[]>([]);
  const [models, setModels] = useState<ModelRow[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  const [providerForm, setProviderForm] = useState(emptyProviderForm);
  const [savingProvider, setSavingProvider] = useState(false);
  const [providerError, setProviderError] = useState<string | null>(null);

  const [modelForm, setModelForm] = useState(emptyModelForm);
  const [savingModel, setSavingModel] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);

  const [testModel, setTestModel] = useState<Record<string, string>>({});
  const [testing, setTesting] = useState<string | null>(null);

  const load = async () => {
    const [providersRes, modelsRes, assignmentsRes] = await Promise.all([
      fetch('/api/admin/ai/providers'),
      fetch('/api/admin/ai/models'),
      fetch('/api/admin/ai/task-assignments'),
    ]);
    if (providersRes.ok) setProviders((await providersRes.json()).providers);
    if (modelsRes.ok) setModels((await modelsRes.json()).models);
    if (assignmentsRes.ok) setAssignments((await assignmentsRes.json()).assignments);
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, []);

  const createProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!providerForm.slug.trim() || !providerForm.name.trim()) return;
    setSavingProvider(true);
    setProviderError(null);
    try {
      const res = await fetch('/api/admin/ai/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...providerForm, base_url: providerForm.base_url || undefined }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to create provider');
      setProviderForm(emptyProviderForm);
      await load();
    } catch (err) {
      setProviderError(err instanceof Error ? err.message : 'Failed to create provider');
    } finally {
      setSavingProvider(false);
    }
  };

  const toggleProviderEnabled = async (provider: SafeProvider) => {
    const res = await fetch(`/api/admin/ai/providers/${provider.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: !provider.enabled }),
    });
    if (res.ok) await load();
  };

  const removeProvider = async (id: string) => {
    const res = await fetch(`/api/admin/ai/providers/${id}`, { method: 'DELETE' });
    if (res.ok) await load();
  };

  const runTest = async (providerId: string) => {
    const model = (testModel[providerId] || '').trim();
    if (!model) return;
    setTesting(providerId);
    try {
      await fetch(`/api/admin/ai/providers/${providerId}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model }),
      });
      await load();
    } finally {
      setTesting(null);
    }
  };

  const createModel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modelForm.provider_id || !modelForm.model_id.trim() || !modelForm.display_name.trim()) return;
    setSavingModel(true);
    setModelError(null);
    try {
      const res = await fetch('/api/admin/ai/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...modelForm,
          context_window: modelForm.context_window ? Number(modelForm.context_window) : undefined,
          cost_tier: modelForm.cost_tier || undefined,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to create model');
      setModelForm(emptyModelForm);
      await load();
    } catch (err) {
      setModelError(err instanceof Error ? err.message : 'Failed to create model');
    } finally {
      setSavingModel(false);
    }
  };

  const toggleModelEnabled = async (model: ModelRow) => {
    const res = await fetch(`/api/admin/ai/models/${model.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: !model.enabled }),
    });
    if (res.ok) await load();
  };

  const removeModel = async (id: string) => {
    const res = await fetch(`/api/admin/ai/models/${id}`, { method: 'DELETE' });
    if (res.ok) await load();
  };

  const saveAssignment = async (taskKey: string, primaryModelId: string, fallbackModelIds: string[]) => {
    const res = await fetch('/api/admin/ai/task-assignments', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task_key: taskKey, primary_model_id: primaryModelId || null, fallback_model_ids: fallbackModelIds }),
    });
    if (res.ok) await load();
  };

  const modelOptions = models.map((m) => ({ value: m.id, label: `${m.display_name} — ${m.provider_name}` }));

  return (
    <AdminLayout title="AI Control Center">
      <div className="space-y-10">
        {loading && <p className="text-sm text-gray-500">Loading...</p>}

        {/* Providers */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.1em] text-gray-500">Providers</h2>
          <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-2xl border border-midnight-950/10 bg-white p-6">
              <h3 className="mb-4 text-sm font-semibold text-midnight-950">New provider</h3>
              {providerError && <p className="mb-3 text-sm text-red-600">{providerError}</p>}
              <form onSubmit={createProvider} className="space-y-3">
                <Input placeholder="Slug (e.g. openai-main)" value={providerForm.slug} onChange={(e) => setProviderForm({ ...providerForm, slug: e.target.value })} />
                <Input placeholder="Display name" value={providerForm.name} onChange={(e) => setProviderForm({ ...providerForm, name: e.target.value })} />
                <Select
                  options={KIND_OPTIONS}
                  value={providerForm.kind}
                  onChange={(e) => setProviderForm({ ...providerForm, kind: e.target.value })}
                />
                <Input placeholder="Base URL (optional — leave blank for provider default)" value={providerForm.base_url} onChange={(e) => setProviderForm({ ...providerForm, base_url: e.target.value })} />
                <Input type="password" placeholder="API key" value={providerForm.api_key} onChange={(e) => setProviderForm({ ...providerForm, api_key: e.target.value })} />
                <Button type="submit" variant="gold" disabled={savingProvider} className="w-full">
                  {savingProvider ? 'Saving...' : 'Add provider'}
                </Button>
              </form>
            </div>

            <div className="space-y-3">
              {!loading && providers.length === 0 && <p className="text-sm text-gray-500">No providers configured yet.</p>}
              {providers.map((provider) => (
                <div key={provider.id} className="rounded-xl border border-midnight-950/10 bg-white p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-midnight-950">
                        {provider.name} <span className="text-xs font-normal text-gray-500">({provider.kind})</span>
                      </p>
                      <p className="text-xs text-gray-500">{provider.slug}{provider.base_url ? ` · ${provider.base_url}` : ''}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${provider.has_api_key ? 'bg-emerald-100 text-emerald-700' : 'border border-midnight-950/15 text-gray-500'}`}>
                        {provider.has_api_key ? 'Key configured' : 'No key'}
                      </span>
                      <button onClick={() => toggleProviderEnabled(provider)} className={`rounded-full px-3 py-1 text-xs font-semibold ${provider.enabled ? 'bg-emerald-100 text-emerald-700' : 'border border-midnight-950/15 text-gray-500'}`}>
                        {provider.enabled ? 'Enabled' : 'Disabled'}
                      </button>
                      <button onClick={() => removeProvider(provider.id)} className="rounded-full p-1.5 text-gray-400 hover:text-red-600">×</button>
                    </div>
                  </div>

                  {provider.last_tested_at && (
                    <p className={`mt-2 text-xs ${provider.last_test_ok ? 'text-emerald-700' : 'text-red-600'}`}>
                      Last tested {new Date(provider.last_tested_at).toLocaleString()}: {provider.last_test_message}
                    </p>
                  )}

                  <div className="mt-3 flex gap-2">
                    <Input
                      placeholder="Model id to test with (e.g. gpt-4o-mini)"
                      value={testModel[provider.id] || ''}
                      onChange={(e) => setTestModel({ ...testModel, [provider.id]: e.target.value })}
                    />
                    <Button variant="secondary" onClick={() => runTest(provider.id)} disabled={testing === provider.id}>
                      {testing === provider.id ? 'Testing...' : 'Test connection'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Models */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.1em] text-gray-500">Model registry</h2>
          <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-2xl border border-midnight-950/10 bg-white p-6">
              <h3 className="mb-4 text-sm font-semibold text-midnight-950">New model</h3>
              {modelError && <p className="mb-3 text-sm text-red-600">{modelError}</p>}
              <form onSubmit={createModel} className="space-y-3">
                <Select
                  options={providers.map((p) => ({ value: p.id, label: p.name }))}
                  placeholder="Provider"
                  value={modelForm.provider_id}
                  onChange={(e) => setModelForm({ ...modelForm, provider_id: e.target.value })}
                />
                <Input placeholder="Model id (e.g. gpt-4o, claude-opus-5)" value={modelForm.model_id} onChange={(e) => setModelForm({ ...modelForm, model_id: e.target.value })} />
                <Input placeholder="Display name" value={modelForm.display_name} onChange={(e) => setModelForm({ ...modelForm, display_name: e.target.value })} />
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <label className="flex items-center gap-1.5">
                    <input type="checkbox" checked={modelForm.supports_text} onChange={(e) => setModelForm({ ...modelForm, supports_text: e.target.checked })} />
                    Text
                  </label>
                  <label className="flex items-center gap-1.5">
                    <input type="checkbox" checked={modelForm.supports_vision} onChange={(e) => setModelForm({ ...modelForm, supports_vision: e.target.checked })} />
                    Vision
                  </label>
                  <label className="flex items-center gap-1.5">
                    <input type="checkbox" checked={modelForm.supports_image_generation} onChange={(e) => setModelForm({ ...modelForm, supports_image_generation: e.target.checked })} />
                    Image generation
                  </label>
                </div>
                <Input placeholder="Context window (tokens, optional)" value={modelForm.context_window} onChange={(e) => setModelForm({ ...modelForm, context_window: e.target.value })} />
                <Input placeholder="Cost tier (e.g. low, medium, high — optional)" value={modelForm.cost_tier} onChange={(e) => setModelForm({ ...modelForm, cost_tier: e.target.value })} />
                <Button type="submit" variant="gold" disabled={savingModel} className="w-full">
                  {savingModel ? 'Saving...' : 'Add model'}
                </Button>
              </form>
            </div>

            <div className="space-y-3">
              {!loading && models.length === 0 && <p className="text-sm text-gray-500">No models registered yet.</p>}
              {models.map((model) => (
                <div key={model.id} className="rounded-xl border border-midnight-950/10 bg-white p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-midnight-950">{model.display_name}</p>
                      <p className="text-xs text-gray-500">{model.model_id} · {model.provider_name}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button onClick={() => toggleModelEnabled(model)} className={`rounded-full px-3 py-1 text-xs font-semibold ${model.enabled ? 'bg-emerald-100 text-emerald-700' : 'border border-midnight-950/15 text-gray-500'}`}>
                        {model.enabled ? 'Enabled' : 'Disabled'}
                      </button>
                      <button onClick={() => removeModel(model.id)} className="rounded-full p-1.5 text-gray-400 hover:text-red-600">×</button>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    {[model.supports_text && 'text', model.supports_vision && 'vision', model.supports_image_generation && 'image generation'].filter(Boolean).join(' · ') || 'no capabilities set'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Task routing */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.1em] text-gray-500">Task routing</h2>
          <div className="space-y-4">
            {TASKS.map((task) => {
              const assignment = assignments.find((a) => a.task_key === task.key);
              return (
                <TaskRow
                  key={`${task.key}-${assignment?.updated_at ?? 'unset'}`}
                  taskKey={task.key}
                  label={task.label}
                  description={task.description}
                  modelOptions={modelOptions}
                  primaryModelId={assignment?.primary_model_id || ''}
                  fallbackModelIds={assignment?.fallback_model_ids || []}
                  onSave={saveAssignment}
                />
              );
            })}
          </div>
          <p className="mt-4 text-xs text-gray-500">
            Tasks with no primary model assigned keep using the existing environment-configured OpenAI key, so nothing breaks while you set this up.
          </p>
        </section>
      </div>
    </AdminLayout>
  );
}

function TaskRow({
  taskKey,
  label,
  description,
  modelOptions,
  primaryModelId,
  fallbackModelIds,
  onSave,
}: {
  taskKey: string;
  label: string;
  description: string;
  modelOptions: { value: string; label: string }[];
  primaryModelId: string;
  fallbackModelIds: string[];
  onSave: (taskKey: string, primaryModelId: string, fallbackModelIds: string[]) => Promise<void>;
}) {
  const [primary, setPrimary] = useState(primaryModelId);
  const [fallbacks, setFallbacks] = useState<string[]>(fallbackModelIds);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await onSave(taskKey, primary, fallbacks.filter(Boolean));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-midnight-950/10 bg-white p-5">
      <p className="text-sm font-semibold text-midnight-950">{label}</p>
      <p className="mb-3 text-xs text-gray-500">{description}</p>
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <Select label="Primary model" options={modelOptions} placeholder="Use environment default" value={primary} onChange={(e) => setPrimary(e.target.value)} />
        <div>
          <label className="mb-2 block text-sm font-semibold text-midnight-950">Fallback (in order)</label>
          {fallbacks.map((fb, index) => (
            <div key={index} className="mb-2 flex gap-2">
              <Select
                options={modelOptions}
                placeholder="Fallback model"
                value={fb}
                onChange={(e) => setFallbacks(fallbacks.map((f, i) => (i === index ? e.target.value : f)))}
              />
              <button type="button" onClick={() => setFallbacks(fallbacks.filter((_, i) => i !== index))} className="shrink-0 rounded-full p-1.5 text-gray-400 hover:text-red-600">
                ×
              </button>
            </div>
          ))}
          <button type="button" onClick={() => setFallbacks([...fallbacks, ''])} className="text-xs font-semibold text-gold-700 hover:text-midnight-950">
            + Add fallback
          </button>
        </div>
        <Button variant="gold" onClick={save} disabled={saving}>
          {saving ? 'Saving...' : 'Save routing'}
        </Button>
      </div>
    </div>
  );
}
