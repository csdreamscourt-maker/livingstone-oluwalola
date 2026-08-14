import { NextRequest, NextResponse } from 'next/server';
import { updateKnowledgeSyncConnection, deleteKnowledgeSyncConnection } from '@/lib/db';
import { requireAdminSession } from '@/lib/session';

type Context = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, ctx: Context) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await ctx.params;
  const body = await req.json();

  const connection = await updateKnowledgeSyncConnection(id, {
    ...(body.label !== undefined ? { label: body.label } : {}),
    ...(body.feed_url !== undefined ? { feed_url: body.feed_url } : {}),
    ...(body.auto_sync !== undefined ? { auto_sync: Boolean(body.auto_sync) } : {}),
  });

  if (!connection) {
    return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
  }
  return NextResponse.json({ connection });
}

export async function DELETE(_req: NextRequest, ctx: Context) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await ctx.params;
  await deleteKnowledgeSyncConnection(id);
  return NextResponse.json({ ok: true });
}
