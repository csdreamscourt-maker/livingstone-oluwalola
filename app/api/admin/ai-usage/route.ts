import { NextRequest, NextResponse } from 'next/server';
import { getAiUsageSummary, listRecentAiUsage, purgeAiUsageLogsOlderThan } from '@/lib/db';
import { requireAdminSession } from '@/lib/session';

export async function GET(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const sinceHours = Number(req.nextUrl.searchParams.get('hours')) || 24;
  const [summary, recent] = await Promise.all([getAiUsageSummary(sinceHours), listRecentAiUsage(30)]);
  return NextResponse.json({ summary, recent });
}

export async function DELETE(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const days = Number(req.nextUrl.searchParams.get('olderThanDays')) || 90;
  const deleted = await purgeAiUsageLogsOlderThan(days);
  return NextResponse.json({ ok: true, deleted });
}
