'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
    <Section padding="xl" className="bg-paper">
      <Container size="sm">
        <div className="py-10">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500 mb-4">
              <UserCircle2 className="w-3.5 h-3.5 text-gold-600" />
              Dreamscourt account
            </span>
            <h1 className="text-2xl font-semibold text-midnight-950 mb-2 sm:text-3xl">Create your private sanctuary</h1>
            <p className="text-[15px] text-gray-600">Your dreams, reflections, and spiritual growth deserve a secure home.</p>
          </div>

          <div className="rounded-lg border border-midnight-950/10 bg-white p-7">
            {error && <div className="mb-5 rounded-md border border-red-200 bg-red-50 p-3.5 text-sm text-red-600">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-midnight-950">Full name</label>
                <div className="relative">
                  <UserCircle2 className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input value={fullName} onChange={(event) => setFullName(event.target.value)} required className="w-full rounded-md border border-midnight-950/10 bg-gray-50 py-2.5 pl-10 pr-4 text-[15px] outline-none focus:border-gold-500" placeholder="Arielle Johnson" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-midnight-950">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="w-full rounded-md border border-midnight-950/10 bg-gray-50 py-2.5 pl-10 pr-4 text-[15px] outline-none focus:border-gold-500" placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-midnight-950">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required className="w-full rounded-md border border-midnight-950/10 bg-gray-50 py-2.5 pl-10 pr-4 text-[15px] outline-none focus:border-gold-500" placeholder="Create a secure password" />
                </div>
              </div>
              <Button type="submit" variant="primary" disabled={loading} className="w-full">
                {loading ? 'Creating account...' : 'Create account'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
            <p className="mt-5 text-center text-sm text-gray-600">Already have a Dreamscourt account? <a href="/auth/login" className="font-semibold text-midnight-950">Sign in</a></p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
