import { NextResponse } from 'next/server';
import { getPublicSiteSettings } from '@/lib/db';

// Public, non-sensitive site configuration (homepage copy, contact details,
// social links, the WhatsApp community link) that any page can read without
// admin privileges.
export async function GET() {
  const settings = await getPublicSiteSettings();
  return NextResponse.json(settings);
}
