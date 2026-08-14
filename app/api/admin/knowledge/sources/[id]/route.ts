import { NextRequest, NextResponse } from 'next/server';
import { getKnowledgeSourceById, updateKnowledgeSource, deleteKnowledgeSource } from '@/lib/db';
import { requireAdminSession } from '@/lib/session';

type Context = { params: Promise<{ id: string }> };

const ALLOWED_FIELDS = [
  'title',
  'author',
  'source_type',
  'tier',
  'publication_date',
  'url',
  'description',
  'full_text',
  'topics',
  'tags',
  'scripture_references',
  'framework_categories',
  'processing_status',
] as const;

export async function GET(_req: NextRequest, ctx: Context) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await ctx.params;
  const source = await getKnowledgeSourceById(id);
  if (!source) {
    return NextResponse.json({ error: 'Source not found' }, { status: 404 });
  }
  return NextResponse.json({ source });
}

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

  // Publishing/unpublishing only toggles between 'indexed' and 'published' — content edits
  // that change full_text should go back through ingestion (status handled there).
  if (updates.processing_status && !['published', 'needs_review', 'indexed'].includes(updates.processing_status as string)) {
    delete updates.processing_status;
  }

  const source = await updateKnowledgeSource(id, updates);
  if (!source) {
    return NextResponse.json({ error: 'Source not found' }, { status: 404 });
  }

  return NextResponse.json({ source });
}

export async function DELETE(_req: NextRequest, ctx: Context) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await ctx.params;
  await deleteKnowledgeSource(id);
  return NextResponse.json({ ok: true });
}
