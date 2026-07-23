import { NextRequest, NextResponse } from 'next/server';
import { getCompanyBySlug } from '@/lib/db';

type Context = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, ctx: Context) {
  const { slug } = await ctx.params;
  const company = await getCompanyBySlug(slug);
  if (!company || !company.is_published) {
    return NextResponse.json({ error: 'Company not found' }, { status: 404 });
  }
  return NextResponse.json({ company });
}
