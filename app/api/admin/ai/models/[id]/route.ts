import { NextRequest, NextResponse } from 'next/server';
import { updateAiModel, deleteAiModel } from '@/lib/db';
import { requireAdminSession } from '@/lib/session';

type Context = { params: Promise<{ id: string }> };

const ALLOWED_FIELDS = [
  'provider_id',
  'model_id',
  'display_name',
  'supports_text',
  'supports_vision',
  'supports_image_generation',
  'supports_embeddings',
  'context_window',
  'cost_tier',
  'enabled',
] as const;

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

  const model = await updateAiModel(id, updates);
  if (!model) {
    return NextResponse.json({ error: 'Model not found' }, { status: 404 });
  }

  return NextResponse.json({ model });
}

export async function DELETE(_req: NextRequest, ctx: Context) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await ctx.params;
  await deleteAiModel(id);
  return NextResponse.json({ ok: true });
}
