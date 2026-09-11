'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDreamscourt } from '@/lib/dreamscourt/context';
import { Eyebrow, GlassCard, IconBadge } from '../ui';
import {
  createDreamFolder,
  deleteDreamFolder,
  fetchDreamCaptureDetails,
  fetchDreamFolders,
  interpretDream,
  saveDreamCaptureDetails,
} from '@/lib/api/dreams';
import { DREAM_TYPES, dreamTypeLabel } from '@/lib/dreamTypes';
import type { Dream, DreamCaptureDetails, DreamFolder, DreamInterpretation } from '@/types/database';
import { Archive, Brain, ChevronDown, FolderPlus, MoonStar, Plus, Search, Sparkles, Star } from 'lucide-react';

const CAPTURE_FIELDS: { key: keyof NonNullable<ReturnType<typeof emptyCaptureForm>>; label: string; placeholder: string }[] = [
  { key: 'people', label: 'People', placeholder: 'Everyone you saw — who they were, what they said or did' },
  { key: 'places', label: 'Places & environment', placeholder: 'Where it happened, and the atmosphere (bright/dark, familiar/unfamiliar...)' },
  { key: 'attire', label: 'Attire & appearance', placeholder: "What you or others were wearing, if it stood out" },
  { key: 'emotions', label: 'Emotions', placeholder: 'The strongest emotion in the dream, and how you felt on waking' },
  { key: 'timing', label: 'Timing', placeholder: 'Time of day, a date, a season — anything time-related' },
  { key: 'numbers', label: 'Numbers', placeholder: 'Any number that stood out — be precise (e.g. "seven people")' },
  { key: 'colors', label: 'Colours', placeholder: 'Colours that appeared prominently or repeatedly' },
  { key: 'sounds', label: 'Sounds, words & messages', placeholder: 'Anything said to you, or unusual sounds you heard' },
  { key: 'repeated_patterns', label: 'Repeated patterns', placeholder: 'Anything that appeared more than once, in this dream or across others' },
  { key: 'ending', label: "The dream's ending", placeholder: 'What happened right before you woke — how it felt to end there' },
];

function emptyCaptureForm() {
  return {
    people: '',
    places: '',
    attire: '',
    emotions: '',
    timing: '',
    numbers: '',
    colors: '',
    sounds: '',
    repeated_patterns: '',
    ending: '',
  };
}

const emptyNewDreamForm = {
  title: '',
  date_occurred: new Date().toISOString().slice(0, 10),
  mood: '',
  clarity: '',
  tagsText: '',
  dream_type: '',
  content: '',
};

