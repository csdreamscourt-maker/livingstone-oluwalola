import { NextRequest, NextResponse } from 'next/server';
import { updateAiProvider, deleteAiProvider } from '@/lib/db';
import { requireAdminSession } from '@/lib/session';
import { encryptSecret } from '@/lib/secrets';

type Context = { params: Promise<{ id: string }> };

const ALLOWED_FIELDS = ['slug', 'name', 'kind', 'base_url', 'enabled'] as const;

function toSafeProvider<T extends { api_key_encrypted?: string | null }>(provider: T) {
  const { api_key_encrypted, ...rest } = provider;
  return { ...rest, has_api_key: Boolean(api_key_encrypted) };
}

export async function PATCH(req: NextRequest, ctx: Context) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await ctx.params;
  const body = await req.json();
  const updates: Record<string, unknown> = {};
  for (const field of ALLOWED_FIELDS) {
    if (field in body) updates[field] = body[field];
  }
  if ('api_key' in body) {
    updates.api_key_encrypted = body.api_key ? encryptSecret(body.api_key) : null;
  }

  const provider = await updateAiProvider(id, updates);
  if (!provider) {
    return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
  }

  return NextResponse.json({ provider: toSafeProvider(provider) });
}

export async function DELETE(_req: NextRequest, ctx: Context) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await ctx.params;
  await deleteAiProvider(id);
  return NextResponse.json({ ok: true });
}
