import { NextRequest, NextResponse } from 'next/server';
import { getIdeasArticleBySlug } from '@/lib/db';

type Context = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, ctx: Context) {
  const { slug } = await ctx.params;
  const article = await getIdeasArticleBySlug(slug);
  if (!article || !article.is_published) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  }
  return NextResponse.json({ article });
}
