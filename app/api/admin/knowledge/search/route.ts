import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/session';
import { searchFounderKnowledge } from '@/lib/knowledge/retrieve';

export async function GET(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const q = req.nextUrl.searchParams.get('q') ?? '';
  if (!q.trim()) {
    return NextResponse.json({ matches: [] });
  }

  const matches = await searchFounderKnowledge(q, 10, true);
  return NextResponse.json({ matches });
}
