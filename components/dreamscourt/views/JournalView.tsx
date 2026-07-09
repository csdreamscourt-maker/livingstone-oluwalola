'use client';

import { useState, type FormEvent } from 'react';
import { useDreamscourt } from '@/lib/dreamscourt/context';
import { Eyebrow, GlassCard, IconBadge } from '../ui';
import { PenTool } from 'lucide-react';

const PRAYER_TYPES = ['intercession', 'thanksgiving', 'petition', 'praise', 'confession'];

export function JournalView() {
  const { journalEntries, addJournalEntry, toggleAnswered, setError } = useDreamscourt();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [prayerType, setPrayerType] = useState(PRAYER_TYPES[0]);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setSaving(true);
    try {
      await addJournalEntry({
        title: title.trim(),
        content: content.trim(),
        prayer_type: prayerType,
        date_prayed: new Date().toISOString(),
      });
      setTitle('');
      setContent('');
      setPrayerType(PRAYER_TYPES[0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save the journal entry');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
      <GlassCard>
        <div className="mb-5 flex items-center gap-3">
          <IconBadge>
            <PenTool className="h-4 w-4" />
          </IconBadge>
          <div>
            <Eyebrow>Prayer journal</Eyebrow>
            <h2 className="mt-1 text-lg font-semibold text-white">Write before it fades</h2>
          </div>
        </div>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-md border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-gold-400/60"
            placeholder="Entry title"
          />
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            className="min-h-[160px] w-full rounded-md border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-gold-400/60"
            placeholder="What are you praying about?"
          />
          <select
            value={prayerType}
            onChange={(event) => setPrayerType(event.target.value)}
            className="w-full rounded-md border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm capitalize text-white outline-none focus:border-gold-400/60"
          >
            {PRAYER_TYPES.map((type) => (
              <option key={type} value={type} className="bg-midnight-950 capitalize">
                {type}
              </option>
            ))}
          </select>
          <button
            disabled={saving}
            className="rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-midnight-950 transition-colors duration-200 hover:bg-gold-400 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save entry'}
          </button>
        </form>
      </GlassCard>

      <GlassCard>
        <div className="mb-4">
          <Eyebrow>Recent entries</Eyebrow>
          <h2 className="mt-2 text-lg font-semibold text-white">Your reflection stream</h2>
        </div>
        <div className="space-y-2">
          {journalEntries.length === 0 && <p className="text-sm text-white/50">No entries yet.</p>}
          {journalEntries.map((entry) => (
            <div key={entry.id} className="rounded-md border border-white/8 bg-white/[0.02] px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{entry.title}</p>
                  <p className="text-xs text-white/40">{new Date(entry.date_prayed).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => toggleAnswered(entry)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    entry.is_answered ? 'bg-emerald-500/15 text-emerald-300' : 'border border-white/15 text-white/50'
                  }`}
                >
                  {entry.is_answered ? 'Answered' : 'Mark answered'}
                </button>
              </div>
              <p className="mt-2 text-sm leading-6 text-white/60">{entry.content}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
