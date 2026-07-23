import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/session';
import { uploadToR2 } from '@/lib/storage/r2';

export async function POST(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('audio');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'audio file is required' }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = file.type.includes('webm') ? 'webm' : file.type.includes('mp4') ? 'm4a' : 'ogg';
    const key = `voice-recordings/${session.sub}/${Date.now()}.${extension}`;
    const url = await uploadToR2(buffer, key, file.type || 'audio/webm');
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Voice upload error:', error);
    const message = error instanceof Error ? error.message : 'Failed to upload recording';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
