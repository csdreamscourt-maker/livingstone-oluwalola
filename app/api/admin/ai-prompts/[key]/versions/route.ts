import { NextRequest, NextResponse } from 'next/server';
import { listAiPromptVersions, createAiPromptVersion } from '@/lib/db';
import { requireAdminSession } from '@/lib/session';

type Context = { params: Promise<{ key: string }> };

export async function GET(_req: NextRequest, ctx: Context) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { key } = await ctx.params;
  const versions = await listAiPromptVersions(key);
  return NextResponse.json({ versions });
}

export async function POST(req: NextRequest, ctx: Context) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { key } = await ctx.params;
  const body = await req.json();
  if (!body.content || !String(body.content).trim()) {
    return NextResponse.json({ error: 'content is required' }, { status: 400 });
  }

  const version = await createAiPromptVersion(key, body.content, session.email ?? null);
  return NextResponse.json({ version }, { status: 201 });
}
