import { NextResponse } from 'next/server';
import { getAdminOverviewStats } from '@/lib/db';
import { requireAdminSession } from '@/lib/session';

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const stats = await getAdminOverviewStats();
  return NextResponse.json({ stats });
}
