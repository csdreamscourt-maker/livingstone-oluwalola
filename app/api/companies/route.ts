import { NextResponse } from 'next/server';
import { listCompanies } from '@/lib/db';

export async function GET() {
  const companies = await listCompanies(true);
  return NextResponse.json({ companies });
}
