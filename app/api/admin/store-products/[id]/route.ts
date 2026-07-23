import { NextRequest, NextResponse } from 'next/server';
import { deleteStoreProduct, updateStoreProduct } from '@/lib/db';
import { requireAdminSession } from '@/lib/session';

type Context = { params: Promise<{ id: string }> };

const ALLOWED_FIELDS = ['title', 'description', 'price_display', 'selar_url', 'cover_image_url', 'is_published'] as const;

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

  const product = await updateStoreProduct(id, updates);
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json({ product });
}

export async function DELETE(_req: NextRequest, ctx: Context) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await ctx.params;
  await deleteStoreProduct(id);
  return NextResponse.json({ ok: true });
}
