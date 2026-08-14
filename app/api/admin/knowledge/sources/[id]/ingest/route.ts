import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/session';
import { ingestKnowledgeSource } from '@/lib/knowledge/ingest';

type Context = { params: Promise<{ id: string }> };

export async function POST(_req: NextRequest, ctx: Context) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await ctx.params;
  try {
    const { chunkCount } = await ingestKnowledgeSource(id);
    return NextResponse.json({ ok: true, chunkCount });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ingestion failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
