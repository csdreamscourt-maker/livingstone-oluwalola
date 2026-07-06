import { NextRequest, NextResponse } from 'next/server';
import { deleteJournalEntry, updateJournalEntry } from '@/lib/db';
import { getSessionFromCookies } from '@/lib/session';

type Context = { params: Promise<{ id: string }> };

const ALLOWED_FIELDS = [
  'title',
  'content',
  'prayer_type',
  'date_prayed',
  'tags',
  'is_answered',
  'answer_notes',
  'answer_date',
] as const;

export async function PATCH(req: NextRequest, ctx: Context) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await ctx.params;
  const body = await req.json();

  const updates: Record<string, unknown> = {};
  for (const field of ALLOWED_FIELDS) {
    if (field in body) updates[field] = body[field];
  }

  const entry = await updateJournalEntry(session.sub, id, updates);
  if (!entry) {
    return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
  }

  return NextResponse.json({ entry });
}

export async function DELETE(_req: NextRequest, ctx: Context) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await ctx.params;
  await deleteJournalEntry(session.sub, id);
  return NextResponse.json({ ok: true });
}
