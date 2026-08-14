import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/session';
import { updateDreamLabSessionImage } from '@/lib/db';
import { uploadToR2 } from '@/lib/storage/r2';
import { runImageGeneration } from '@/lib/ai/router';

export async function POST(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { sessionId, prompt } = await req.json();
  if (!sessionId || !prompt) {
    return NextResponse.json({ error: 'sessionId and prompt are required' }, { status: 400 });
  }

  try {
    const image = await runImageGeneration('image_generation', {
      prompt: `A symbolic, dreamlike visual for the following dream, evocative and painterly, no text or captions: ${prompt}`,
      size: '1024x1024',
    });

    let finalUrl = image.url;
    try {
      const imageResponse = await fetch(image.url);
      const buffer = Buffer.from(await imageResponse.arrayBuffer());
      finalUrl = await uploadToR2(buffer, `dream-lab/${session.sub}/${sessionId}.png`, 'image/png');
    } catch {
      // Storage isn't configured yet — fall back to the provider's temporary URL (may expire).
    }

    const dreamLabSession = await updateDreamLabSessionImage(sessionId, session.sub, finalUrl);
    return NextResponse.json({ session: dreamLabSession, persisted: finalUrl !== image.url });
  } catch (error) {
    console.error('Dream Lab image generation error:', error);
    const message = error instanceof Error && error.message.includes('configured')
      ? 'Image generation is not configured yet'
      : 'Failed to generate an image right now';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
