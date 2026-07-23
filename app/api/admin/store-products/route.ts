import { NextRequest, NextResponse } from 'next/server';
import { createStoreProduct, listStoreProducts } from '@/lib/db';
import { requireAdminSession } from '@/lib/session';

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const products = await listStoreProducts(false);
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  if (!body.title) {
    return NextResponse.json({ error: 'title is required' }, { status: 400 });
  }

  const product = await createStoreProduct({
    title: body.title,
    description: body.description,
    price_display: body.price_display,
    selar_url: body.selar_url,
    cover_image_url: body.cover_image_url,
    is_published: body.is_published,
  });

  return NextResponse.json({ product }, { status: 201 });
}
