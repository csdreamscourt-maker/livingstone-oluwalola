'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { addDreamEntry, getDreamEntries, getDreamStats, toggleArchive, updateDreamEntry } from '@/lib/dreams';
import { getCurrentSession, signOutUser } from '@/lib/auth';
import type { User } from '@/types/database';
import {
  Archive,
  BookOpen,
  Brain,
  Compass,
  Heart,
  Lightbulb,
  LogOut,
  MoonStar,
  PenTool,
  Search,
  Settings,
  Sparkles,
  Star,
  Sunrise,
  LayoutDashboard,
} from 'lucide-react';

type View = 'overview' | 'journal' | 'dreams' | 'settings';

interface DreamscourtShellProps {
  initialView?: View;
}

const navItems: Array<{ key: View; label: string; icon: typeof LayoutDashboard }> = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'journal', label: 'Journal', icon: PenTool },
  { key: 'dreams', label: 'Dreams', icon: Brain },
  { key: 'settings', label: 'Settings', icon: Settings },
];

export function DreamscourtShell({ initialView = 'overview' }: DreamscourtShellProps) {
  const router = useRouter();
  const [view, setView] = useState<View>(initialView);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [dreams, setDreams] = useState(getDreamEntries());
  const [draft, setDraft] = useState('');
  const [journalTitle, setJournalTitle] = useState('');
  const [journalDescription, setJournalDescription] = useState('');
  const [journalMood, setJournalMood] = useState('reflective');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const session = getCurrentSession();
    if (!session) {
      router.replace('/auth/login');
      setLoading(false);
      return;
    }

    setUser({
      id: session.userId,
      email: session.email,
      full_name: session.fullName,
      created_at: session.createdAt,
      updated_at: session.createdAt,
    });
    setLoading(false);
  }, [router]);

  const stats = useMemo(() => getDreamStats(dreams), [dreams]);
  const filteredDreams = useMemo(() => {
    const safe = query.trim().toLowerCase();
    if (!safe) return dreams;
    return dreams.filter((dream) => `${dream.title} ${dream.description}`.toLowerCase().includes(safe));
  }, [dreams, query]);

  const handleLogout = () => {
    signOutUser();
    router.push('/auth/login');
  };

  const handleQuickCapture = () => {
    if (!draft.trim()) return;
    addDreamEntry({
      title: 'Morning Capture',
      description: draft,
      date: new Date().toISOString(),
      clarity: 3,
      mood: 'reflective',
      category: 'capture',
      tags: ['quick-capture'],
      people: [],
      locations: [],
      symbols: [],
      personalNotes: '',
      possibleMeaning: '',
      spiritualReflection: '',
      lessonsLearned: '',
      actionPoints: [],
    });
    setDreams(getDreamEntries());
    setDraft('');
  };

  const handleJournalSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!journalTitle.trim() || !journalDescription.trim()) return;
    addDreamEntry({
      title: journalTitle.trim(),
      description: journalDescription.trim(),
      date: new Date().toISOString(),
      clarity: 4,
      mood: journalMood,
      category: 'journal',
      tags: ['journal'],
      people: [],
      locations: [],
      symbols: [],
      personalNotes: '',
      possibleMeaning: '',
      spiritualReflection: '',
      lessonsLearned: '',
      actionPoints: [],
    });
    setDreams(getDreamEntries());
    setJournalTitle('');
    setJournalDescription('');
    setJournalMood('reflective');
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
            <h1 className="text-3xl font-semibold tracking-[-0.02em] text-midnight-950 sm:text-4xl">Welcome back, {user?.full_name || 'Friend'}</h1>
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
            <p className="text-sm text-gray-500">Stored locally for now.</p>
            <button onClick={handleQuickCapture} className="rounded-2xl bg-gold-600 px-4 py-2.5 text-sm font-semibold text-midnight-950">Save dream</button>
          </div>
        </section>

        <section className="rounded-[2rem] border border-gray-200 bg-white p-7 shadow-[0_16px_50px_-30px_rgba(15,23,42,0.18)]">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-700">
              <Sunrise className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-700">Today&apos;s focus</p>
              <p className="text-sm text-gray-600">A calm command center for meaning and ritual.</p>
            </div>
          </div>
          <div className="mt-6 space-y-3 text-sm text-gray-700">
            {['Private archive', 'Meaning prompts', 'Recurring themes'].map((item) => (
              <div key={item} className="rounded-2xl border border-gray-200 bg-[#f8f8fc] px-4 py-3">{item}</div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Dreams recorded', value: stats.dreamCount, icon: BookOpen },
          { label: 'Average clarity', value: `${stats.averageClarity}/5`, icon: Sparkles },
          { label: 'Favorite dreams', value: stats.favoriteCount, icon: Heart },
          { label: 'Themes', value: stats.recurringThemes.length, icon: Lightbulb },
        ].map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-[1.6rem] border border-gray-200 bg-white p-5 shadow-[0_10px_35px_-24px_rgba(15,23,42,0.2)]" style={{ animationDelay: `${index * 80}ms` }}>
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
          {dreams.slice(0, 4).map((dream) => (
            <div key={dream.id} className="rounded-[1.4rem] border border-gray-200 bg-[#f8f8fc] px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-midnight-950">{dream.title}</p>
                  <p className="text-sm text-gray-600">{new Date(dream.date).toLocaleDateString()}</p>
                </div>
                <span className="text-sm capitalize text-gold-700">{dream.mood}</span>
              </div>
              <p className="mt-2 text-sm leading-7 text-gray-700">{dream.description}</p>
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
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold-700">Journal</p>
            <h2 className="text-2xl font-semibold text-midnight-950">Write the dream before it fades</h2>
          </div>
        </div>
        <form className="space-y-4" onSubmit={handleJournalSubmit}>
          <input value={journalTitle} onChange={(event) => setJournalTitle(event.target.value)} className="w-full rounded-[1.2rem] border border-gray-200 bg-[#f8f8fc] px-4 py-3 text-sm text-midnight-950 outline-none placeholder:text-gray-500" placeholder="Dream title" />
          <textarea value={journalDescription} onChange={(event) => setJournalDescription(event.target.value)} className="min-h-[160px] w-full rounded-[1.2rem] border border-gray-200 bg-[#f8f8fc] px-4 py-3 text-sm text-midnight-950 outline-none placeholder:text-gray-500" placeholder="Describe the dream, the symbols and the feeling..." />
          <select value={journalMood} onChange={(event) => setJournalMood(event.target.value)} className="w-full rounded-[1.2rem] border border-gray-200 bg-[#f8f8fc] px-4 py-3 text-sm text-midnight-950 outline-none">
            <option value="reflective">Reflective</option>
            <option value="calm">Calm</option>
            <option value="intense">Intense</option>
            <option value="playful">Playful</option>
          </select>
          <button className="rounded-2xl bg-gold-600 px-4 py-2.5 text-sm font-semibold text-midnight-950">Save journal entry</button>
        </form>
      </section>

      <section className="rounded-[2rem] border border-gray-200 bg-white p-7 shadow-[0_16px_50px_-30px_rgba(15,23,42,0.18)]">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold-700">Recent entries</p>
            <h2 className="text-2xl font-semibold text-midnight-950">Your live reflection stream</h2>
          </div>
        </div>
        <div className="space-y-3">
          {dreams.map((dream) => (
            <div key={dream.id} className="rounded-[1.4rem] border border-gray-200 bg-[#f8f8fc] px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-midnight-950">{dream.title}</p>
                  <p className="text-sm text-gray-600">{new Date(dream.date).toLocaleDateString()}</p>
                </div>
                <span className="text-sm capitalize text-gold-700">{dream.mood}</span>
              </div>
              <p className="mt-2 text-sm leading-7 text-gray-700">{dream.description}</p>
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
          {filteredDreams.map((dream) => (
            <div key={dream.id} className="rounded-[1.4rem] border border-gray-200 bg-[#f8f8fc] px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-midnight-950">{dream.title}</p>
                  <p className="text-sm text-gray-600">{new Date(dream.date).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { updateDreamEntry({ ...dream, favorite: !dream.favorite }); setDreams(getDreamEntries()); }} className={`rounded-full p-2 ${dream.favorite ? 'bg-gold-100 text-gold-700' : 'bg-white text-gray-500'}`}>
                    <Star className="h-4 w-4" />
                  </button>
                  <button onClick={() => { toggleArchive(dream.id); setDreams(getDreamEntries()); }} className={`rounded-full p-2 ${dream.archived ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-gray-500'}`}>
                    <Archive className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="mt-2 text-sm leading-7 text-gray-700">{dream.description}</p>
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

  const renderSettings = () => (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-[2rem] border border-gray-200 bg-white p-7 shadow-[0_16px_50px_-30px_rgba(15,23,42,0.18)]">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-gold-50 p-3 text-gold-700">
            <Settings className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold-700">Workspace</p>
            <h2 className="text-2xl font-semibold text-midnight-950">A fuller Dreamscourt operating system</h2>
          </div>
        </div>
        <div className="mt-6 space-y-3 text-sm text-gray-700">
          {['Private archive', 'Reflection rituals', 'Cross-device continuity'].map((item) => (
            <div key={item} className="rounded-[1.2rem] border border-gray-200 bg-[#f8f8fc] px-4 py-3">{item}</div>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-gray-200 bg-white p-7 shadow-[0_16px_50px_-30px_rgba(15,23,42,0.18)]">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold-700">Roadmap</p>
        <h2 className="mt-2 text-2xl font-semibold text-midnight-950">The next layer is being built for you</h2>
        <div className="mt-6 rounded-[1.6rem] border border-gray-200 bg-[#f8f8fc] p-6 text-gray-700">
          <p className="text-lg leading-8">This will expand into deeper rituals, richer insights, and more resilient memory systems for your practice.</p>
        </div>
      </section>
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f8fc] text-midnight-950">
        <div className="rounded-[2rem] border border-gray-200 bg-white px-8 py-6 text-center shadow-[0_16px_50px_-30px_rgba(15,23,42,0.18)]">
          <p className="text-lg font-semibold">Preparing your Dreamscourt workspace…</p>
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
              <h2 className="text-2xl font-semibold text-midnight-950">{view === 'overview' ? 'Overview' : view === 'journal' ? 'Journal' : view === 'dreams' ? 'Dream archive' : 'Settings'}</h2>
            </div>
            <div className="rounded-[1.2rem] border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
              {user?.email || 'Signed in'}
            </div>
          </div>

          {view === 'overview' && renderOverview()}
          {view === 'journal' && renderJournal()}
          {view === 'dreams' && renderDreams()}
          {view === 'settings' && renderSettings()}
        </main>
      </div>
    </div>
  );
}
