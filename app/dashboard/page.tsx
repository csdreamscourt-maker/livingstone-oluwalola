'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Container, Section, Card, Button } from '@/components/ui';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Compass,
  Heart,
  Lightbulb,
  MoonStar,
  Sparkles,
  Sunrise,
  LogOut,
  LayoutDashboard,
  PenTool,
  Brain,
  Settings,
} from 'lucide-react';
import type { User } from '@/types/database';
import { addDreamEntry, getDreamEntries, getDreamStats } from '@/lib/dreams';
import { getCurrentSession, signOutUser } from '@/lib/auth';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [dreams, setDreams] = useState(getDreamEntries());
  const [draft, setDraft] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const session = getCurrentSession();
    if (!session) {
      router.push('/auth/login');
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
  const sidebarItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard, active: pathname === '/dashboard' },
    { label: 'Journal', href: '/journal', icon: PenTool, active: pathname === '/journal' },
    { label: 'Dreams', href: '/dreams', icon: Brain, active: pathname === '/dreams' },
    { label: 'Settings', href: '/settings', icon: Settings, active: pathname === '/settings' },
  ];

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

  if (loading) {
    return (
      <Section padding="2xl">
        <Container>
          <div className="py-32 text-center">
            <div className="inline-flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-gold-600" />
              <p className="text-lg text-gray-600">Preparing your Dreamscourt workspace...</p>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  if (!user) {
    return (
      <Section padding="2xl">
        <Container size="md">
          <div className="py-32 text-center">
            <h1 className="mb-6 font-serif text-4xl font-bold text-midnight-950 md:text-5xl">Welcome to Dreamscourt</h1>
            <p className="mb-10 text-lg leading-relaxed text-gray-600">Sign in to access your private sanctuary for dream journaling, reflection, and spiritual growth.</p>
            <a href="/auth/login" className="inline-flex items-center gap-2 rounded-lg bg-gold-600 px-8 py-4 font-semibold text-midnight-950 transition-all duration-300 hover:scale-105 hover:bg-gold-500 hover:shadow-lg hover:shadow-gold-500/50 active:scale-95">
              Sign in to continue
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1328] px-4 py-4 md:px-6 lg:px-8 lg:py-6">
      <Container>
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#f7f7fb] shadow-[0_24px_90px_-36px_rgba(15,23,42,0.35)]">
          <div className="grid min-h-[calc(100vh-3rem)] lg:grid-cols-[260px_1fr]">
            <aside className="border-b border-white/10 bg-[#0f1328] p-6 text-white lg:border-b-0 lg:border-r">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold-500/15 text-gold-300">
                  <MoonStar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/50">Dreamscourt</p>
                  <p className="text-sm font-semibold">Private workspace</p>
                </div>
              </div>

              <nav className="mt-8 space-y-2">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.label} href={item.href} className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-300 ${item.active ? 'bg-gold-500/15 text-gold-300' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-8 rounded-[1.4rem] border border-white/10 bg-white/10 p-4">
                <p className="text-sm font-semibold">Today’s focus</p>
                <p className="mt-2 text-sm leading-7 text-white/70">A calm space to interpret your dreams and track your recurring themes.</p>
              </div>
            </aside>

            <main className="p-6 md:p-8 lg:p-10">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold-200 bg-gold-50 px-3 py-1 text-sm font-semibold text-gold-700">
                    <Sparkles className="h-4 w-4" />
                    Dreamscourt • operational view
                  </div>
                  <h1 className="text-3xl font-semibold tracking-[-0.02em] text-midnight-950 sm:text-4xl">Welcome back, {user.full_name || 'Friend'}</h1>
                  <p className="mt-3 max-w-2xl text-base leading-8 text-gray-600">A structured sanctuary for journaling, reflection and noticing what matters most.</p>
                </div>
                <Button onClick={handleLogout} variant="secondary" className="self-start">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </div>

              <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <Card variant="dark" className="overflow-hidden border-gold-600/20 bg-[#0f1328]">
                  <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="mb-2 text-sm font-semibold uppercase tracking-[0.24em] text-gold-400">Daily reflection</p>
                      <h2 className="text-2xl font-semibold text-white">What wants your attention today?</h2>
                      <p className="mt-3 max-w-xl text-sm leading-7 text-gray-300">This is your calm command center for capturing dreams and returning to them with clarity.</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-gold-300">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <Sunrise className="h-4 w-4" />
                        Morning capture ready
                      </div>
                    </div>
                  </div>
                </Card>

                <Card variant="bordered" className="bg-white/90 backdrop-blur">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-2xl bg-gold-100 p-3 text-gold-700">
                      <Compass className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gold-700">Quick capture</p>
                      <p className="text-sm text-gray-600">Save a dream in seconds</p>
                    </div>
                  </div>
                  <textarea value={draft} onChange={(event) => setDraft(event.target.value)} className="min-h-[128px] w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-midnight-950 outline-none focus:border-gold-600" placeholder="I dreamt that..." />
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="text-xs text-gray-500">Stored locally for now.</p>
                    <Button onClick={handleQuickCapture} variant="gold" size="sm">Save dream</Button>
                  </div>
                </Card>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: 'Dreams recorded', value: stats.dreamCount, icon: BookOpen },
                  { label: 'Avg clarity', value: `${stats.averageClarity}/5`, icon: Sparkles },
                  { label: 'Favorite dreams', value: stats.favoriteCount, icon: Heart },
                  { label: 'Recurring themes', value: stats.recurringThemes.length, icon: Lightbulb },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div key={item.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                      <Card variant="bordered" className="h-full">
                        <div className="flex items-center gap-3">
                          <div className="rounded-2xl bg-gold-50 p-3 text-gold-700">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-2xl font-semibold tracking-[-0.02em] text-midnight-950">{item.value}</p>
                            <p className="text-sm text-gray-600">{item.label}</p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <Card variant="bordered" className="h-full">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gold-700">Recent dreams</p>
                      <h2 className="text-2xl font-semibold tracking-[-0.02em] text-midnight-950">Your dream timeline</h2>
                    </div>
                    <Link href="/dreams" className="text-sm font-semibold text-gold-700 hover:text-gold-800">Open library</Link>
                  </div>
                  <div className="space-y-3">
                    {dreams.slice(0, 4).map((dream) => (
                      <div key={dream.id} className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-midnight-950">{dream.title}</p>
                            <p className="text-sm text-gray-600">{new Date(dream.date).toLocaleDateString()}</p>
                          </div>
                          <div className="text-sm text-gold-700">{dream.mood}</div>
                        </div>
                        <p className="mt-2 text-sm leading-7 text-gray-600">{dream.description}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card variant="bordered" className="h-full">
                  <p className="text-sm font-semibold text-gold-700">Reflection prompt</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-midnight-950">A gentle prompt for tonight</h2>
                  <div className="mt-4 rounded-[1.4rem] bg-midnight-950 p-6 text-white">
                    <p className="text-lg leading-8">What emotion has been asking for your attention lately, and what might it be inviting you to understand?</p>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {stats.recurringThemes.slice(0, 4).map((theme) => (
                      <span key={theme} className="rounded-full bg-gold-50 px-3 py-1 text-sm text-gold-700">{theme}</span>
                    ))}
                  </div>
                </Card>
              </div>
            </main>
          </div>
        </div>
      </Container>
    </div>
  );
}
