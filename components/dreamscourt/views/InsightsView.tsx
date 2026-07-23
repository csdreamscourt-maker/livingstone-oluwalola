'use client';

import { useDreamscourt } from '@/lib/dreamscourt/context';
import { Eyebrow, GlassCard, IconBadge } from '../ui';
import { Compass, Lightbulb, Sparkles } from 'lucide-react';

export function InsightsView() {
  const { stats } = useDreamscourt();
  const moodEntries = Object.entries(stats.moods).sort((a, b) => b[1] - a[1]);

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
    </div>
  );
}
