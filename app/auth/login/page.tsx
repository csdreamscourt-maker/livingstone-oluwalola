'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Container, Section, Button } from '@/components/ui';
import { ArrowRight, Mail, Lock } from 'lucide-react';
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
    <Section padding="xl" className="min-h-screen bg-paper">
      <Container size="sm">
        <div className="py-10">
          <div className="text-center mb-8">
            <Image src="/brand/dreamscourt-logo-color-transparent.png" alt="Dreamscourt" width={990} height={402} className="mx-auto mb-6 h-10 w-auto" priority />
            <h1 className="text-2xl font-semibold text-midnight-950 mb-2 sm:text-3xl">Welcome back to your sanctuary</h1>
            <p className="text-[15px] text-gray-500">Sign in to continue your dream journal and reflection practice.</p>
          </div>

          <div className="rounded-2xl border border-midnight-950/10 bg-white p-7 shadow-sm">
            {error && (
              <div className="mb-5 rounded-md border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-midnight-950">Email address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required disabled={loading} className="w-full rounded-md border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-[15px] text-midnight-950 outline-none placeholder-gray-400 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/40" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-midnight-950">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required disabled={loading} className="w-full rounded-md border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-[15px] text-midnight-950 outline-none placeholder-gray-400 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/40" />
                </div>
              </div>

              <Button type="submit" variant="gold" disabled={loading} className="w-full">
                {loading ? 'Signing in...' : 'Sign in'}
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </form>

            <p className="mt-5 text-center text-sm text-gray-500">
              Need an account? <Link href="/auth/signup" className="font-semibold text-midnight-950">Create one</Link>
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
