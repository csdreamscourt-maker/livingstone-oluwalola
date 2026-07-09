'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchCurrentUser, logout as apiLogout } from '@/lib/api/auth';
import { createDream, deleteDream, fetchDreams, updateDream } from '@/lib/api/dreams';
import { createJournalEntry, fetchJournalEntries, updateJournalEntry } from '@/lib/api/journal';
import type { Dream, PrayerJournalEntry, User } from '@/types/database';

function computeStreak(dates: string[]): number {
  const days = new Set(dates.map((d) => new Date(d).toISOString().slice(0, 10)));
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function useDreamscourtWorkspace() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [journalEntries, setJournalEntries] = useState<PrayerJournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const currentUser = await fetchCurrentUser();
        if (!currentUser) {
          router.replace('/auth/login');
          return;
        }
        setUser(currentUser);

        const [dreamRows, journalRows] = await Promise.all([fetchDreams(), fetchJournalEntries()]);
        setDreams(dreamRows);
        setJournalEntries(journalRows);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load your Dreamscourt workspace');
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const stats = useMemo(() => {
    const moods = dreams.reduce<Record<string, number>>((acc, dream) => {
      if (dream.mood) acc[dream.mood] = (acc[dream.mood] || 0) + 1;
      return acc;
    }, {});

    const recurringThemes = Array.from(new Set(dreams.flatMap((dream) => dream.tags || []))).slice(0, 6);

    const clarityValues = dreams.filter((d) => typeof d.clarity === 'number');
    const averageClarity = clarityValues.length
      ? Math.round((clarityValues.reduce((sum, d) => sum + (d.clarity || 0), 0) / clarityValues.length) * 10) / 10
      : 0;

    const streak = computeStreak([
      ...dreams.map((d) => d.date_occurred),
      ...journalEntries.map((j) => j.date_prayed),
    ]);

    return {
      dreamCount: dreams.length,
      favoriteCount: dreams.filter((d) => d.favorite).length,
      answeredCount: journalEntries.filter((j) => j.is_answered).length,
      averageClarity,
      moods,
      recurringThemes,
      streak,
    };
  }, [dreams, journalEntries]);

  const logout = async () => {
    await apiLogout();
    router.push('/auth/login');
  };

  const addDream = async (input: { title: string; description: string; date_occurred: string; tags: string[] }) => {
    const dream = await createDream(input);
    setDreams((prev) => [dream, ...prev]);
    return dream;
  };

  const toggleDreamFavorite = async (dream: Dream) => {
    const updated = await updateDream(dream.id, { favorite: !dream.favorite });
    setDreams((prev) => prev.map((d) => (d.id === dream.id ? updated : d)));
  };

  const toggleDreamArchive = async (dream: Dream) => {
    const updated = await updateDream(dream.id, { is_archived: !dream.is_archived });
    setDreams((prev) => prev.map((d) => (d.id === dream.id ? updated : d)));
  };

  const removeDream = async (id: string) => {
    await deleteDream(id);
    setDreams((prev) => prev.filter((d) => d.id !== id));
  };

  const addJournalEntry = async (input: { title: string; content: string; prayer_type: string; date_prayed: string }) => {
    const entry = await createJournalEntry(input);
    setJournalEntries((prev) => [entry, ...prev]);
    return entry;
  };

  const toggleAnswered = async (entry: PrayerJournalEntry) => {
    const updated = await updateJournalEntry(entry.id, {
      is_answered: !entry.is_answered,
      ...(entry.is_answered ? {} : { answer_notes: entry.answer_notes ?? '' }),
    });
    setJournalEntries((prev) => prev.map((e) => (e.id === entry.id ? updated : e)));
  };

  return {
    user,
    dreams,
    journalEntries,
    stats,
    loading,
    error,
    setError,
    logout,
    addDream,
    toggleDreamFavorite,
    toggleDreamArchive,
    removeDream,
    addJournalEntry,
    toggleAnswered,
  };
}

export type DreamscourtWorkspace = ReturnType<typeof useDreamscourtWorkspace>;
