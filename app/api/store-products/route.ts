import { NextResponse } from 'next/server';
import { listStoreProducts } from '@/lib/db';
import { getSessionFromCookies } from '@/lib/session';

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const products = await listStoreProducts(true);
  return NextResponse.json({ products });
}
