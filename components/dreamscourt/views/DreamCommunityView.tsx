'use client';

import { useEffect, useState } from 'react';
import { Eyebrow, GlassCard } from '../ui';
import { ArrowUpRight, MessageCircle } from 'lucide-react';

export function DreamCommunityView() {
  const [whatsappLink, setWhatsappLink] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setWhatsappLink(data.whatsapp_community_link);
      }
    })();
  }, []);

  return (
    <div className="space-y-5">
      <GlassCard>
        <Eyebrow>Community</Eyebrow>
        <h1 className="mt-3 text-2xl font-semibold text-midnight-950">A thriving community of dream intelligence practitioners</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
          Join lifelong learners, thinkers, and practitioners who believe dreams are a legitimate source of wisdom,
          insight, and personal transformation. Members journey together in discovery, growth, and meaningful
          conversation.
        </p>
      </GlassCard>

      <GlassCard className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-midnight-950/10 bg-white text-gold-700">
          <MessageCircle className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-semibold text-midnight-950">Join the Dream Court community on WhatsApp</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
          Reflective conversation, shared discovery, and direct access to the wider community.
        </p>
        {whatsappLink ? (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-gold-500 px-5 py-2.5 text-sm font-semibold text-midnight-950 transition-all duration-200 hover:scale-[1.03] hover:bg-gold-400"
          >
            Join on WhatsApp
            <ArrowUpRight className="h-4 w-4" />
          </a>
        ) : (
          <p className="mt-6 text-sm text-gray-500">Community link not configured yet.</p>
        )}
      </GlassCard>
    </div>
  );
}
