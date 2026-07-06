import { NextRequest, NextResponse } from 'next/server';
import { createDream, getDreamsByUser } from '@/lib/db';
import { getSessionFromCookies } from '@/lib/session';

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const dreams = await getDreamsByUser(session.sub);
  return NextResponse.json({ dreams });
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  if (!body.title || !body.date_occurred) {
    return NextResponse.json({ error: 'title and date_occurred are required' }, { status: 400 });
  }

  const dream = await createDream(session.sub, {
    title: body.title,
    description: body.description,
    content: body.content,
    date_occurred: body.date_occurred,
    mood: body.mood,
    tags: body.tags,
    clarity: body.clarity,
    is_private: body.is_private,
  });

  return NextResponse.json({ dream }, { status: 201 });
}
