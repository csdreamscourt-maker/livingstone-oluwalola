'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Container, Section, Button } from '@/components/ui';
import { ArrowRight, Mail, Lock, MoonStar } from 'lucide-react';
import { login } from '@/lib/api/auth';

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
      await login({ email, password });
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section padding="xl" background="dark" className="min-h-screen">
      <Container size="sm">
        <div className="py-10">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40 mb-4">
              <MoonStar className="w-3.5 h-3.5 text-gold-300" />
              Dreamscourt access
            </span>
            <h1 className="text-2xl font-semibold text-white mb-2 sm:text-3xl">Welcome back to your sanctuary</h1>
            <p className="text-[15px] text-white/50">Sign in to continue your dream journal and reflection practice.</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl">
            {error && (
              <div className="mb-5 rounded-md border border-red-400/30 bg-red-500/10 p-3.5 text-sm text-red-200">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-white">Email address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                  <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required disabled={loading} className="w-full rounded-md border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-[15px] text-white outline-none placeholder:text-white/30 focus:border-gold-400/60" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-white">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                  <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required disabled={loading} className="w-full rounded-md border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-[15px] text-white outline-none placeholder:text-white/30 focus:border-gold-400/60" />
                </div>
              </div>

              <Button type="submit" variant="gold" disabled={loading} className="w-full">
                {loading ? 'Signing in...' : 'Sign in'}
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </form>

            <p className="mt-5 text-center text-sm text-white/50">
              Need an account? <Link href="/auth/signup" className="font-semibold text-white">Create one</Link>
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
