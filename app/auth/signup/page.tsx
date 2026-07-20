'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Container, Section, Button } from '@/components/ui';
import { ArrowRight, Mail, Lock, UserCircle2 } from 'lucide-react';
import { signup } from '@/lib/api/auth';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signup({ fullName, email, password });
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section padding="xl" background="dark" className="min-h-screen">
      <Container size="sm">
        <div className="py-10">
          <div className="text-center mb-8">
            <Image src="/brand/dreamscourt-logo-full.png" alt="Dreamscourt" width={1075} height={435} className="mx-auto mb-6 h-10 w-auto" priority />
            <h1 className="text-2xl font-semibold text-white mb-2 sm:text-3xl">Create your private sanctuary</h1>
            <p className="text-[15px] text-white/50">Your dreams, reflections, and spiritual growth deserve a secure home.</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl">
            {error && (
              <div className="mb-5 rounded-md border border-red-400/30 bg-red-500/10 p-3.5 text-sm text-red-200">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-white">Full name</label>
                <div className="relative">
                  <UserCircle2 className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <input value={fullName} onChange={(event) => setFullName(event.target.value)} required className="w-full rounded-md border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-[15px] text-white outline-none placeholder:text-white/30 focus:border-gold-400/60" placeholder="Arielle Johnson" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-white">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="w-full rounded-md border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-[15px] text-white outline-none placeholder:text-white/30 focus:border-gold-400/60" placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-white">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required className="w-full rounded-md border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-[15px] text-white outline-none placeholder:text-white/30 focus:border-gold-400/60" placeholder="Create a secure password" />
                </div>
              </div>
              <Button type="submit" variant="gold" disabled={loading} className="w-full">
                {loading ? 'Creating account...' : 'Create account'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
            <p className="mt-5 text-center text-sm text-white/50">
              Already have a Dreamscourt account? <Link href="/auth/login" className="font-semibold text-white">Sign in</Link>
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
