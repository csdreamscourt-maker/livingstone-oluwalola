import { NextRequest, NextResponse } from 'next/server';
import { listKnowledgeSources, createKnowledgeSource } from '@/lib/db';
import { requireAdminSession } from '@/lib/session';

const VALID_SOURCE_TYPES = ['book', 'journal', 'article', 'sermon', 'video_transcript', 'audio_transcript', 'social_post', 'document'];

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const sources = await listKnowledgeSources();
  return NextResponse.json({ sources });
}

export async function POST(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  if (!body.title || !VALID_SOURCE_TYPES.includes(body.source_type)) {
    return NextResponse.json({ error: 'title and a valid source_type are required' }, { status: 400 });
  }

  const source = await createKnowledgeSource({
    title: body.title,
    author: body.author || null,
    source_type: body.source_type,
    tier: body.tier ? Number(body.tier) : undefined,
    publication_date: body.publication_date || null,
    url: body.url || null,
    description: body.description || null,
    full_text: body.full_text || null,
    topics: Array.isArray(body.topics) ? body.topics : null,
    tags: Array.isArray(body.tags) ? body.tags : null,
    scripture_references: Array.isArray(body.scripture_references) ? body.scripture_references : null,
    framework_categories: Array.isArray(body.framework_categories) ? body.framework_categories : null,
  });

  return NextResponse.json({ source }, { status: 201 });
}
