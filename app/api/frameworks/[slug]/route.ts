import { NextRequest, NextResponse } from 'next/server';
import { getFrameworkBySlug } from '@/lib/db';

type Context = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, ctx: Context) {
  const { slug } = await ctx.params;
  const framework = await getFrameworkBySlug(slug);
  if (!framework || !framework.is_published) {
    return NextResponse.json({ error: 'Framework not found' }, { status: 404 });
  }
  return NextResponse.json({ framework });
}
