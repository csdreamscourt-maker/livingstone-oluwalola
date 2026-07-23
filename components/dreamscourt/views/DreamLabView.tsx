'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Eyebrow, GlassCard, IconBadge } from '../ui';
import { ImageIcon, Sparkles } from 'lucide-react';
import type { DreamLabSession } from '@/types/database';

export function DreamLabView() {
  const [prompt, setPrompt] = useState('');
  const [sessions, setSessions] = useState<DreamLabSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [interpreting, setInterpreting] = useState(false);
  const [generatingImageFor, setGeneratingImageFor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadSessions = async () => {
    const res = await fetch('/api/dream-lab/sessions');
    if (res.ok) {
      const data = await res.json();
      setSessions(data.sessions);
    }
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await loadSessions();
    })();
  }, []);

  const handleInterpret = async () => {
    if (!prompt.trim()) return;
    setInterpreting(true);
    setError(null);
    try {
      const res = await fetch('/api/dream-lab/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to discern this dream');
      setSessions((prev) => [data.session, ...prev]);
      setPrompt('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to discern this dream');
    } finally {
      setInterpreting(false);
    }
  };

  const handleGenerateImage = async (dreamLabSession: DreamLabSession) => {
    setGeneratingImageFor(dreamLabSession.id);
    setError(null);
    try {
      const res = await fetch('/api/dream-lab/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: dreamLabSession.id, prompt: dreamLabSession.prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate an image');
      setSessions((prev) => prev.map((s) => (s.id === dreamLabSession.id ? data.session : s)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate an image');
    } finally {
      setGeneratingImageFor(null);
    }
  };

  return (
    <div className="space-y-5">
      <GlassCard>
        <Eyebrow>Dream Lab</Eyebrow>
        <h1 className="mt-3 text-2xl font-semibold text-white">Discern the meaning of your dreams</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
          Describe a dream in your own words. Dream Lab offers a grounded discernment integrating scriptural wisdom,
          psychology, and neuroscience — and can generate a visual for your vision.
        </p>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="mt-5 min-h-[140px] w-full rounded-md border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-gold-400/60"
          placeholder="I dreamt that..."
        />
        {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
        <button
          onClick={handleInterpret}
          disabled={interpreting}
          className="mt-4 inline-flex items-center gap-2 rounded-md bg-gold-500 px-5 py-2.5 text-sm font-semibold text-midnight-950 transition-all duration-200 hover:scale-[1.03] hover:bg-gold-400 disabled:opacity-50"
        >
          <Sparkles className="h-4 w-4" />
          {interpreting ? 'Discerning...' : 'Discern this dream'}
        </button>
      </GlassCard>

      {loading && <p className="text-sm text-white/50">Loading your Dream Lab history...</p>}

      <div className="space-y-4">
        {sessions.map((dreamLabSession) => (
          <GlassCard key={dreamLabSession.id}>
            <div className="mb-3 flex items-center gap-3">
              <IconBadge>
                <Sparkles className="h-4 w-4" />
              </IconBadge>
              <span className="text-xs text-white/40">{new Date(dreamLabSession.created_at).toLocaleString()}</span>
            </div>
            <p className="text-sm italic leading-6 text-white/50">&ldquo;{dreamLabSession.prompt}&rdquo;</p>
            {dreamLabSession.interpretation && (
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-white/80">{dreamLabSession.interpretation}</p>
            )}

            {dreamLabSession.image_url ? (
              <div className="relative mt-4 aspect-square w-full max-w-xs overflow-hidden rounded-lg border border-white/10">
                <Image src={dreamLabSession.image_url} alt="Generated vision" fill className="object-cover" unoptimized />
              </div>
            ) : (
              <button
                onClick={() => handleGenerateImage(dreamLabSession)}
                disabled={generatingImageFor === dreamLabSession.id}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-gold-300 transition-colors duration-200 hover:text-gold-200 disabled:opacity-50"
              >
                <ImageIcon className="h-3.5 w-3.5" />
                {generatingImageFor === dreamLabSession.id ? 'Generating vision...' : 'Generate a vision image'}
              </button>
            )}
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
