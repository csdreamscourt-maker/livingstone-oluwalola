import { NextRequest, NextResponse } from 'next/server';
import { deleteDreamSymbol, updateDreamSymbol } from '@/lib/db';
import { requireAdminSession } from '@/lib/session';

type Context = { params: Promise<{ id: string }> };

const ALLOWED_FIELDS = ['term', 'meaning', 'category', 'scripture_reference'] as const;

export async function PATCH(req: NextRequest, ctx: Context) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await ctx.params;
  const body = await req.json();
  const updates: Record<string, unknown> = {};
  for (const field of ALLOWED_FIELDS) {
    if (field in body) updates[field] = body[field];
  }

  const symbol = await updateDreamSymbol(id, updates);
  if (!symbol) {
    return NextResponse.json({ error: 'Symbol not found' }, { status: 404 });
  }

  return NextResponse.json({ symbol });
}

export async function DELETE(_req: NextRequest, ctx: Context) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await ctx.params;
  await deleteDreamSymbol(id);
  return NextResponse.json({ ok: true });
}
