import { NextResponse } from 'next/server';
import { listUsers } from '@/lib/db';
import { requireAdminSession } from '@/lib/session';

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const users = await listUsers();
  return NextResponse.json({ users });
}
