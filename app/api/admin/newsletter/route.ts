import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdminSession } from '@/lib/session';

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const result = await query('SELECT id, email, is_subscribed, subscribed_at FROM newsletter_subscriptions ORDER BY subscribed_at DESC');
  return NextResponse.json({ subscribers: result.rows });
}
