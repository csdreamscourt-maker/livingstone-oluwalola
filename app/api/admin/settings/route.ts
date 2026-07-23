import { NextRequest, NextResponse } from 'next/server';
import { listSiteSettings, setSiteSetting } from '@/lib/db';
import { requireAdminSession } from '@/lib/session';

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const settings = await listSiteSettings();
  return NextResponse.json({ settings });
}

export async function PATCH(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { key, value } = await req.json();
  if (!key) {
    return NextResponse.json({ error: 'key is required' }, { status: 400 });
  }

  const setting = await setSiteSetting(key, value ?? '');
  return NextResponse.json({ setting });
}
