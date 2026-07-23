import { NextRequest, NextResponse } from 'next/server';
import { createFramework, listFrameworks } from '@/lib/db';
import { requireAdminSession } from '@/lib/session';

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const frameworks = await listFrameworks(false);
  return NextResponse.json({ frameworks });
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

  const framework = await createFramework({
    slug: body.slug,
    title: body.title,
    description: body.description,
    category: body.category,
    overview: body.overview,
    applications: body.applications,
    is_published: body.is_published,
  });

  return NextResponse.json({ framework }, { status: 201 });
}