export function DreamsView() {
  const { dreams, stats, addDream, toggleDreamFavorite, toggleDreamArchive, setDreamFolder, removeDream, setError } = useDreamscourt();
  const [query, setQuery] = useState('');
  const [interpretations, setInterpretations] = useState<Record<string, DreamInterpretation>>({});
  const [interpretingId, setInterpretingId] = useState<string | null>(null);
  const [folders, setFolders] = useState<DreamFolder[]>([]);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [activeDreamType, setActiveDreamType] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolder, setShowNewFolder] = useState(false);

  const [showNewDream, setShowNewDream] = useState(false);
  const [newDreamForm, setNewDreamForm] = useState(emptyNewDreamForm);
  const [showDetailedCapture, setShowDetailedCapture] = useState(false);
  const [captureForm, setCaptureForm] = useState(emptyCaptureForm());
  const [savingDream, setSavingDream] = useState(false);

  useEffect(() => {
    fetchDreamFolders().then(setFolders).catch(() => {});
  }, []);

  const dreamTypesInUse = useMemo(
    () => DREAM_TYPES.filter((t) => dreams.some((d) => d.dream_type === t.value)),
    [dreams]
  );

  const filteredDreams = useMemo(() => {
    const safe = query.trim().toLowerCase();
    return dreams
      .filter((dream) => !activeFolderId || dream.folder_id === activeFolderId)
      .filter((dream) => !activeDreamType || dream.dream_type === activeDreamType)
      .filter((dream) => !safe || `${dream.title} ${dream.description ?? ''}`.toLowerCase().includes(safe));
  }, [dreams, query, activeFolderId, activeDreamType]);

  const guard = (action: () => Promise<void>) => async () => {
    try {
      await action();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update the dream');
    }
  };

  const handleInterpret = async (dreamId: string) => {
    setInterpretingId(dreamId);
    try {
      const interpretation = await interpretDream(dreamId);
      setInterpretations((prev) => ({ ...prev, [dreamId]: interpretation }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate an AI insight for this dream');
    } finally {
      setInterpretingId(null);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      const folder = await createDreamFolder(newFolderName.trim());
      setFolders((prev) => [...prev, folder]);
      setNewFolderName('');
      setShowNewFolder(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create folder');
    }
  };

  const handleDeleteFolder = async (folder: DreamFolder) => {
    try {
      await deleteDreamFolder(folder.id);
      setFolders((prev) => prev.filter((f) => f.id !== folder.id));
      if (activeFolderId === folder.id) setActiveFolderId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete folder');
    }
  };

  const handleCreateDream = async () => {
    if (!newDreamForm.title.trim() || !newDreamForm.date_occurred) return;
    setSavingDream(true);
    try {
      const dream = await addDream({
        title: newDreamForm.title.trim(),
        date_occurred: new Date(newDreamForm.date_occurred).toISOString(),
        mood: newDreamForm.mood || undefined,
        clarity: newDreamForm.clarity ? Number(newDreamForm.clarity) : undefined,
        tags: newDreamForm.tagsText
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        dream_type: newDreamForm.dream_type || null,
        content: newDreamForm.content || undefined,
        description: newDreamForm.content || undefined,
      });

      const hasCaptureContent = Object.values(captureForm).some((v) => v.trim());
      if (hasCaptureContent) {
        await saveDreamCaptureDetails(dream.id, captureForm);
      }

      setNewDreamForm(emptyNewDreamForm);
      setCaptureForm(emptyCaptureForm());
      setShowDetailedCapture(false);
      setShowNewDream(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save the dream');
    } finally {
      setSavingDream(false);
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <GlassCard>
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <IconBadge>
              <Brain className="h-4 w-4" />
            </IconBadge>
            <div>
              <Eyebrow>Archive</Eyebrow>
              <h2 className="mt-1 text-lg font-semibold text-midnight-950">A private library of dream memory</h2>
            </div>
          </div>
          <button
            onClick={() => setShowNewDream((v) => !v)}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-midnight-950 px-3.5 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-midnight-950/85"
          >
            <Plus className="h-3.5 w-3.5" />
            New dream
          </button>
        </div>

        {showNewDream && (
          <div className="mb-5 rounded-md border border-midnight-950/10 bg-gray-50 p-4">
            <div className="grid gap-2.5 sm:grid-cols-2">
              <input
                value={newDreamForm.title}
                onChange={(e) => setNewDreamForm({ ...newDreamForm, title: e.target.value })}
                placeholder="Title"
                className="rounded-md border border-midnight-950/10 bg-white px-3 py-2 text-sm text-midnight-950 outline-none placeholder:text-gray-400"
              />
              <input
                type="date"
                value={newDreamForm.date_occurred}
                onChange={(e) => setNewDreamForm({ ...newDreamForm, date_occurred: e.target.value })}
                className="rounded-md border border-midnight-950/10 bg-white px-3 py-2 text-sm text-midnight-950 outline-none"
              />
              <input
                value={newDreamForm.mood}
                onChange={(e) => setNewDreamForm({ ...newDreamForm, mood: e.target.value })}
                placeholder="Mood (e.g. peaceful, anxious)"
                className="rounded-md border border-midnight-950/10 bg-white px-3 py-2 text-sm text-midnight-950 outline-none placeholder:text-gray-400"
              />
              <select
                value={newDreamForm.clarity}
                onChange={(e) => setNewDreamForm({ ...newDreamForm, clarity: e.target.value })}
                className="rounded-md border border-midnight-950/10 bg-white px-3 py-2 text-sm text-gray-600 outline-none"
              >
                <option value="">Clarity (optional)</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} / 5
                  </option>
                ))}
              </select>
              <input
                value={newDreamForm.tagsText}
                onChange={(e) => setNewDreamForm({ ...newDreamForm, tagsText: e.target.value })}
                placeholder="Tags, comma separated"
                className="sm:col-span-2 rounded-md border border-midnight-950/10 bg-white px-3 py-2 text-sm text-midnight-950 outline-none placeholder:text-gray-400"
              />
              <div className="sm:col-span-2">
                <select
                  value={newDreamForm.dream_type}
                  onChange={(e) => setNewDreamForm({ ...newDreamForm, dream_type: e.target.value })}
                  className="w-full rounded-md border border-midnight-950/10 bg-white px-3 py-2 text-sm text-gray-600 outline-none"
                >
                  <option value="">Dream type — optional, you can classify later</option>
                  {DREAM_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                {newDreamForm.dream_type && (
                  <p className="mt-1.5 text-xs text-gray-500">{DREAM_TYPES.find((t) => t.value === newDreamForm.dream_type)?.description}</p>
                )}
              </div>
              <textarea
                value={newDreamForm.content}
                onChange={(e) => setNewDreamForm({ ...newDreamForm, content: e.target.value })}
                placeholder="Events — what happened, in as much detail as you can remember"
                className="sm:col-span-2 min-h-[100px] rounded-md border border-midnight-950/10 bg-white px-3 py-2 text-sm text-midnight-950 outline-none placeholder:text-gray-400"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowDetailedCapture((v) => !v)}
              className="mt-3 flex items-center gap-1 text-xs font-semibold text-gold-700 hover:text-midnight-950"
            >
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${showDetailedCapture ? 'rotate-180' : ''}`} />
              Detailed capture (optional)
            </button>

            {showDetailedCapture && (
              <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {CAPTURE_FIELDS.map((field) => (
                  <textarea
                    key={field.key}
                    value={captureForm[field.key]}
                    onChange={(e) => setCaptureForm({ ...captureForm, [field.key]: e.target.value })}
                    placeholder={`${field.label} — ${field.placeholder}`}
                    className="min-h-[70px] rounded-md border border-midnight-950/10 bg-white px-3 py-2 text-sm text-midnight-950 outline-none placeholder:text-gray-400"
                  />
                ))}
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <button
                onClick={handleCreateDream}
                disabled={savingDream}
                className="rounded-md bg-gold-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-gold-700 disabled:opacity-50"
              >
                {savingDream ? 'Saving...' : 'Save dream'}
              </button>
              <button
                onClick={() => setShowNewDream(false)}
                className="rounded-md border border-midnight-950/15 px-4 py-2 text-sm font-semibold text-gray-600 hover:text-midnight-950"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveFolderId(null)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors duration-200 ${!activeFolderId ? 'bg-midnight-950/8 text-midnight-950' : 'text-gray-500 hover:text-midnight-950'}`}
          >
            All
          </button>
          {folders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => setActiveFolderId(folder.id)}
              onDoubleClick={() => handleDeleteFolder(folder)}
              title="Double-click to delete"
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors duration-200 ${activeFolderId === folder.id ? 'bg-midnight-950/8 text-midnight-950' : 'text-gray-500 hover:text-midnight-950'}`}
            >
              {folder.name}
            </button>
          ))}
          {showNewFolder ? (
            <div className="flex items-center gap-1.5">
              <input
                autoFocus
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                placeholder="Folder name"
                className="w-28 rounded-full border border-midnight-950/10 bg-gray-50 px-3 py-1 text-xs text-midnight-950 outline-none placeholder:text-gray-400"
              />
              <button onClick={handleCreateFolder} className="text-xs font-semibold text-gold-700">Add</button>
            </div>
          ) : (
            <button onClick={() => setShowNewFolder(true)} className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-gray-500 hover:text-midnight-950">
              <FolderPlus className="h-3.5 w-3.5" />
              New folder
            </button>
          )}
        </div>

        {dreamTypesInUse.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveDreamType(null)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors duration-200 ${!activeDreamType ? 'bg-gold-500/15 text-gold-700' : 'text-gray-500 hover:text-midnight-950'}`}
            >
              All types
            </button>
            {dreamTypesInUse.map((t) => (
              <button
                key={t.value}
                onClick={() => setActiveDreamType(t.value)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors duration-200 ${activeDreamType === t.value ? 'bg-gold-500/15 text-gold-700' : 'text-gray-500 hover:text-midnight-950'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 rounded-md border border-midnight-950/10 bg-gray-50 px-3 py-2.5">
          <Search className="h-4 w-4 text-gray-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full bg-transparent text-sm text-midnight-950 outline-none placeholder:text-gray-400"
            placeholder="Search dreams"
          />
        </div>
        <div className="mt-5 space-y-2">
          {filteredDreams.length === 0 && <p className="text-sm text-gray-500">No dreams match yet.</p>}
          {filteredDreams.map((dream) => (
            <DreamCard
              key={dream.id}
              dream={dream}
              folders={folders}
              interpretation={interpretations[dream.id]}
              interpreting={interpretingId === dream.id}
              onFavorite={guard(() => toggleDreamFavorite(dream))}
              onArchive={guard(() => toggleDreamArchive(dream))}
              onFolderChange={(folderId) => guard(() => setDreamFolder(dream, folderId))()}
              onRemove={guard(() => removeDream(dream.id))}
              onInterpret={() => handleInterpret(dream.id)}
              onError={(message) => setError(message)}
            />
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <div className="mb-5 flex items-center gap-3">
          <IconBadge>
            <MoonStar className="h-4 w-4" />
          </IconBadge>
          <div>
            <Eyebrow>Patterns</Eyebrow>
            <h2 className="mt-1 text-lg font-semibold text-midnight-950">Recurring signals across your dreams</h2>
          </div>
        </div>
        <div className="rounded-md border border-midnight-950/8 p-5">
          {stats.recurringThemes.length ? (
            stats.recurringThemes.map((theme) => (
              <div key={theme} className="mb-2 rounded-md border border-midnight-950/8 bg-gray-50 px-4 py-2.5 text-sm text-gray-600 last:mb-0">
                {theme}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No patterns yet — begin journaling to grow this view.</p>
          )}
        </div>
      </GlassCard>
    </div>
  );
}

function DreamCard({
  dream,
  folders,
  interpretation,
  interpreting,
  onFavorite,
  onArchive,
  onFolderChange,
  onRemove,
  onInterpret,
  onError,
}: {
  dream: Dream;
  folders: DreamFolder[];
  interpretation?: DreamInterpretation;
  interpreting: boolean;
  onFavorite: () => void;
  onArchive: () => void;
  onFolderChange: (folderId: string | null) => void;
  onRemove: () => void;
  onInterpret: () => void;
  onError: (message: string) => void;
}) {
  const [showCapture, setShowCapture] = useState(false);
  const [captureLoaded, setCaptureLoaded] = useState(false);
  const [captureForm, setCaptureForm] = useState(emptyCaptureForm());
  const [savingCapture, setSavingCapture] = useState(false);

  const toggleCapture = async () => {
    const opening = !showCapture;
    setShowCapture(opening);
    if (opening && !captureLoaded) {
      try {
        const existing: DreamCaptureDetails | null = await fetchDreamCaptureDetails(dream.id);
        setCaptureForm({
          people: existing?.people ?? '',
          places: existing?.places ?? '',
          attire: existing?.attire ?? '',
          emotions: existing?.emotions ?? '',
          timing: existing?.timing ?? '',
          numbers: existing?.numbers ?? '',
          colors: existing?.colors ?? '',
          sounds: existing?.sounds ?? '',
          repeated_patterns: existing?.repeated_patterns ?? '',
          ending: existing?.ending ?? '',
        });
        setCaptureLoaded(true);
      } catch (err) {
        onError(err instanceof Error ? err.message : 'Failed to load capture details');
      }
    }
  };

  const saveCapture = async () => {
    setSavingCapture(true);
    try {
      await saveDreamCaptureDetails(dream.id, captureForm);
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to save capture details');
    } finally {
      setSavingCapture(false);
    }
  };

  return (
    <div className="rounded-md border border-midnight-950/8 bg-gray-50 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-midnight-950">{dream.title}</p>
            {dream.dream_type && (
              <span className="rounded-full bg-gold-500/15 px-2 py-0.5 text-[11px] font-semibold text-gold-700">
                {dreamTypeLabel(dream.dream_type)}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500">{new Date(dream.date_occurred).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-1.5">
          {folders.length > 0 && (
            <select
              value={dream.folder_id ?? ''}
              onChange={(e) => onFolderChange(e.target.value || null)}
              className="rounded-md border border-midnight-950/10 bg-gray-50 px-2 py-1.5 text-xs text-gray-600 outline-none"
            >
              <option value="">No folder</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
          )}
          <button
            onClick={onFavorite}
            className={`rounded-full p-2 transition-colors duration-200 ${dream.favorite ? 'bg-gold-500/15 text-gold-700' : 'text-gray-400 hover:text-gold-700'}`}
          >
            <Star className="h-4 w-4" />
          </button>
          <button
            onClick={onArchive}
            className={`rounded-full p-2 transition-colors duration-200 ${dream.is_archived ? 'bg-midnight-950/8 text-midnight-950' : 'text-gray-400 hover:text-midnight-950'}`}
          >
            <Archive className="h-4 w-4" />
          </button>
          <button onClick={onRemove} className="rounded-full p-2 text-gray-400 transition-colors duration-200 hover:text-red-600">
            ×
          </button>
        </div>
      </div>
      {dream.description && <p className="mt-2 text-sm leading-6 text-gray-600">{dream.description}</p>}
      {dream.voice_recording_url && <audio controls src={dream.voice_recording_url} className="mt-2 h-8 w-full max-w-xs" />}

      <button onClick={toggleCapture} className="mt-3 flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-midnight-950">
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${showCapture ? 'rotate-180' : ''}`} />
        Detailed capture
      </button>

      {showCapture && (
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {CAPTURE_FIELDS.map((field) => (
            <textarea
              key={field.key}
              value={captureForm[field.key]}
              onChange={(e) => setCaptureForm({ ...captureForm, [field.key]: e.target.value })}
              placeholder={`${field.label} — ${field.placeholder}`}
              className="min-h-[60px] rounded-md border border-midnight-950/10 bg-white px-3 py-2 text-xs text-midnight-950 outline-none placeholder:text-gray-400"
            />
          ))}
          <button
            onClick={saveCapture}
            disabled={savingCapture}
            className="sm:col-span-2 rounded-md bg-midnight-950/90 px-3 py-1.5 text-xs font-semibold text-white hover:bg-midnight-950 disabled:opacity-50"
          >
            {savingCapture ? 'Saving...' : 'Save capture'}
          </button>
        </div>
      )}

      {interpretation ? (
        <div className="mt-3 rounded-md border border-gold-400/20 bg-gold-500/[0.06] p-3.5">
          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-gold-700">
            <Sparkles className="h-3.5 w-3.5" />
            AI insight
          </div>
          <p className="text-sm leading-6 text-gray-600">{interpretation.interpretation}</p>
        </div>
      ) : (
        <button
          onClick={onInterpret}
          disabled={interpreting}
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-gold-700 transition-colors duration-200 hover:text-midnight-950 disabled:opacity-50"
        >
          <Sparkles className="h-3.5 w-3.5" />
          {interpreting ? 'Reflecting...' : 'Get AI insight'}
        </button>
      )}
    </div>
  );
}
