'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Section } from '@/components/ui';
import { ArrowRight, Mail, Lock } from 'lucide-react';

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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Login failed');
      }

      const { token } = await response.json();
      localStorage.setItem('auth_token', token);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section padding="2xl" background="light">
      <Container size="sm">
        <div className="py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-midnight-950 mb-4">
              Sign In
            </h1>
            <p className="text-xl text-gray-600">
              Welcome back to your personal dashboard
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-midnight-950 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    disabled={loading}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-gray-200 text-midnight-950 placeholder:text-gray-400 focus:outline-none focus:border-gold-500 focus:ring-4 focus:ring-gold-500/15 transition-all duration-300"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-midnight-950 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-gray-200 text-midnight-950 placeholder:text-gray-400 focus:outline-none focus:border-gold-500 focus:ring-4 focus:ring-gold-500/15 transition-all duration-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-white bg-gold-600 hover:bg-gold-500 disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300 active:scale-95"
              >
                {loading ? 'Signing In...' : 'Sign In'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <p className="text-center text-gray-600 mt-6 text-sm">
              Demo credentials: test@example.com / password123
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
