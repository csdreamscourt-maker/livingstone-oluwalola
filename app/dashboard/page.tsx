'use client';

import { useEffect, useState } from 'react';
import { Container, Section } from '@/components/ui';
import type { User } from '@/types/database';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
          setError('Dashboard is not configured yet. Please try again later.');
          setLoading(false);
          return;
        }

        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          setError('Please log in to access the dashboard.');
          setLoading(false);
          return;
        }

        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (userError && userError.code !== 'PGRST116') {
          throw userError;
        }

        setUser(userData);
      } catch (err) {
        setError('Failed to load dashboard.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <Section padding="xl">
        <Container>
          <div className="text-center py-20">
            <p className="text-lg text-stone-600">Loading...</p>
          </div>
        </Container>
      </Section>
    );
  }

  if (error || !user) {
    return (
      <Section padding="xl">
        <Container>
          <div className="text-center py-20">
            <h1 className="text-3xl font-serif font-bold text-midnight-950 mb-4">
              Dashboard
            </h1>
            <p className="text-lg text-stone-600 mb-6">{error || 'Please log in to continue.'}</p>
            <a
              href="/api/auth/login"
              className="inline-block px-6 py-3 bg-midnight-950 text-white font-medium rounded-lg hover:bg-midnight-800 transition-colors"
            >
              Sign In
            </a>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section padding="lg">
      <Container>
        <div className="mb-12">
          <h1 className="text-4xl font-serif font-bold text-midnight-950 mb-2">
            Welcome, {user.full_name || 'Friend'}
          </h1>
          <p className="text-lg text-stone-600">
            Your personal space for dreams, reflections, and spiritual growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { title: 'Dreams Recorded', value: '0' },
            { title: 'Prayers Logged', value: '0' },
            { title: 'Current Streak', value: '0 days' },
            { title: 'Insights Gained', value: '0' },
          ].map((stat) => (
            <div key={stat.title} className="bg-stone-100 rounded-lg p-6 text-center">
              <p className="text-4xl font-serif font-bold text-gold-600 mb-2">
                {stat.value}
              </p>
              <p className="text-stone-600 font-medium">{stat.title}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-stone-200 rounded-lg p-8">
            <h2 className="text-2xl font-serif font-bold text-midnight-950 mb-4">
              Recent Dreams
            </h2>
            <p className="text-stone-600 mb-6">No dreams recorded yet. Start by recording your first dream.</p>
            <button className="px-4 py-2 bg-midnight-950 text-white rounded-lg hover:bg-midnight-800 transition-colors">
              Record Dream
            </button>
          </div>

          <div className="bg-white border border-stone-200 rounded-lg p-8">
            <h2 className="text-2xl font-serif font-bold text-midnight-950 mb-4">
              Today's Reflection
            </h2>
            <p className="text-stone-600 mb-6">Take a moment to reflect on your day.</p>
            <button className="px-4 py-2 bg-midnight-950 text-white rounded-lg hover:bg-midnight-800 transition-colors">
              Write Reflection
            </button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
