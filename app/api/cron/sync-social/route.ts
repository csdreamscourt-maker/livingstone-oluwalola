import { NextRequest, NextResponse } from 'next/server';
import { getSecret } from '@/lib/secrets';
import { syncAllAutoConnections } from '@/lib/social/sync';

/** Scheduled endpoint for "Sync Automatically" connections — see vercel.json for the cron schedule. Vercel sends `Authorization: Bearer $CRON_SECRET` automatically for cron-triggered requests once CRON_SECRET is set on the project. */
export async function GET(req: NextRequest) {
  const secret = await getSecret('CRON_SECRET');
  if (!secret) {
    return NextResponse.json({ error: 'CRON_SECRET is not configured' }, { status: 503 });
  }

  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results = await syncAllAutoConnections();
  return NextResponse.json({ synced: results.length, results });
}
