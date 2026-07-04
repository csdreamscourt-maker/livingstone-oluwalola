'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Section, Button } from '@/components/ui';
import { ArrowRight, Mail, Lock, UserCircle2 } from 'lucide-react';
import { registerUser } from '@/lib/auth';

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
      await registerUser({ fullName, email, password });
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
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
              <UserCircle2 className="w-4 h-4" />
              Dreamscourt account
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-midnight-950 mb-3">Create your private sanctuary</h1>
            <p className="text-lg text-gray-600">Your dreams, reflections, and spiritual growth deserve a secure home.</p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
            {error && <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-midnight-950">Full name</label>
                <div className="relative">
                  <UserCircle2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input value={fullName} onChange={(event) => setFullName(event.target.value)} required className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 outline-none focus:border-gold-600" placeholder="Arielle Johnson" />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-midnight-950">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 outline-none focus:border-gold-600" placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-midnight-950">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 outline-none focus:border-gold-600" placeholder="Create a secure password" />
                </div>
              </div>
              <Button type="submit" variant="gold" disabled={loading} className="w-full">
                {loading ? 'Creating account...' : 'Create account'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600">Already have a Dreamscourt account? <a href="/auth/login" className="font-semibold text-gold-700">Sign in</a></p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
