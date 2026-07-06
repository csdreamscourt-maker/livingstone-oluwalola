import { NextRequest, NextResponse } from 'next/server';
import { createJournalEntry, getJournalEntriesByUser } from '@/lib/db';
import { getSessionFromCookies } from '@/lib/session';

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const entries = await getJournalEntriesByUser(session.sub);
  return NextResponse.json({ entries });
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  if (!body.title || !body.content || !body.date_prayed) {
    return NextResponse.json({ error: 'title, content and date_prayed are required' }, { status: 400 });
  }

  const entry = await createJournalEntry(session.sub, {
    title: body.title,
    content: body.content,
    prayer_type: body.prayer_type,
    date_prayed: body.date_prayed,
    tags: body.tags,
  });

  return NextResponse.json({ entry }, { status: 201 });
}
