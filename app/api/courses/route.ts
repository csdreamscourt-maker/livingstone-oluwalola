import { NextResponse } from 'next/server';
import { listCourses } from '@/lib/db';
import { getSessionFromCookies } from '@/lib/session';

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const courses = await listCourses(true);
  return NextResponse.json({ courses });
}
