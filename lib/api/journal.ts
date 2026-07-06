import type { PrayerJournalEntry } from '@/types/database';

async function parseOrThrow<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

export type JournalDraft = {
  title: string;
  content: string;
  prayer_type?: string;
  date_prayed: string;
  tags?: string[];
};

export async function fetchJournalEntries(): Promise<PrayerJournalEntry[]> {
  const res = await fetch('/api/journal');
  const data = await parseOrThrow<{ entries: PrayerJournalEntry[] }>(res);
  return data.entries;
}

export async function createJournalEntry(draft: JournalDraft): Promise<PrayerJournalEntry> {
  const res = await fetch('/api/journal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(draft),
  });
  const data = await parseOrThrow<{ entry: PrayerJournalEntry }>(res);
  return data.entry;
}

export async function updateJournalEntry(
  id: string,
  patch: Partial<JournalDraft & { is_answered: boolean; answer_notes: string }>
): Promise<PrayerJournalEntry> {
  const res = await fetch(`/api/journal/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
  const data = await parseOrThrow<{ entry: PrayerJournalEntry }>(res);
  return data.entry;
}

export async function deleteJournalEntry(id: string): Promise<void> {
  const res = await fetch(`/api/journal/${id}`, { method: 'DELETE' });
  await parseOrThrow(res);
}
