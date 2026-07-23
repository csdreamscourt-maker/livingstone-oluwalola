import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { getSessionFromCookies } from '@/lib/session';
import { createDreamLabSession } from '@/lib/db';
import { getSecret } from '@/lib/secrets';

export async function POST(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { prompt, dreamId } = await req.json();
  if (!prompt || !String(prompt).trim()) {
    return NextResponse.json({ error: 'prompt is required' }, { status: 400 });
  }

  const apiKey = await getSecret('OPENAI_API_KEY');
  if (!apiKey) {
    return NextResponse.json({ error: 'AI discernment is not configured yet (missing OPENAI_API_KEY)' }, { status: 500 });
  }

  try {
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: `You are a dream discernment guide integrating scriptural wisdom, psychology, and neuroscience. A member of Dream Court shares the following dream. Offer a thoughtful, grounded discernment — themes, possible symbolic meaning, and a reflective question to sit with. Keep it warm and practical, not superstitious or fear-based.\n\nDream: ${prompt}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 700,
    });

    const interpretation = completion.choices[0].message.content ?? '';
    const dreamLabSession = await createDreamLabSession(session.sub, {
      dream_id: dreamId ?? null,
      prompt,
      interpretation,
    });

    return NextResponse.json({ session: dreamLabSession });
  } catch (error) {
    console.error('Dream Lab interpretation error:', error);
    return NextResponse.json({ error: 'Failed to discern this dream right now' }, { status: 500 });
  }
}
