import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/session';
import { SECRET_KEYS, listConfiguredSecrets, setSecret, clearSecret } from '@/lib/secrets';

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const secrets = await listConfiguredSecrets();
  return NextResponse.json({ secrets });
}

export async function PATCH(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { key, value } = await req.json();
  if (!key || !SECRET_KEYS.includes(key)) {
    return NextResponse.json({ error: 'Unknown secret key' }, { status: 400 });
  }

  if (!value || !String(value).trim()) {
    await clearSecret(key);
  } else {
    await setSecret(key, String(value).trim());
  }

  return NextResponse.json({ ok: true });
}
