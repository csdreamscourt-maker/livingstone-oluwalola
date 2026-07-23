import { NextResponse } from 'next/server';
import { getSiteSetting } from '@/lib/db';

// Public, non-sensitive site configuration (e.g. the WhatsApp community link)
// that any signed-in Dreamscourt page can read without admin privileges.
export async function GET() {
  const whatsapp = await getSiteSetting('whatsapp_community_link');
  return NextResponse.json({
    whatsapp_community_link: whatsapp?.value ?? null,
  });
}
