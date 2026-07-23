import { NextRequest, NextResponse } from 'next/server';
import { createDreamArticle, listDreamArticles } from '@/lib/db';
import { requireAdminSession } from '@/lib/session';

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const articles = await listDreamArticles(false);
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

  const article = await createDreamArticle({
    title: body.title,
    slug: body.slug,
    excerpt: body.excerpt,
    body: body.body,
    category: body.category,
    is_published: body.is_published,
  });

  return NextResponse.json({ article }, { status: 201 });
}
