import type { Dream, DreamFolder, DreamInterpretation } from '@/types/database';

async function parseOrThrow<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

export type DreamDraft = {
  title: string;
  description?: string;
  content?: string;
  date_occurred: string;
  mood?: string;
  tags?: string[];
  clarity?: number;
  is_private?: boolean;
  folder_id?: string | null;
  voice_recording_url?: string | null;
};

export async function fetchDreams(): Promise<Dream[]> {
  const res = await fetch('/api/dreams');
  const data = await parseOrThrow<{ dreams: Dream[] }>(res);
  return data.dreams;
}

export async function createDream(draft: DreamDraft): Promise<Dream> {
  const res = await fetch('/api/dreams', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(draft),
  });
  const data = await parseOrThrow<{ dream: Dream }>(res);
  return data.dream;
}

export async function updateDream(id: string, patch: Partial<DreamDraft & { favorite: boolean; is_archived: boolean }>): Promise<Dream> {
  const res = await fetch(`/api/dreams/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
  const data = await parseOrThrow<{ dream: Dream }>(res);
  return data.dream;
}

export async function deleteDream(id: string): Promise<void> {
  const res = await fetch(`/api/dreams/${id}`, { method: 'DELETE' });
  await parseOrThrow(res);
}

export async function interpretDream(dreamId: string): Promise<DreamInterpretation> {
  const res = await fetch('/api/dreams/interpret', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dreamId }),
  });
  const data = await parseOrThrow<{ interpretation: DreamInterpretation }>(res);
  return data.interpretation;
}

export async function fetchDreamFolders(): Promise<DreamFolder[]> {
  const res = await fetch('/api/dream-folders');
  const data = await parseOrThrow<{ folders: DreamFolder[] }>(res);
  return data.folders;
}

export async function createDreamFolder(name: string): Promise<DreamFolder> {
  const res = await fetch('/api/dream-folders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  const data = await parseOrThrow<{ folder: DreamFolder }>(res);
  return data.folder;
}

export async function deleteDreamFolder(id: string): Promise<void> {
  const res = await fetch(`/api/dream-folders/${id}`, { method: 'DELETE' });
  await parseOrThrow(res);
}

export async function uploadVoiceRecording(blob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append('audio', blob, 'recording.webm');
  const res = await fetch('/api/uploads/voice', { method: 'POST', body: formData });
  const data = await parseOrThrow<{ url: string }>(res);
  return data.url;
}
