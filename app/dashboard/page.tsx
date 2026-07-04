'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  Waves,
  LogOut,
} from 'lucide-react';
import type { User } from '@/types/database';
import { addDreamEntry, getDreamEntries, getDreamStats } from '@/lib/dreams';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [dreams, setDreams] = useState(getDreamEntries());
  const [draft, setDraft] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');

        if (!token) {
          router.push('/');
          return;
        }

        const response = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          localStorage.removeItem('auth_token');
          router.push('/');
          return;
        }

        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        console.error('Auth check failed:', err);
        localStorage.removeItem('auth_token');
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const stats = useMemo(() => getDreamStats(dreams), [dreams]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    router.push('/');
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
          <div className="text-center py-32">
            <div className="inline-flex items-center gap-2">
              <div className="w-2 h-2 bg-gold-600 rounded-full animate-pulse" />
              <p className="text-lg text-gray-600">Preparing your Dreamscourt sanctuary...</p>
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
          <div className="text-center py-32">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-midnight-950 mb-6">
              Welcome to Dreamscourt
            </h1>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              Sign in to access your private sanctuary for dream journaling, reflection, and spiritual growth.
            </p>
            <a
              href="/auth/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gold-600 text-midnight-950 font-semibold rounded-lg hover:bg-gold-500 hover:shadow-lg hover:shadow-gold-500/50 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Sign In to Continue
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <>
      <Section padding="2xl" className="bg-[radial-gradient(circle_at_top,_rgba(245,214,117,0.18),_transparent_50%)]">
        <Container>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-gold-600/20 bg-gold-50 px-3 py-1 text-sm font-semibold text-gold-700 mb-4">
                <MoonStar className="w-4 h-4" />
                Dreamscourt • Private Reflection Space
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-midnight-950 mb-3">
                Welcome back, {user.full_name || 'Friend'}
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl">
                A calm place to remember what your dreams are trying to show you.
              </p>
            </div>
            <Button onClick={handleLogout} variant="secondary" className="self-start">
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 mb-8">
            <Card variant="dark" className="overflow-hidden border-gold-600/20">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-gold-400 mb-2">Daily reflection</p>
                  <h2 className="text-2xl font-serif font-semibold mb-3">What wants your attention today?</h2>
                  <p className="text-gray-300 max-w-xl">
                    Let your dreams become a gentle practice of attention, wisdom, and spiritual awareness.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-gold-300">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Sunrise className="w-4 h-4" />
                    Morning capture ready
                  </div>
                </div>
              </div>
            </Card>

            <Card variant="bordered" className="bg-white/80 backdrop-blur">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-2xl bg-gold-100 p-3 text-gold-700">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gold-700">Quick capture</p>
                  <p className="text-sm text-gray-600">Capture a dream within seconds</p>
                </div>
              </div>
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                className="min-h-[120px] w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-midnight-950 outline-none focus:border-gold-600"
                placeholder="I dreamt that..."
              />
              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs text-gray-500">Your words will be saved locally for now.</p>
                <Button onClick={handleQuickCapture} variant="gold" size="sm">
                  Save dream
                </Button>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
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
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-serif font-bold text-midnight-950">{item.value}</p>
                        <p className="text-sm text-gray-600">{item.label}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
            <Card variant="bordered" className="h-full">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-gold-700 font-semibold">Recent dreams</p>
                  <h2 className="text-2xl font-serif font-bold text-midnight-950">Your dream timeline</h2>
                </div>
                <Link href="/dreams" className="text-sm font-semibold text-gold-700 hover:text-gold-800">
                  Open library
                </Link>
              </div>
              <div className="space-y-4">
                {dreams.slice(0, 4).map((dream) => (
                  <div key={dream.id} className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-midnight-950">{dream.title}</p>
                        <p className="text-sm text-gray-600">{new Date(dream.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-sm text-gold-700">{dream.mood}</div>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">{dream.description}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card variant="bordered" className="h-full">
              <p className="text-sm text-gold-700 font-semibold">Recommended reflection</p>
              <h2 className="text-2xl font-serif font-bold text-midnight-950 mt-2 mb-4">A gentle prompt for tonight</h2>
              <div className="rounded-2xl bg-midnight-950 p-6 text-white">
                <p className="text-lg leading-relaxed">
                  What emotion has been asking for your attention lately, and what might it be inviting you to understand?
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {stats.recurringThemes.slice(0, 4).map((theme) => (
                  <span key={theme} className="rounded-full bg-gold-50 px-3 py-1 text-sm text-gold-700">
                    {theme}
                  </span>
                ))}
              </div>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
}
