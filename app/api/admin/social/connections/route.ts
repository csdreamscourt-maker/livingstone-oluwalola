import { NextRequest, NextResponse } from 'next/server';
import { listKnowledgeSyncConnections, createKnowledgeSyncConnection } from '@/lib/db';
import { requireAdminSession } from '@/lib/session';

const SYNCABLE_PLATFORMS = ['substack', 'youtube'];

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const connections = await listKnowledgeSyncConnections();
  return NextResponse.json({ connections });
}

export async function POST(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  if (!body.label || !SYNCABLE_PLATFORMS.includes(body.platform) || !body.feed_url) {
    return NextResponse.json({ error: 'label, platform (substack/youtube), and feed_url are required' }, { status: 400 });
  }

  const connection = await createKnowledgeSyncConnection({
    platform: body.platform,
    label: body.label,
    feed_url: body.feed_url,
    auto_sync: Boolean(body.auto_sync),
  });

  return NextResponse.json({ connection }, { status: 201 });
}
