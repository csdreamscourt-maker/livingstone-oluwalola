import { NextRequest, NextResponse } from 'next/server';
import { createCompany, listCompanies } from '@/lib/db';
import { requireAdminSession } from '@/lib/session';

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const companies = await listCompanies(false);
  return NextResponse.json({ companies });
}

export async function POST(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  if (!body.name || !body.slug) {
    return NextResponse.json({ error: 'name and slug are required' }, { status: 400 });
  }

  const company = await createCompany({
    slug: body.slug,
    name: body.name,
    description: body.description,
    category: body.category,
    tagline: body.tagline,
    summary: body.summary,
    highlights: body.highlights,
    logo_url: body.logo_url,
    is_published: body.is_published,
  });

  return NextResponse.json({ company }, { status: 201 });
}
