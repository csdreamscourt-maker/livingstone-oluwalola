import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/session';
import { createDreamLabSession } from '@/lib/db';
import { runChatCompletion } from '@/lib/ai/router';
import { buildFounderGroundedMessages } from '@/lib/knowledge/prompt';

export async function POST(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { prompt, dreamId } = await req.json();
  if (!prompt || !String(prompt).trim()) {
    return NextResponse.json({ error: 'prompt is required' }, { status: 400 });
  }

  try {
    const messages = await buildFounderGroundedMessages(
      prompt,
      `A member of Dream Court shares the following dream. Offer a thoughtful, grounded discernment following the ground rules you were given.\n\nDream: ${prompt}`
    );

    const completion = await runChatCompletion('dream_interpretation', {
      messages,
      temperature: 0.7,
      maxTokens: 800,
    });

    const dreamLabSession = await createDreamLabSession(session.sub, {
      dream_id: dreamId ?? null,
      prompt,
      interpretation: completion.content,
    });

    return NextResponse.json({ session: dreamLabSession });
  } catch (error) {
    console.error('Dream Lab interpretation error:', error);
    const message = error instanceof Error && error.message.includes('configured')
      ? 'AI discernment is not configured yet'
      : 'Failed to discern this dream right now';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
