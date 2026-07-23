import { NextRequest, NextResponse } from 'next/server';
import { getCourseBySlug } from '@/lib/db';
import { getSessionFromCookies } from '@/lib/session';

type Context = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, ctx: Context) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug } = await ctx.params;
  const course = await getCourseBySlug(slug);
  if (!course || !course.is_published) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 });
  }

  return NextResponse.json({ course });
}
