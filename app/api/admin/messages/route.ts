import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdminSession } from '@/lib/session';

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const result = await query('SELECT id, name, email, subject, message, created_at FROM contact_messages ORDER BY created_at DESC');
  return NextResponse.json({ messages: result.rows });
}
