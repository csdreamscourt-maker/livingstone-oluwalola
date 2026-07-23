'use client';

import { useDreamscourt } from '@/lib/dreamscourt/context';
import { Eyebrow, GlassCard, IconBadge } from '../ui';
import { Settings } from 'lucide-react';

export function SettingsView() {
  const { user, journalEntries, stats } = useDreamscourt();

  return (
    <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <GlassCard>
        <div className="flex items-center gap-3">
          <IconBadge>
            <Settings className="h-4 w-4" />
          </IconBadge>
          <div>
            <Eyebrow>Account</Eyebrow>
            <h2 className="mt-1 text-lg font-semibold text-midnight-950">Your Dreamscourt profile</h2>
          </div>
        </div>
        <div className="mt-5 space-y-2 text-sm text-gray-600">
          <div className="rounded-md border border-midnight-950/8 bg-gray-50 px-4 py-2.5">
            <span className="font-semibold text-midnight-950">Name: </span>
            {user?.full_name || '—'}
          </div>
          <div className="rounded-md border border-midnight-950/8 bg-gray-50 px-4 py-2.5">
            <span className="font-semibold text-midnight-950">Email: </span>
            {user?.email}
          </div>
          <div className="rounded-md border border-midnight-950/8 bg-gray-50 px-4 py-2.5">
            <span className="font-semibold text-midnight-950">Member since: </span>
            {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <Eyebrow>Summary</Eyebrow>
        <h2 className="mt-2 text-lg font-semibold text-midnight-950">Your practice so far</h2>
        <div className="mt-5 space-y-2 text-sm text-gray-600">
          <div className="rounded-md border border-midnight-950/8 bg-gray-50 px-4 py-2.5">
            {stats.dreamCount} dream{stats.dreamCount === 1 ? '' : 's'} recorded
          </div>
          <div className="rounded-md border border-midnight-950/8 bg-gray-50 px-4 py-2.5">
            {journalEntries.length} journal entr{journalEntries.length === 1 ? 'y' : 'ies'}
          </div>
          <div className="rounded-md border border-midnight-950/8 bg-gray-50 px-4 py-2.5">
            {stats.answeredCount} answered prayer{stats.answeredCount === 1 ? '' : 's'}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
