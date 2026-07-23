import { NextResponse } from 'next/server';
import { listIdeasArticles } from '@/lib/db';

export async function GET() {
  const articles = await listIdeasArticles(true);
  return NextResponse.json({ articles });
}
