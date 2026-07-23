import { NextRequest, NextResponse } from 'next/server';
import { deleteDreamFolder } from '@/lib/db';
import { getSessionFromCookies } from '@/lib/session';

type Context = { params: Promise<{ id: string }> };

export async function DELETE(_req: NextRequest, ctx: Context) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await ctx.params;
  await deleteDreamFolder(session.sub, id);
  return NextResponse.json({ ok: true });
}
