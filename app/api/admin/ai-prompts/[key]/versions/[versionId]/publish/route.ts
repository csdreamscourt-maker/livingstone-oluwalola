import { NextRequest, NextResponse } from 'next/server';
import { publishAiPromptVersion } from '@/lib/db';
import { requireAdminSession } from '@/lib/session';

type Context = { params: Promise<{ key: string; versionId: string }> };

export async function POST(_req: NextRequest, ctx: Context) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { key, versionId } = await ctx.params;
  const slot = await publishAiPromptVersion(key, versionId);
  return NextResponse.json({ slot });
}
