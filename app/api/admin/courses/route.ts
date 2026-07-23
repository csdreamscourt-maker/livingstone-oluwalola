import { NextRequest, NextResponse } from 'next/server';
import { createCourse, listCourses } from '@/lib/db';
import { requireAdminSession } from '@/lib/session';

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const courses = await listCourses(false);
  return NextResponse.json({ courses });
}

export async function POST(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  if (!body.title || !body.slug) {
    return NextResponse.json({ error: 'title and slug are required' }, { status: 400 });
  }

  const course = await createCourse({
    title: body.title,
    slug: body.slug,
    description: body.description,
    price_display: body.price_display,
    selar_url: body.selar_url,
    thumbnail_url: body.thumbnail_url,
    is_published: body.is_published,
  });

  return NextResponse.json({ course }, { status: 201 });
}
