import { NextRequest, NextResponse } from 'next/server';
import { createIdeasArticle, listIdeasArticles } from '@/lib/db';
import { requireAdminSession } from '@/lib/session';

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const articles = await listIdeasArticles(false);
  return NextResponse.json({ articles });
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

  const article = await createIdeasArticle({
    slug: body.slug,
    title: body.title,
    excerpt: body.excerpt,
    category: body.category,
    read_time: body.read_time,
    published_date: body.published_date,
    body: body.body,
    is_published: body.is_published,
  });

  return NextResponse.json({ article }, { status: 201 });
}
