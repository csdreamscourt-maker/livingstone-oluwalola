import { NextRequest, NextResponse } from 'next/server';
import { deleteDreamArticle, updateDreamArticle } from '@/lib/db';
import { requireAdminSession } from '@/lib/session';

type Context = { params: Promise<{ id: string }> };

const ALLOWED_FIELDS = ['title', 'slug', 'excerpt', 'body', 'category', 'is_published'] as const;

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

  const article = await updateDreamArticle(id, updates);
  if (!article) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  }

  return NextResponse.json({ article });
}

export async function DELETE(_req: NextRequest, ctx: Context) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await ctx.params;
  await deleteDreamArticle(id);
  return NextResponse.json({ ok: true });
}
