import { NextResponse } from 'next/server';
import { listDreamArticles } from '@/lib/db';
import { getSessionFromCookies } from '@/lib/session';

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const articles = await listDreamArticles(true);
  return NextResponse.json({ articles });
}
