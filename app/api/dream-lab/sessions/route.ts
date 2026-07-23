import { NextResponse } from 'next/server';
import { listDreamLabSessionsByUser } from '@/lib/db';
import { getSessionFromCookies } from '@/lib/session';

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sessions = await listDreamLabSessionsByUser(session.sub);
  return NextResponse.json({ sessions });
}
