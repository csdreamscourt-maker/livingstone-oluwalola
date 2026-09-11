import { NextRequest, NextResponse } from 'next/server';
import { getDreamById, getDreamCaptureDetails, upsertDreamCaptureDetails } from '@/lib/db';
import { getSessionFromCookies } from '@/lib/session';

type Context = { params: Promise<{ id: string }> };

const ALLOWED_FIELDS = [
  'people',
  'places',
  'attire',
  'emotions',
  'timing',
  'numbers',
  'colors',
  'sounds',
  'repeated_patterns',
  'ending',
] as const;

export async function GET(_req: NextRequest, ctx: Context) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await ctx.params;
  const details = await getDreamCaptureDetails(session.sub, id);
  return NextResponse.json({ details });
}

export async function PATCH(req: NextRequest, ctx: Context) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await ctx.params;
  const dream = await getDreamById(session.sub, id);
  if (!dream) {
    return NextResponse.json({ error: 'Dream not found' }, { status: 404 });
  }

  const body = await req.json();
  const updates: Record<string, unknown> = {};
  for (const field of ALLOWED_FIELDS) {
    if (field in body) updates[field] = body[field];
  }

  const details = await upsertDreamCaptureDetails(session.sub, id, updates);
  return NextResponse.json({ details });
}
