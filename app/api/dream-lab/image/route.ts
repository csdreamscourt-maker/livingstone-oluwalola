import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { getSessionFromCookies } from '@/lib/session';
import { updateDreamLabSessionImage } from '@/lib/db';
import { uploadToR2 } from '@/lib/storage/r2';

export async function POST(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { sessionId, prompt } = await req.json();
  if (!sessionId || !prompt) {
    return NextResponse.json({ error: 'sessionId and prompt are required' }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'Image generation is not configured yet (missing OPENAI_API_KEY)' }, { status: 500 });
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const result = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `A symbolic, dreamlike visual for the following dream, evocative and painterly, no text or captions: ${prompt}`,
      size: '1024x1024',
      n: 1,
    });

    const openaiUrl = result.data?.[0]?.url;
    if (!openaiUrl) {
      throw new Error('No image returned from OpenAI');
    }

    let finalUrl = openaiUrl;
    try {
      const imageResponse = await fetch(openaiUrl);
      const buffer = Buffer.from(await imageResponse.arrayBuffer());
      finalUrl = await uploadToR2(buffer, `dream-lab/${session.sub}/${sessionId}.png`, 'image/png');
    } catch {
      // Storage isn't configured yet — fall back to OpenAI's temporary URL (expires in ~1 hour).
    }

    const dreamLabSession = await updateDreamLabSessionImage(sessionId, session.sub, finalUrl);
    return NextResponse.json({ session: dreamLabSession, persisted: finalUrl !== openaiUrl });
  } catch (error) {
    console.error('Dream Lab image generation error:', error);
    return NextResponse.json({ error: 'Failed to generate an image right now' }, { status: 500 });
  }
}
