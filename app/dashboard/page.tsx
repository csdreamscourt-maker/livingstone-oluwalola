'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Section, Card } from '@/components/ui';
import { BarChart3, BookOpen, Flame, Lightbulb, ArrowRight, LogOut } from 'lucide-react';
import type { User } from '@/types/database';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
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

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    router.push('/');
  };

  if (loading) {
    return (
      <Section padding="2xl">
        <Container>
          <div className="text-center py-32">
            <div className="inline-flex items-center gap-2">
              <div className="w-2 h-2 bg-gold-600 rounded-full animate-pulse" />
              <p className="text-lg text-gray-600">Loading your dashboard...</p>
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
              Welcome to Your Dashboard
            </h1>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              Please log in to access your personal dashboard and start your journey of discovery and growth.
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
      <Section padding="2xl" background="light">
        <Container>
          <div className="flex items-center justify-between mb-16">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-midnight-950 mb-4">
                Welcome, {user.full_name || 'Friend'}
              </h1>
              <p className="text-xl text-gray-600">
                Your personal space for dreams, reflections, and spiritual growth.
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:scale-105 active:scale-95 transition-transform duration-300"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BookOpen, title: 'Dreams Recorded', value: '0' },
              { icon: BarChart3, title: 'Insights Gained', value: '0' },
              { icon: Flame, title: 'Current Streak', value: '0 days' },
              { icon: Lightbulb, title: 'Prayers Logged', value: '0' },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={stat.title}
                  variant="elevated"
                  className="flex flex-col items-center text-center hover:shadow-lg transition-all duration-300 animate-slideUp"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-3 bg-gold-600 bg-opacity-10 rounded-lg mb-4">
                    <Icon className="w-6 h-6 text-gold-600" />
                  </div>
                  <p className="text-3xl font-serif font-bold text-gold-600 mb-2">
                    {stat.value}
                  </p>
                  <p className="text-gray-600 font-medium">{stat.title}</p>
                </Card>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section padding="2xl">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card
              variant="bordered"
              className="group hover:border-gold-600 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-midnight-950 group-hover:text-gold-600 transition-colors mb-2">
                    Record Dreams
                  </h2>
                  <p className="text-gray-600">
                    Begin your journey by recording and exploring your dreams.
                  </p>
                </div>
                <BookOpen className="w-8 h-8 text-gold-600 flex-shrink-0" />
              </div>
              <p className="text-sm text-gray-500 mb-6">
                No dreams recorded yet. Start by recording your first dream and discover insights from your subconscious.
              </p>
              <button className="flex items-center gap-2 text-gold-600 hover:text-gold-700 font-semibold group/link transition-all">
                Record Your First Dream
                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </button>
            </Card>

            <Card
              variant="bordered"
              className="group hover:border-gold-600 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-midnight-950 group-hover:text-gold-600 transition-colors mb-2">
                    Daily Reflection
                  </h2>
                  <p className="text-gray-600">
                    Reflect on your day and track your personal growth.
                  </p>
                </div>
                <Lightbulb className="w-8 h-8 text-gold-600 flex-shrink-0" />
              </div>
              <p className="text-sm text-gray-500 mb-6">
                Take a moment to reflect on your day and capture insights that matter to you.
              </p>
              <button className="flex items-center gap-2 text-gold-600 hover:text-gold-700 font-semibold group/link transition-all">
                Write Today's Reflection
                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </button>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
}
