import { NextRequest, NextResponse } from 'next/server';
import { deleteAiPromptVersion } from '@/lib/db';
import { requireAdminSession } from '@/lib/session';

type Context = { params: Promise<{ key: string; versionId: string }> };

export async function DELETE(_req: NextRequest, ctx: Context) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { versionId } = await ctx.params;
  await deleteAiPromptVersion(versionId);
  return NextResponse.json({ ok: true });
}
