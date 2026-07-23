import { NextResponse } from 'next/server';
import { listFrameworks } from '@/lib/db';

export async function GET() {
  const frameworks = await listFrameworks(true);
  return NextResponse.json({ frameworks });
}
