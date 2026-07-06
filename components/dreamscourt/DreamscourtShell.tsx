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

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
      <span className="h-[5px] w-[5px] rounded-full bg-gold-600" />
      {children}
    </span>
  );
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
    <div className="space-y-5">
      <section className="rounded-lg border border-midnight-950/10 bg-white p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Eyebrow>Dreamscourt · operational view</Eyebrow>
            <h1 className="mt-3 text-2xl font-semibold tracking-[-0.015em] text-midnight-950 sm:text-3xl">Welcome back, {user?.full_name || user?.email || 'Friend'}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">A full-screen sanctuary for capturing dreams, reflecting on patterns, and seeing your inner world with more clarity.</p>
          </div>
          <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-md border border-midnight-950/15 bg-white px-4 py-2.5 text-sm font-semibold text-midnight-950 transition-colors duration-200 hover:border-midnight-950/30">
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-lg border border-midnight-950/10 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-md border border-midnight-950/10 p-2.5 text-gold-600">
              <Compass className="h-4 w-4" />
            </div>
            <Eyebrow>Quick capture</Eyebrow>
          </div>
          <textarea value={draft} onChange={(event) => setDraft(event.target.value)} className="mt-4 min-h-[140px] w-full rounded-md border border-midnight-950/10 bg-gray-50 px-4 py-3 text-sm text-midnight-950 outline-none placeholder:text-gray-500 focus:border-gold-500" placeholder="I dreamt that..." />
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-gray-500">Saved to your account.</p>
            <button onClick={handleQuickCapture} className="rounded-md bg-gold-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-gold-700">Save dream</button>
          </div>
        </section>

        <section className="rounded-lg border border-midnight-950/10 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-md border border-midnight-950/10 p-2.5 text-midnight-700">
              <Flame className="h-4 w-4" />
            </div>
            <Eyebrow>Current streak</Eyebrow>
          </div>
          <p className="mt-5 font-mono text-3xl font-semibold tabular-nums text-midnight-950">{stats.streak}<span className="ml-2 font-sans text-sm font-medium text-gray-500">day{stats.streak === 1 ? '' : 's'}</span></p>
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
            <div key={item.label} className="rounded-lg border border-midnight-950/10 bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-md border border-midnight-950/10 p-2.5 text-midnight-700">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-mono text-xl font-semibold tabular-nums text-midnight-950">{item.value}</p>
                  <p className="text-xs text-gray-500">{item.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <section className="rounded-lg border border-midnight-950/10 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <Eyebrow>Recent dreams</Eyebrow>
            <h2 className="mt-2 text-lg font-semibold text-midnight-950">Your dream timeline</h2>
          </div>
          <button onClick={() => setView('dreams')} className="text-sm font-semibold text-gray-600 transition-colors duration-200 hover:text-midnight-950">Open archive</button>
        </div>
        <div className="space-y-2">
          {dreams.length === 0 && <p className="text-sm text-gray-600">No dreams recorded yet — capture your first one above.</p>}
          {dreams.slice(0, 4).map((dream) => (
            <div key={dream.id} className="rounded-md border border-midnight-950/8 bg-gray-50 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-midnight-950">{dream.title}</p>
                  <p className="text-xs text-gray-500">{new Date(dream.date_occurred).toLocaleDateString()}</p>
                </div>
                {dream.mood && <span className="text-xs capitalize text-gold-700">{dream.mood}</span>}
              </div>
              {dream.description && <p className="mt-2 text-sm leading-6 text-gray-600">{dream.description}</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderJournal = () => (
    <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
      <section className="rounded-lg border border-midnight-950/10 bg-white p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-md border border-midnight-950/10 p-2.5 text-gold-600">
            <PenTool className="h-4 w-4" />
          </div>
          <div>
            <Eyebrow>Prayer journal</Eyebrow>
            <h2 className="mt-1 text-lg font-semibold text-midnight-950">Write before it fades</h2>
          </div>
        </div>
        <form className="space-y-3" onSubmit={handleJournalSubmit}>
          <input value={journalTitle} onChange={(event) => setJournalTitle(event.target.value)} className="w-full rounded-md border border-midnight-950/10 bg-gray-50 px-4 py-2.5 text-sm text-midnight-950 outline-none placeholder:text-gray-500 focus:border-gold-500" placeholder="Entry title" />
          <textarea value={journalContent} onChange={(event) => setJournalContent(event.target.value)} className="min-h-[160px] w-full rounded-md border border-midnight-950/10 bg-gray-50 px-4 py-2.5 text-sm text-midnight-950 outline-none placeholder:text-gray-500 focus:border-gold-500" placeholder="What are you praying about?" />
          <select value={journalType} onChange={(event) => setJournalType(event.target.value)} className="w-full rounded-md border border-midnight-950/10 bg-gray-50 px-4 py-2.5 text-sm capitalize text-midnight-950 outline-none focus:border-gold-500">
            {PRAYER_TYPES.map((type) => (
              <option key={type} value={type} className="capitalize">{type}</option>
            ))}
          </select>
          <button className="rounded-md bg-gold-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-gold-700">Save entry</button>
        </form>
      </section>

      <section className="rounded-lg border border-midnight-950/10 bg-white p-6">
        <div className="mb-4">
          <Eyebrow>Recent entries</Eyebrow>
          <h2 className="mt-2 text-lg font-semibold text-midnight-950">Your reflection stream</h2>
        </div>
        <div className="space-y-2">
          {journalEntries.length === 0 && <p className="text-sm text-gray-600">No entries yet.</p>}
          {journalEntries.map((entry) => (
            <div key={entry.id} className="rounded-md border border-midnight-950/8 bg-gray-50 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-midnight-950">{entry.title}</p>
                  <p className="text-xs text-gray-500">{new Date(entry.date_prayed).toLocaleDateString()}</p>
                </div>
                <button onClick={() => toggleAnswered(entry)} className={`rounded-full px-3 py-1 text-xs font-semibold ${entry.is_answered ? 'bg-emerald-100 text-emerald-700' : 'border border-midnight-950/15 text-gray-500'}`}>
                  {entry.is_answered ? 'Answered' : 'Mark answered'}
                </button>
              </div>
              <p className="mt-2 text-sm leading-6 text-gray-600">{entry.content}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderDreams = () => (
    <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-lg border border-midnight-950/10 bg-white p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-md border border-midnight-950/10 p-2.5 text-midnight-700">
            <Brain className="h-4 w-4" />
          </div>
          <div>
            <Eyebrow>Archive</Eyebrow>
            <h2 className="mt-1 text-lg font-semibold text-midnight-950">A private library of dream memory</h2>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-md border border-midnight-950/10 bg-gray-50 px-3 py-2.5">
          <Search className="h-4 w-4 text-gray-500" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent text-sm text-midnight-950 outline-none placeholder:text-gray-500" placeholder="Search dreams" />
        </div>
        <div className="mt-5 space-y-2">
          {filteredDreams.length === 0 && <p className="text-sm text-gray-600">No dreams match yet.</p>}
          {filteredDreams.map((dream) => (
            <div key={dream.id} className="rounded-md border border-midnight-950/8 bg-gray-50 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-midnight-950">{dream.title}</p>
                  <p className="text-xs text-gray-500">{new Date(dream.date_occurred).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => toggleDreamFavorite(dream)} className={`rounded-full p-2 transition-colors duration-200 ${dream.favorite ? 'bg-gold-100 text-gold-700' : 'text-gray-400 hover:text-gold-600'}`}>
                    <Star className="h-4 w-4" />
                  </button>
                  <button onClick={() => toggleDreamArchive(dream)} className={`rounded-full p-2 transition-colors duration-200 ${dream.is_archived ? 'bg-midnight-950/8 text-midnight-700' : 'text-gray-400 hover:text-midnight-700'}`}>
                    <Archive className="h-4 w-4" />
                  </button>
                  <button onClick={() => removeDream(dream.id)} className="rounded-full p-2 text-gray-400 transition-colors duration-200 hover:text-red-600">
                    ×
                  </button>
                </div>
              </div>
              {dream.description && <p className="mt-2 text-sm leading-6 text-gray-600">{dream.description}</p>}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-midnight-950/10 bg-white p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-md border border-midnight-950/10 p-2.5 text-gold-600">
            <MoonStar className="h-4 w-4" />
          </div>
          <div>
            <Eyebrow>Patterns</Eyebrow>
            <h2 className="mt-1 text-lg font-semibold text-midnight-950">Recurring signals across your dreams</h2>
          </div>
        </div>
        <div className="rounded-md border border-midnight-950/8 bg-gray-50 p-5">
          {stats.recurringThemes.length ? stats.recurringThemes.map((theme) => (
            <div key={theme} className="mb-2 rounded-md border border-midnight-950/8 bg-white px-4 py-2.5 text-sm text-gray-600 last:mb-0">{theme}</div>
          )) : <p className="text-sm text-gray-600">No patterns yet — begin journaling to grow this view.</p>}
        </div>
      </section>
    </div>
  );

  const renderInsights = () => {
    const moodEntries = Object.entries(stats.moods).sort((a, b) => b[1] - a[1]);
    return (
      <div className="grid gap-5 xl:grid-cols-3">
        <section className="rounded-lg border border-midnight-950/10 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-md border border-midnight-950/10 p-2.5 text-gold-600"><Sparkles className="h-4 w-4" /></div>
            <Eyebrow>Overview</Eyebrow>
          </div>
          <p className="mt-4 text-[15px] font-semibold leading-6 text-midnight-950">{stats.dreamCount} dream{stats.dreamCount === 1 ? '' : 's'} recorded, average clarity {stats.averageClarity || '—'}/5.</p>
          <p className="mt-2 text-sm text-gray-600">Current streak: <span className="font-mono tabular-nums">{stats.streak}</span> day{stats.streak === 1 ? '' : 's'}.</p>
        </section>

        <section className="rounded-lg border border-midnight-950/10 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-md border border-midnight-950/10 p-2.5 text-midnight-700"><Compass className="h-4 w-4" /></div>
            <Eyebrow>Mood frequency</Eyebrow>
          </div>
          <div className="mt-4 space-y-2">
            {moodEntries.length === 0 && <p className="text-sm text-gray-600">No moods logged yet.</p>}
            {moodEntries.map(([mood, count]) => (
              <div key={mood} className="flex items-center justify-between rounded-md bg-gray-50 px-4 py-2 text-sm">
                <span className="capitalize text-midnight-950">{mood}</span>
                <span className="font-mono tabular-nums text-gray-600">{count}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-midnight-950/10 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-md border border-midnight-950/10 p-2.5 text-gold-600"><Lightbulb className="h-4 w-4" /></div>
            <Eyebrow>Recurring themes</Eyebrow>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {stats.recurringThemes.length === 0 && <p className="text-sm text-gray-600">No themes yet.</p>}
            {stats.recurringThemes.map((theme) => (
              <span key={theme} className="rounded-full border border-midnight-950/10 px-3 py-1 text-sm text-midnight-700">{theme}</span>
            ))}
          </div>
        </section>
      </div>
    );
  };

  const renderSettings = () => (
    <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-lg border border-midnight-950/10 bg-white p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-md border border-midnight-950/10 p-2.5 text-gold-600">
            <Settings className="h-4 w-4" />
          </div>
          <div>
            <Eyebrow>Account</Eyebrow>
            <h2 className="mt-1 text-lg font-semibold text-midnight-950">Your Dreamscourt profile</h2>
          </div>
        </div>
        <div className="mt-5 space-y-2 text-sm text-gray-600">
          <div className="rounded-md border border-midnight-950/8 bg-gray-50 px-4 py-2.5"><span className="font-semibold text-midnight-950">Name: </span>{user?.full_name || '—'}</div>
          <div className="rounded-md border border-midnight-950/8 bg-gray-50 px-4 py-2.5"><span className="font-semibold text-midnight-950">Email: </span>{user?.email}</div>
          <div className="rounded-md border border-midnight-950/8 bg-gray-50 px-4 py-2.5"><span className="font-semibold text-midnight-950">Member since: </span>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}</div>
        </div>
      </section>

      <section className="rounded-lg border border-midnight-950/10 bg-white p-6">
        <Eyebrow>Summary</Eyebrow>
        <h2 className="mt-2 text-lg font-semibold text-midnight-950">Your practice so far</h2>
        <div className="mt-5 space-y-2 text-sm text-gray-600">
          <div className="rounded-md border border-midnight-950/8 bg-gray-50 px-4 py-2.5">{stats.dreamCount} dream{stats.dreamCount === 1 ? '' : 's'} recorded</div>
          <div className="rounded-md border border-midnight-950/8 bg-gray-50 px-4 py-2.5">{journalEntries.length} journal entr{journalEntries.length === 1 ? 'y' : 'ies'}</div>
          <div className="rounded-md border border-midnight-950/8 bg-gray-50 px-4 py-2.5">{stats.answeredCount} answered prayer{stats.answeredCount === 1 ? '' : 's'}</div>
        </div>
      </section>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-paper p-10">
        <div className="mx-auto max-w-4xl space-y-6">
          <Skeleton variant="card" />
          <Skeleton count={3} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper text-midnight-950">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full border-b border-midnight-950/8 bg-white p-6 lg:w-64 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-[22px] w-[22px] items-center justify-center rounded-[4px] border-[1.4px] border-midnight-950">
              <MoonStar className="h-3 w-3 text-gold-600" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">Dreamscourt</p>
              <p className="text-sm font-semibold text-midnight-950">Private workspace</p>
            </div>
          </div>

          <nav className="mt-8 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.key} onClick={() => setView(item.key)} className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${view === item.key ? 'bg-gold-600/10 text-gold-700' : 'text-gray-600 hover:bg-gray-50 hover:text-midnight-950'}`}>
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-8 rounded-md border border-midnight-950/8 bg-gray-50 p-4 text-sm text-gray-600">
            <p className="font-semibold text-midnight-950">Full-screen by design</p>
            <p className="mt-2 leading-6 text-gray-600">Every layer lives inside Dreamscourt so you remain in one immersive space.</p>
          </div>
        </aside>

        <main className="flex-1 bg-paper p-6 md:p-8 lg:p-10">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Eyebrow>Dreamscourt workspace</Eyebrow>
              <h2 className="mt-2 text-xl font-semibold text-midnight-950">{navItems.find((item) => item.key === view)?.label}</h2>
            </div>
            <div className="rounded-md border border-midnight-950/10 bg-white px-4 py-2.5 text-sm text-gray-600">
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
