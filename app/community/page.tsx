'use client';

import { useState } from 'react';
import { Container, Section, Card, Input, Button, Alert } from '@/components/ui';
import { Hero } from '@/components/sections';

const pillars = [
  {
    title: 'Mastermind groups',
    description: 'Small, closed cohorts of purpose-driven leaders working through frameworks together, not alone.',
  },
  {
    title: 'A paid newsletter',
    description: 'Structured, takeaway-driven dispatches connecting faith, strategy, and institutional building.',
  },
  {
    title: 'Direct access',
    description: 'Reflective questions, real-life application, and space for members to bring their hardest strategic questions.',
  },
];

export default function CommunityPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('loading');
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error('failed');
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <Hero
        subtitle="Collective growth"
        title="The Masterminds community"
        description="An in-development home for purpose-driven leaders, reformers, and mid-to-high-level professionals who want to build alongside each other — not just consume content alone."
      />

      <Section padding="xl">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
            {pillars.map((pillar) => (
              <Card key={pillar.title} variant="bordered">
                <h3 className="text-[15px] font-semibold text-midnight-950 mb-2">{pillar.title}</h3>
                <p className="text-sm text-gray-600 leading-6">{pillar.description}</p>
              </Card>
            ))}
          </div>

          <Card variant="bordered" padding="lg" className="max-w-lg mx-auto text-center">
            <h2 className="text-lg font-semibold text-midnight-950 mb-2">Be first in the door</h2>
            <p className="text-sm text-gray-600 leading-6 mb-6">
              Masterminds is still being built. Leave your email and you&apos;ll be the first to hear when the newsletter and mastermind groups open.
            </p>

            {status === 'success' ? (
              <Alert type="success" title="You're on the list">
                We&apos;ll be in touch as soon as Masterminds opens.
              </Alert>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={status === 'loading'}>
                  {status === 'loading' ? 'Joining...' : 'Join the waitlist'}
                </Button>
              </form>
            )}
            {status === 'error' && (
              <p className="mt-3 text-sm text-red-600">Something went wrong. Please try again.</p>
            )}
          </Card>
        </Container>
      </Section>
    </>
  );
}
