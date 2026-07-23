'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDreamscourt } from '@/lib/dreamscourt/context';
import { Eyebrow, GlassCard, IconBadge } from '../ui';
import { createDreamFolder, deleteDreamFolder, fetchDreamFolders, interpretDream } from '@/lib/api/dreams';
import type { DreamFolder, DreamInterpretation } from '@/types/database';
import { Archive, Brain, FolderPlus, MoonStar, Search, Sparkles, Star } from 'lucide-react';

export function DreamsView() {
  const { dreams, stats, toggleDreamFavorite, toggleDreamArchive, setDreamFolder, removeDream, setError } = useDreamscourt();
  const [query, setQuery] = useState('');
  const [interpretations, setInterpretations] = useState<Record<string, DreamInterpretation>>({});
  const [interpretingId, setInterpretingId] = useState<string | null>(null);
  const [folders, setFolders] = useState<DreamFolder[]>([]);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolder, setShowNewFolder] = useState(false);

  useEffect(() => {
    fetchDreamFolders().then(setFolders).catch(() => {});
  }, []);

  const filteredDreams = useMemo(() => {
    const safe = query.trim().toLowerCase();
    return dreams
      .filter((dream) => !activeFolderId || dream.folder_id === activeFolderId)
      .filter((dream) => !safe || `${dream.title} ${dream.description ?? ''}`.toLowerCase().includes(safe));
  }, [dreams, query, activeFolderId]);

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

  return (
    <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <GlassCard>
        <div className="mb-5 flex items-center gap-3">
          <IconBadge>
            <Brain className="h-4 w-4" />
          </IconBadge>
          <div>
            <Eyebrow>Archive</Eyebrow>
            <h2 className="mt-1 text-lg font-semibold text-midnight-950">A private library of dream memory</h2>
          </div>
        </div>

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
            <div key={dream.id} className="rounded-md border border-midnight-950/8 bg-gray-50 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-midnight-950">{dream.title}</p>
                  <p className="text-xs text-gray-500">{new Date(dream.date_occurred).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  {folders.length > 0 && (
                    <select
                      value={dream.folder_id ?? ''}
                      onChange={(e) => guard(() => setDreamFolder(dream, e.target.value || null))()}
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
                    onClick={guard(() => toggleDreamFavorite(dream))}
                    className={`rounded-full p-2 transition-colors duration-200 ${
                      dream.favorite ? 'bg-gold-500/15 text-gold-700' : 'text-gray-400 hover:text-gold-700'
                    }`}
                  >
                    <Star className="h-4 w-4" />
                  </button>
                  <button
                    onClick={guard(() => toggleDreamArchive(dream))}
                    className={`rounded-full p-2 transition-colors duration-200 ${
                      dream.is_archived ? 'bg-midnight-950/8 text-midnight-950' : 'text-gray-400 hover:text-midnight-950'
                    }`}
                  >
                    <Archive className="h-4 w-4" />
                  </button>
                  <button
                    onClick={guard(() => removeDream(dream.id))}
                    className="rounded-full p-2 text-gray-400 transition-colors duration-200 hover:text-red-600"
                  >
                    ×
                  </button>
                </div>
              </div>
              {dream.description && <p className="mt-2 text-sm leading-6 text-gray-600">{dream.description}</p>}
              {dream.voice_recording_url && (
                <audio controls src={dream.voice_recording_url} className="mt-2 h-8 w-full max-w-xs" />
              )}

              {interpretations[dream.id] ? (
                <div className="mt-3 rounded-md border border-gold-400/20 bg-gold-500/[0.06] p-3.5">
                  <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-gold-700">
                    <Sparkles className="h-3.5 w-3.5" />
                    AI insight
                  </div>
                  <p className="text-sm leading-6 text-gray-600">{interpretations[dream.id].interpretation}</p>
                </div>
              ) : (
                <button
                  onClick={() => handleInterpret(dream.id)}
                  disabled={interpretingId === dream.id}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-gold-700 transition-colors duration-200 hover:text-midnight-950 disabled:opacity-50"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {interpretingId === dream.id ? 'Reflecting...' : 'Get AI insight'}
                </button>
              )}
            </div>
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
