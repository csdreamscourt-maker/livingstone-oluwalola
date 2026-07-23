'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useDreamscourt } from '@/lib/dreamscourt/context';
import { Eyebrow, GlassCard, IconBadge } from '../ui';
import { uploadVoiceRecording } from '@/lib/api/dreams';
import { BookOpen, Compass, Flame, Heart, Lightbulb, Mic, Sparkles, Square } from 'lucide-react';

export function OverviewView() {
  const { user, dreams, stats, addDream, setError } = useDreamscourt();
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const [recording, setRecording] = useState(false);
  const [uploadingVoice, setUploadingVoice] = useState(false);
  const [voiceUrl, setVoiceUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const handleQuickCapture = async () => {
    if (!draft.trim() && !voiceUrl) return;
    setSaving(true);
    try {
      await addDream({
        title: 'Morning capture',
        description: draft.trim(),
        date_occurred: new Date().toISOString(),
        tags: ['quick-capture'],
        voice_recording_url: voiceUrl,
      });
      setDraft('');
      setVoiceUrl(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save the dream');
    } finally {
      setSaving(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => chunksRef.current.push(event.data);
      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setUploadingVoice(true);
        try {
          const url = await uploadVoiceRecording(blob);
          setVoiceUrl(url);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Voice recording could not be saved (storage not configured yet)');
        } finally {
          setUploadingVoice(false);
        }
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
    } catch {
      setError('Microphone access was denied or is unavailable.');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div className="space-y-5">
      <GlassCard>
        <Eyebrow>Dreamscourt · operational view</Eyebrow>
        <h1 className="mt-3 text-2xl font-semibold tracking-[-0.015em] text-white sm:text-3xl">
          Welcome back, {user?.full_name || user?.email || 'friend'}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
          A private sanctuary for capturing dreams, reflecting on patterns, and seeing your inner world with more clarity.
        </p>
      </GlassCard>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <GlassCard>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <IconBadge>
                <Compass className="h-4 w-4" />
              </IconBadge>
              <Eyebrow>Quick capture</Eyebrow>
            </div>
            <button
              onClick={recording ? stopRecording : startRecording}
              disabled={uploadingVoice}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors duration-200 disabled:opacity-50 ${
                recording ? 'bg-red-500/15 text-red-300' : 'border border-white/15 text-white/50 hover:text-white'
              }`}
            >
              {recording ? <Square className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
              {recording ? 'Stop' : uploadingVoice ? 'Saving voice...' : 'Record voice'}
            </button>
          </div>
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className="mt-4 min-h-[140px] w-full rounded-md border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-gold-400/60"
            placeholder="I dreamt that..."
          />
          {voiceUrl && (
            <audio controls src={voiceUrl} className="mt-3 h-8 w-full" />
          )}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-white/40">Saved to your account.</p>
            <button
              onClick={handleQuickCapture}
              disabled={saving}
              className="rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-midnight-950 transition-colors duration-200 hover:bg-gold-400 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save dream'}
            </button>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-3">
            <IconBadge>
              <Flame className="h-4 w-4" />
            </IconBadge>
            <Eyebrow>Current streak</Eyebrow>
          </div>
          <p className="mt-5 font-mono text-3xl font-semibold tabular-nums text-white">
            {stats.streak}
            <span className="ml-2 font-sans text-sm font-medium text-white/40">day{stats.streak === 1 ? '' : 's'}</span>
          </p>
        </GlassCard>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Dreams recorded', value: stats.dreamCount, icon: BookOpen },
          { label: 'Average clarity', value: stats.averageClarity ? `${stats.averageClarity}/5` : '—', icon: Sparkles },
          { label: 'Favorite dreams', value: stats.favoriteCount, icon: Heart },
          { label: 'Answered prayers', value: stats.answeredCount, icon: Lightbulb },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <GlassCard key={item.label} className="p-5">
              <div className="flex items-center gap-3">
                <IconBadge>
                  <Icon className="h-4 w-4" />
                </IconBadge>
                <div>
                  <p className="font-mono text-xl font-semibold tabular-nums text-white">{item.value}</p>
                  <p className="text-xs text-white/40">{item.label}</p>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      <GlassCard>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <Eyebrow>Recent dreams</Eyebrow>
            <h2 className="mt-2 text-lg font-semibold text-white">Your dream timeline</h2>
          </div>
          <Link href="/dreams" className="text-sm font-semibold text-white/50 transition-colors duration-200 hover:text-white">
            Open archive
          </Link>
        </div>
        <div className="space-y-2">
          {dreams.length === 0 && (
            <p className="text-sm text-white/50">No dreams recorded yet — capture your first one above.</p>
          )}
          {dreams.slice(0, 4).map((dream) => (
            <div key={dream.id} className="rounded-md border border-white/8 bg-white/[0.02] px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{dream.title}</p>
                  <p className="text-xs text-white/40">{new Date(dream.date_occurred).toLocaleDateString()}</p>
                </div>
                {dream.mood && <span className="text-xs capitalize text-gold-300">{dream.mood}</span>}
              </div>
              {dream.description && <p className="mt-2 text-sm leading-6 text-white/60">{dream.description}</p>}
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
