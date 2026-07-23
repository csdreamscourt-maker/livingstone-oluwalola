import { NextRequest, NextResponse } from 'next/server';
import { createDreamSymbol, listDreamSymbols } from '@/lib/db';
import { requireAdminSession } from '@/lib/session';

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const symbols = await listDreamSymbols();
  return NextResponse.json({ symbols });
}

export async function POST(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  if (!body.term || !body.meaning) {
    return NextResponse.json({ error: 'term and meaning are required' }, { status: 400 });
  }

  const symbol = await createDreamSymbol({
    term: body.term,
    meaning: body.meaning,
    category: body.category,
    scripture_reference: body.scripture_reference,
  });

  return NextResponse.json({ symbol }, { status: 201 });
}
