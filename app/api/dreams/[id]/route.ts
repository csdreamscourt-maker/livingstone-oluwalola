import { NextRequest, NextResponse } from 'next/server';
import { deleteDream, updateDream } from '@/lib/db';
import { getSessionFromCookies } from '@/lib/session';

type Context = { params: Promise<{ id: string }> };

const ALLOWED_FIELDS = [
  'title',
  'description',
  'content',
  'date_occurred',
  'mood',
  'tags',
  'clarity',
  'is_private',
  'favorite',
  'is_archived',
  'folder_id',
  'voice_recording_url',
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

  const dream = await updateDream(session.sub, id, updates);
  if (!dream) {
    return NextResponse.json({ error: 'Dream not found' }, { status: 404 });
  }

  return NextResponse.json({ dream });
}

export async function DELETE(_req: NextRequest, ctx: Context) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await ctx.params;
  await deleteDream(session.sub, id);
  return NextResponse.json({ ok: true });
}
