'use client';

import { useState } from 'react';
import { Container } from '@/components/ui';

export function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus('success');
        setEmail('');
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-stone-100">
      <Container size="sm">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-midnight-950 mb-4">
            Join the Community
          </h2>
          <p className="text-lg text-stone-600">
            Get weekly insights on leadership, faith, and systems thinking.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:border-gold-600 focus:ring-2 focus:ring-gold-400/20"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-6 py-3 bg-midnight-950 text-white font-medium rounded-lg hover:bg-midnight-800 disabled:bg-stone-400 transition-colors"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>

        {status === 'success' && (
          <p className="text-center text-sm text-green-600 mt-4">
            Thank you! Check your email for confirmation.
          </p>
        )}

        {status === 'error' && (
          <p className="text-center text-sm text-red-600 mt-4">
            Something went wrong. Please try again.
          </p>
        )}
      </Container>
    </section>
  );
}
