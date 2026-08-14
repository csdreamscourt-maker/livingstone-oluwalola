import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/session';
import { createDreamLabSession } from '@/lib/db';
import { runChatCompletion } from '@/lib/ai/router';

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
    const completion = await runChatCompletion('dream_interpretation', {
      messages: [
        {
          role: 'user',
          content: `You are a dream discernment guide integrating scriptural wisdom, psychology, and neuroscience. A member of Dream Court shares the following dream. Offer a thoughtful, grounded discernment — themes, possible symbolic meaning, and a reflective question to sit with. Keep it warm and practical, not superstitious or fear-based.\n\nDream: ${prompt}`,
        },
      ],
      temperature: 0.7,
      maxTokens: 700,
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
