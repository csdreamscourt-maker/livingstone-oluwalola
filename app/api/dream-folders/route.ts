import { NextRequest, NextResponse } from 'next/server';
import { createDreamFolder, getDreamFoldersByUser } from '@/lib/db';
import { getSessionFromCookies } from '@/lib/session';

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const folders = await getDreamFoldersByUser(session.sub);
  return NextResponse.json({ folders });
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name } = await req.json();
  if (!name || !String(name).trim()) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }

  const folder = await createDreamFolder(session.sub, String(name).trim());
  return NextResponse.json({ folder }, { status: 201 });
}
