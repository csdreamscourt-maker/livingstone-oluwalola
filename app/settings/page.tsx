'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Container, Section, Card, Button } from '@/components/ui';
import { getCurrentSession } from '@/lib/auth';
import { Brain, MoonStar, ShieldCheck, Sparkles } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = getCurrentSession();
    if (!session) {
      router.replace('/auth/login');
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) return null;

  return (
    <Section padding="2xl" className="bg-[#0f1328]">
      <Container>
        <div className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold-600/20 bg-gold-50 px-3 py-1 text-sm font-semibold text-gold-700">
            <ShieldCheck className="h-4 w-4" />
            Dreamscourt settings
          </div>
          <h1 className="text-4xl font-serif font-bold text-white md:text-5xl">A more private, more personal home for your practice</h1>
          <p className="mt-3 max-w-2xl text-lg text-white/75">This workspace is being expanded into a richer command center with profile controls, rituals, and memory preferences.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card variant="bordered" className="border-white/10 bg-[#f7f7fb]">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-gold-100 p-3 text-gold-700">
                <MoonStar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gold-700">Workspace focus</p>
                <p className="text-sm text-gray-600">Calm, reflection, and continuity</p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {['Private dream archive', 'Reflection reminders', 'Cross-device continuity'].map((item) => (
                <div key={item} className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
                  {item}
                </div>
              ))}
            </div>
          </Card>

          <Card variant="bordered" className="border-white/10 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gold-700">Product roadmap</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-midnight-950">A fuller Dreamscourt experience is on the way</h2>
              </div>
              <div className="rounded-2xl bg-gold-100 p-3 text-gold-700">
                <Brain className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-6 rounded-[1.4rem] bg-[#0f1328] p-6 text-white">
              <p className="text-lg leading-8">The next layer will connect your journal entries to richer insights, longer-term rituals, and a more durable personal archive.</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/dashboard" variant="secondary">Back to dashboard</Button>
              <Button href="/journal" variant="ghost">Open journal</Button>
            </div>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
