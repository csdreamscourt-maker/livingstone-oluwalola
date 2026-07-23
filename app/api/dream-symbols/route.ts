import { NextResponse } from 'next/server';
import { listDreamSymbols } from '@/lib/db';
import { getSessionFromCookies } from '@/lib/session';

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const symbols = await listDreamSymbols();
  return NextResponse.json({ symbols });
}
