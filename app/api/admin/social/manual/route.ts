import { NextRequest, NextResponse } from 'next/server';
import { createKnowledgeSource } from '@/lib/db';
import { requireAdminSession } from '@/lib/session';

const MANUAL_PLATFORMS = ['tiktok', 'instagram'];

export async function POST(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  if (!body.title || !MANUAL_PLATFORMS.includes(body.platform) || !body.content) {
    return NextResponse.json({ error: 'title, platform (tiktok/instagram), and content are required' }, { status: 400 });
  }

  const source = await createKnowledgeSource({
    title: body.title,
    source_type: 'social_post',
    tier: 2,
    url: body.url || null,
    full_text: body.content,
    platform: body.platform,
    processing_status: 'pending',
  });

  return NextResponse.json({ source }, { status: 201 });
}
