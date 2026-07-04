'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Section, Button } from '@/components/ui';
import { ArrowRight, Mail, Lock, MoonStar } from 'lucide-react';
import { loginUser } from '@/lib/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await loginUser({ email, password });
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section padding="2xl" className="bg-[radial-gradient(circle_at_top,_rgba(245,214,117,0.18),_transparent_50%)]">
      <Container size="sm">
        <div className="py-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-600/20 bg-gold-50 px-3 py-1 text-sm font-semibold text-gold-700 mb-4">
              <MoonStar className="w-4 h-4" />
              Dreamscourt access
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-midnight-950 mb-3">Welcome back to your sanctuary</h1>
            <p className="text-lg text-gray-600">Sign in to continue your dream journal and reflection practice.</p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
            {error && <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-midnight-950">Email address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required disabled={loading} className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-midnight-950 outline-none focus:border-gold-600" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-semibold text-midnight-950">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required disabled={loading} className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-midnight-950 outline-none focus:border-gold-600" />
                </div>
              </div>

              <Button type="submit" variant="gold" disabled={loading} className="w-full">
                {loading ? 'Signing in...' : 'Sign in'}
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">Need an account? <a href="/auth/signup" className="font-semibold text-gold-700">Create one</a></p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
