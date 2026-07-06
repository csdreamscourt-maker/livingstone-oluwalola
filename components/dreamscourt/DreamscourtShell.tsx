'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { fetchCurrentUser, logout } from '@/lib/api/auth';
import { createDream, deleteDream, fetchDreams, updateDream } from '@/lib/api/dreams';
import { createJournalEntry, fetchJournalEntries, updateJournalEntry } from '@/lib/api/journal';
import { Skeleton, Alert } from '@/components/ui';
import type { Dream, PrayerJournalEntry, User } from '@/types/database';
import {
  Archive,
  BookOpen,
  Brain,
  Compass,
  Flame,
  Heart,
  Lightbulb,
  LogOut,
  MoonStar,
  PenTool,
  Search,
  Settings,
  Sparkles,
  Star,
  LayoutDashboard,
} from 'lucide-react';

type View = 'overview' | 'journal' | 'dreams' | 'insights' | 'settings';

interface DreamscourtShellProps {
  initialView?: View;
}

const navItems: Array<{ key: View; label: string; icon: typeof LayoutDashboard }> = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'journal', label: 'Journal', icon: PenTool },
  { key: 'dreams', label: 'Dreams', icon: Brain },
  { key: 'insights', label: 'Insights', icon: Lightbulb },
  { key: 'settings', label: 'Settings', icon: Settings },
];

const PRAYER_TYPES = ['intercession', 'thanksgiving', 'petition', 'praise', 'confession'];

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

