'use client';

import { useEffect, useState } from 'react';
import { useDreamscourt } from '@/lib/dreamscourt/context';
import { fetchDreamPatterns } from '@/lib/api/dreams';
import type { RecurringDreamPattern } from '@/types/database';
import { Eyebrow, GlassCard, IconBadge } from '../ui';
import { BrainCircuit, Compass, Lightbulb, Sparkles } from 'lucide-react';

const ELEMENT_TYPE_LABELS: Record<RecurringDreamPattern['element_type'], string> = {
  person: 'Person',
  place: 'Place',
  number: 'Number',
  color: 'Color',
  symbol: 'Symbol',
  emotion: 'Emotion',
};

export function InsightsView() {
  const { stats } = useDreamscourt();
  const moodEntries = Object.entries(stats.moods).sort((a, b) => b[1] - a[1]);

  const [patterns, setPatterns] = useState<RecurringDreamPattern[]>([]);
  const [patternsLoading, setPatternsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const rows = await fetchDreamPatterns();
        setPatterns(rows);
      } finally {
        setPatternsLoading(false);
      }
    })();
  }, []);

  return (
    <div className="grid gap-5 xl:grid-cols-3">
      <GlassCard>
        <div className="flex items-center gap-3">
          <IconBadge>
            <Sparkles className="h-4 w-4" />
          </IconBadge>
          <Eyebrow>Overview</Eyebrow>
        </div>
        <p className="mt-4 text-[15px] font-semibold leading-6 text-midnight-950">
          {stats.dreamCount} dream{stats.dreamCount === 1 ? '' : 's'} recorded, average clarity {stats.averageClarity || '—'}/5.
        </p>
        <p className="mt-2 text-sm text-gray-600">
          Current streak: <span className="font-mono tabular-nums">{stats.streak}</span> day{stats.streak === 1 ? '' : 's'}.
        </p>
      </GlassCard>

      <GlassCard>
        <div className="flex items-center gap-3">
          <IconBadge>
            <Compass className="h-4 w-4" />
          </IconBadge>
          <Eyebrow>Mood frequency</Eyebrow>
        </div>
        <div className="mt-4 space-y-2">
          {moodEntries.length === 0 && <p className="text-sm text-gray-500">No moods logged yet.</p>}
          {moodEntries.map(([mood, count]) => (
            <div key={mood} className="flex items-center justify-between rounded-md bg-gray-50 px-4 py-2 text-sm">
              <span className="capitalize text-midnight-950">{mood}</span>
              <span className="font-mono tabular-nums text-gray-500">{count}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <div className="flex items-center gap-3">
          <IconBadge>
            <Lightbulb className="h-4 w-4" />
          </IconBadge>
          <Eyebrow>Recurring themes</Eyebrow>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {stats.recurringThemes.length === 0 && <p className="text-sm text-gray-500">No themes yet.</p>}
          {stats.recurringThemes.map((theme) => (
            <span key={theme} className="rounded-full border border-midnight-950/10 px-3 py-1 text-sm text-gray-600">
              {theme}
            </span>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="xl:col-span-3">
        <div className="flex items-center gap-3">
          <IconBadge>
            <BrainCircuit className="h-4 w-4" />
          </IconBadge>
          <Eyebrow>Personal dream memory</Eyebrow>
        </div>
        <p className="mt-3 text-sm text-gray-600">
          Elements that have shown up more than once across your recorded dreams. Recurrence isn&apos;t automatically
          meaningful — it&apos;s simply surfaced here for you to weigh for yourself.
        </p>
        <div className="mt-4 space-y-2">
          {patternsLoading && <p className="text-sm text-gray-500">Looking through your archive...</p>}
          {!patternsLoading && patterns.length === 0 && (
            <p className="text-sm text-gray-500">
              No recurring elements yet — interpret a few more dreams and patterns will start to surface here.
            </p>
          )}
          {patterns.map((pattern) => (
            <div
              key={`${pattern.element_type}-${pattern.value}`}
              className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-gray-50 px-4 py-2.5 text-sm"
            >
              <div>
                <span className="mr-2 rounded-full border border-midnight-950/10 px-2 py-0.5 text-xs uppercase tracking-wide text-gray-500">
                  {ELEMENT_TYPE_LABELS[pattern.element_type]}
                </span>
                <span className="font-medium text-midnight-950">{pattern.value}</span>
              </div>
              <span className="text-xs text-gray-500">
                {pattern.occurrences} dreams · last {new Date(pattern.last_seen).toDateString()}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