export function DreamscourtShell({ initialView = 'overview' }: DreamscourtShellProps) {
  const router = useRouter();
  const [view, setView] = useState<View>(initialView);
  const [user, setUser] = useState<User | null>(null);
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [journalEntries, setJournalEntries] = useState<PrayerJournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [draft, setDraft] = useState('');
  const [journalTitle, setJournalTitle] = useState('');
  const [journalContent, setJournalContent] = useState('');
  const [journalType, setJournalType] = useState(PRAYER_TYPES[0]);
  const [query, setQuery] = useState('');

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

  const filteredDreams = useMemo(() => {
    const safe = query.trim().toLowerCase();
    if (!safe) return dreams;
    return dreams.filter((dream) => `${dream.title} ${dream.description ?? ''}`.toLowerCase().includes(safe));
  }, [dreams, query]);

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  const handleQuickCapture = async () => {
    if (!draft.trim()) return;
    try {
      const dream = await createDream({
        title: 'Morning capture',
        description: draft.trim(),
        date_occurred: new Date().toISOString(),
        tags: ['quick-capture'],
      });
      setDreams((prev) => [dream, ...prev]);
      setDraft('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save the dream');
    }
  };

  const handleJournalSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!journalTitle.trim() || !journalContent.trim()) return;
    try {
      const entry = await createJournalEntry({
        title: journalTitle.trim(),
        content: journalContent.trim(),
        prayer_type: journalType,
        date_prayed: new Date().toISOString(),
      });
      setJournalEntries((prev) => [entry, ...prev]);
      setJournalTitle('');
      setJournalContent('');
      setJournalType(PRAYER_TYPES[0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save the journal entry');
    }
  };

  const toggleDreamFavorite = async (dream: Dream) => {
    try {
      const updated = await updateDream(dream.id, { favorite: !dream.favorite });
      setDreams((prev) => prev.map((d) => (d.id === dream.id ? updated : d)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update the dream');
    }
  };

  const toggleDreamArchive = async (dream: Dream) => {
    try {
      const updated = await updateDream(dream.id, { is_archived: !dream.is_archived });
      setDreams((prev) => prev.map((d) => (d.id === dream.id ? updated : d)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update the dream');
    }
  };

  const toggleAnswered = async (entry: PrayerJournalEntry) => {
    try {
      const updated = await updateJournalEntry(entry.id, {
        is_answered: !entry.is_answered,
        ...(entry.is_answered ? {} : { answer_notes: entry.answer_notes ?? '' }),
      });
      setJournalEntries((prev) => prev.map((e) => (e.id === entry.id ? updated : e)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update the entry');
    }
  };

  const removeDream = async (id: string) => {
    try {
      await deleteDream(id);
      setDreams((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete the dream');
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-[0_20px_70px_-35px_rgba(15,23,42,0.22)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold-200 bg-gold-50 px-3 py-1 text-sm font-semibold text-gold-700">
              <Sparkles className="h-4 w-4" />
              Dreamscourt • operational view
            </div>
            <h1 className="text-3xl font-semibold tracking-[-0.02em] text-midnight-950 sm:text-4xl">Welcome back, {user?.full_name || user?.email || 'Friend'}</h1>
            <p className="mt-3 max-w-2xl text-base leading-8 text-gray-700">A full-screen sanctuary for capturing dreams, reflecting on patterns, and seeing your inner world with more clarity.</p>
          </div>
          <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-midnight-950 transition hover:border-indigo-200 hover:text-indigo-700">
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] border border-gray-200 bg-white p-7 shadow-[0_16px_50px_-30px_rgba(15,23,42,0.18)]">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-gold-50 p-3 text-gold-700">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold-700">Quick capture</p>
              <p className="text-sm text-gray-600">Capture the dream while it is fresh.</p>
            </div>
          </div>
          <textarea value={draft} onChange={(event) => setDraft(event.target.value)} className="mt-5 min-h-[140px] w-full rounded-[1.4rem] border border-gray-200 bg-[#f8f8fc] px-4 py-3 text-sm text-midnight-950 outline-none placeholder:text-gray-500" placeholder="I dreamt that..." />
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">Saved to your account.</p>
            <button onClick={handleQuickCapture} className="rounded-2xl bg-gold-600 px-4 py-2.5 text-sm font-semibold text-midnight-950">Save dream</button>
          </div>
        </section>

        <section className="rounded-[2rem] border border-gray-200 bg-white p-7 shadow-[0_16px_50px_-30px_rgba(15,23,42,0.18)]">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-700">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-700">Current streak</p>
              <p className="text-sm text-gray-600">Consecutive days with a dream or journal entry.</p>
            </div>
          </div>
          <p className="mt-6 text-5xl font-semibold text-midnight-950">{stats.streak}<span className="ml-2 text-lg font-medium text-gray-500">day{stats.streak === 1 ? '' : 's'}</span></p>
        </section>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Dreams recorded', value: stats.dreamCount, icon: BookOpen },
          { label: 'Average clarity', value: stats.averageClarity ? `${stats.averageClarity}/5` : '—', icon: Sparkles },
          { label: 'Favorite dreams', value: stats.favoriteCount, icon: Heart },
          { label: 'Answered prayers', value: stats.answeredCount, icon: Lightbulb },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-[1.6rem] border border-gray-200 bg-white p-5 shadow-[0_10px_35px_-24px_rgba(15,23,42,0.2)]">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-700">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-midnight-950">{item.value}</p>
                  <p className="text-sm text-gray-600">{item.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <section className="rounded-[2rem] border border-gray-200 bg-white p-7 shadow-[0_16px_50px_-30px_rgba(15,23,42,0.18)]">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold-700">Recent dreams</p>
            <h2 className="text-2xl font-semibold text-midnight-950">Your dream timeline</h2>
          </div>
          <button onClick={() => setView('dreams')} className="text-sm font-semibold text-indigo-700">Open archive</button>
        </div>
        <div className="space-y-3">
          {dreams.length === 0 && <p className="text-sm text-gray-600">No dreams recorded yet — capture your first one above.</p>}
          {dreams.slice(0, 4).map((dream) => (
            <div key={dream.id} className="rounded-[1.4rem] border border-gray-200 bg-[#f8f8fc] px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-midnight-950">{dream.title}</p>
                  <p className="text-sm text-gray-600">{new Date(dream.date_occurred).toLocaleDateString()}</p>
                </div>
                {dream.mood && <span className="text-sm capitalize text-gold-700">{dream.mood}</span>}
              </div>
              {dream.description && <p className="mt-2 text-sm leading-7 text-gray-700">{dream.description}</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderJournal = () => (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <section className="rounded-[2rem] border border-gray-200 bg-white p-7 shadow-[0_16px_50px_-30px_rgba(15,23,42,0.18)]">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl bg-gold-50 p-3 text-gold-700">
            <PenTool className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold-700">Prayer journal</p>
            <h2 className="text-2xl font-semibold text-midnight-950">Write before it fades</h2>
          </div>
        </div>
        <form className="space-y-4" onSubmit={handleJournalSubmit}>
          <input value={journalTitle} onChange={(event) => setJournalTitle(event.target.value)} className="w-full rounded-[1.2rem] border border-gray-200 bg-[#f8f8fc] px-4 py-3 text-sm text-midnight-950 outline-none placeholder:text-gray-500" placeholder="Entry title" />
          <textarea value={journalContent} onChange={(event) => setJournalContent(event.target.value)} className="min-h-[160px] w-full rounded-[1.2rem] border border-gray-200 bg-[#f8f8fc] px-4 py-3 text-sm text-midnight-950 outline-none placeholder:text-gray-500" placeholder="What are you praying about?" />
          <select value={journalType} onChange={(event) => setJournalType(event.target.value)} className="w-full rounded-[1.2rem] border border-gray-200 bg-[#f8f8fc] px-4 py-3 text-sm capitalize text-midnight-950 outline-none">
            {PRAYER_TYPES.map((type) => (
              <option key={type} value={type} className="capitalize">{type}</option>
            ))}
          </select>
          <button className="rounded-2xl bg-gold-600 px-4 py-2.5 text-sm font-semibold text-midnight-950">Save entry</button>
        </form>
      </section>

      <section className="rounded-[2rem] border border-gray-200 bg-white p-7 shadow-[0_16px_50px_-30px_rgba(15,23,42,0.18)]">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold-700">Recent entries</p>
            <h2 className="text-2xl font-semibold text-midnight-950">Your reflection stream</h2>
          </div>
        </div>
        <div className="space-y-3">
          {journalEntries.length === 0 && <p className="text-sm text-gray-600">No entries yet.</p>}
          {journalEntries.map((entry) => (
            <div key={entry.id} className="rounded-[1.4rem] border border-gray-200 bg-[#f8f8fc] px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-midnight-950">{entry.title}</p>
                  <p className="text-sm text-gray-600">{new Date(entry.date_prayed).toLocaleDateString()}</p>
                </div>
                <button onClick={() => toggleAnswered(entry)} className={`rounded-full px-3 py-1 text-xs font-semibold ${entry.is_answered ? 'bg-emerald-100 text-emerald-700' : 'bg-white text-gray-500 border border-gray-200'}`}>
                  {entry.is_answered ? 'Answered' : 'Mark answered'}
                </button>
              </div>
              <p className="mt-2 text-sm leading-7 text-gray-700">{entry.content}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderDreams = () => (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-[2rem] border border-gray-200 bg-white p-7 shadow-[0_16px_50px_-30px_rgba(15,23,42,0.18)]">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-700">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-700">Archive</p>
            <h2 className="text-2xl font-semibold text-midnight-950">A private library of dream memory</h2>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-[1.2rem] border border-gray-200 bg-[#f8f8fc] px-3 py-3">
          <Search className="h-4 w-4 text-gray-500" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent text-sm text-midnight-950 outline-none placeholder:text-gray-500" placeholder="Search dreams" />
        </div>
        <div className="mt-6 space-y-3">
          {filteredDreams.length === 0 && <p className="text-sm text-gray-600">No dreams match yet.</p>}
          {filteredDreams.map((dream) => (
            <div key={dream.id} className="rounded-[1.4rem] border border-gray-200 bg-[#f8f8fc] px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-midnight-950">{dream.title}</p>
                  <p className="text-sm text-gray-600">{new Date(dream.date_occurred).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleDreamFavorite(dream)} className={`rounded-full p-2 ${dream.favorite ? 'bg-gold-100 text-gold-700' : 'bg-white text-gray-500'}`}>
                    <Star className="h-4 w-4" />
                  </button>
                  <button onClick={() => toggleDreamArchive(dream)} className={`rounded-full p-2 ${dream.is_archived ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-gray-500'}`}>
                    <Archive className="h-4 w-4" />
                  </button>
                  <button onClick={() => removeDream(dream.id)} className="rounded-full p-2 bg-white text-gray-400 hover:text-red-600">
                    ×
                  </button>
                </div>
              </div>
              {dream.description && <p className="mt-2 text-sm leading-7 text-gray-700">{dream.description}</p>}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-gray-200 bg-white p-7 shadow-[0_16px_50px_-30px_rgba(15,23,42,0.18)]">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl bg-gold-50 p-3 text-gold-700">
            <MoonStar className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold-700">Patterns</p>
            <h2 className="text-2xl font-semibold text-midnight-950">Recurring signals across your dreams</h2>
          </div>
        </div>
        <div className="rounded-[1.6rem] border border-gray-200 bg-[#f8f8fc] p-6">
          {stats.recurringThemes.length ? stats.recurringThemes.map((theme) => (
            <div key={theme} className="mb-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">{theme}</div>
          )) : <p className="text-sm text-gray-600">No patterns yet — begin journaling to grow this view.</p>}
        </div>
      </section>
    </div>
  );

  const renderInsights = () => {
    const moodEntries = Object.entries(stats.moods).sort((a, b) => b[1] - a[1]);
    return (
      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-[2rem] border border-gray-200 bg-white p-7 shadow-[0_16px_50px_-30px_rgba(15,23,42,0.18)]">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-gold-50 p-3 text-gold-700"><Sparkles className="h-5 w-5" /></div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold-700">Overview</p>
              <p className="text-sm text-gray-600">From your recorded dreams</p>
            </div>
          </div>
          <p className="mt-5 text-lg font-serif font-semibold text-midnight-950">{stats.dreamCount} dream{stats.dreamCount === 1 ? '' : 's'} recorded, average clarity {stats.averageClarity || '—'}/5.</p>
          <p className="mt-3 text-sm text-gray-600">Current streak: {stats.streak} day{stats.streak === 1 ? '' : 's'}.</p>
        </section>

        <section className="rounded-[2rem] border border-gray-200 bg-white p-7 shadow-[0_16px_50px_-30px_rgba(15,23,42,0.18)]">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-700"><Compass className="h-5 w-5" /></div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-700">Mood frequency</p>
              <p className="text-sm text-gray-600">Across your dream log</p>
            </div>
          </div>
          <div className="mt-5 space-y-2">
            {moodEntries.length === 0 && <p className="text-sm text-gray-600">No moods logged yet.</p>}
            {moodEntries.map(([mood, count]) => (
              <div key={mood} className="flex items-center justify-between rounded-xl bg-[#f8f8fc] px-4 py-2 text-sm">
                <span className="capitalize text-midnight-950">{mood}</span>
                <span className="text-gray-600">{count}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-gray-200 bg-white p-7 shadow-[0_16px_50px_-30px_rgba(15,23,42,0.18)]">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-gold-50 p-3 text-gold-700"><Lightbulb className="h-5 w-5" /></div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold-700">Recurring themes</p>
              <p className="text-sm text-gray-600">Tags across your dreams</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {stats.recurringThemes.length === 0 && <p className="text-sm text-gray-600">No themes yet.</p>}
            {stats.recurringThemes.map((theme) => (
              <span key={theme} className="rounded-full bg-midnight-950/5 px-3 py-1 text-sm text-midnight-700">{theme}</span>
            ))}
          </div>
        </section>
      </div>
    );
  };

  const renderSettings = () => (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-[2rem] border border-gray-200 bg-white p-7 shadow-[0_16px_50px_-30px_rgba(15,23,42,0.18)]">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-gold-50 p-3 text-gold-700">
            <Settings className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold-700">Account</p>
            <h2 className="text-2xl font-semibold text-midnight-950">Your Dreamscourt profile</h2>
          </div>
        </div>
        <div className="mt-6 space-y-3 text-sm text-gray-700">
          <div className="rounded-[1.2rem] border border-gray-200 bg-[#f8f8fc] px-4 py-3"><span className="font-semibold text-midnight-950">Name: </span>{user?.full_name || '—'}</div>
          <div className="rounded-[1.2rem] border border-gray-200 bg-[#f8f8fc] px-4 py-3"><span className="font-semibold text-midnight-950">Email: </span>{user?.email}</div>
          <div className="rounded-[1.2rem] border border-gray-200 bg-[#f8f8fc] px-4 py-3"><span className="font-semibold text-midnight-950">Member since: </span>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}</div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-gray-200 bg-white p-7 shadow-[0_16px_50px_-30px_rgba(15,23,42,0.18)]">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold-700">Summary</p>
        <h2 className="mt-2 text-2xl font-semibold text-midnight-950">Your practice so far</h2>
        <div className="mt-6 space-y-3 text-sm text-gray-700">
          <div className="rounded-[1.2rem] border border-gray-200 bg-[#f8f8fc] px-4 py-3">{stats.dreamCount} dream{stats.dreamCount === 1 ? '' : 's'} recorded</div>
          <div className="rounded-[1.2rem] border border-gray-200 bg-[#f8f8fc] px-4 py-3">{journalEntries.length} journal entr{journalEntries.length === 1 ? 'y' : 'ies'}</div>
          <div className="rounded-[1.2rem] border border-gray-200 bg-[#f8f8fc] px-4 py-3">{stats.answeredCount} answered prayer{stats.answeredCount === 1 ? '' : 's'}</div>
        </div>
      </section>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f8fc] p-10">
        <div className="mx-auto max-w-4xl space-y-6">
          <Skeleton variant="card" />
          <Skeleton count={3} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-midnight-950">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full border-b border-gray-200 bg-white p-6 lg:w-72 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-50 text-gold-700">
              <MoonStar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-500">Dreamscourt</p>
              <p className="text-sm font-semibold text-midnight-950">Private operating system</p>
            </div>
          </div>

          <nav className="mt-8 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.key} onClick={() => setView(item.key)} className={`flex w-full items-center gap-3 rounded-[1.2rem] px-3 py-3 text-sm font-medium transition ${view === item.key ? 'bg-gold-50 text-gold-700' : 'text-gray-700 hover:bg-[#f8f8fc] hover:text-midnight-950'}`}>
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-8 rounded-[1.4rem] border border-gray-200 bg-[#f8f8fc] p-4 text-sm text-gray-700">
            <p className="font-semibold text-midnight-950">Full-screen by design</p>
            <p className="mt-2 leading-7 text-gray-600">Every layer lives inside Dreamscourt so you remain in one immersive space.</p>
          </div>
        </aside>

        <main className="flex-1 bg-[#f7f8fc] p-6 md:p-8 lg:p-10">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold-700">Dreamscourt workspace</p>
              <h2 className="text-2xl font-semibold text-midnight-950">{navItems.find((item) => item.key === view)?.label}</h2>
            </div>
            <div className="rounded-[1.2rem] border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
              {user?.email || 'Signed in'}
            </div>
          </div>

          {error && (
            <div className="mb-6">
              <Alert type="error" onClose={() => setError(null)}>{error}</Alert>
            </div>
          )}

          {view === 'overview' && renderOverview()}
          {view === 'journal' && renderJournal()}
          {view === 'dreams' && renderDreams()}
          {view === 'insights' && renderInsights()}
          {view === 'settings' && renderSettings()}
        </main>
      </div>
    </div>
  );
}
