import { NextRequest, NextResponse } from 'next/server';
import { getAiProviderById, updateAiProvider } from '@/lib/db';
import { requireAdminSession } from '@/lib/session';
import { decryptSecret } from '@/lib/secrets';
import { createClientForKind } from '@/lib/ai/factory';

type Context = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, ctx: Context) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await ctx.params;
  const body = await req.json().catch(() => ({}));
  const model = typeof body.model === 'string' ? body.model.trim() : '';
  if (!model) {
    return NextResponse.json({ error: 'A model id is required to test this connection' }, { status: 400 });
  }

  const provider = await getAiProviderById(id);
  if (!provider) {
    return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
  }
  if (!provider.api_key_encrypted) {
    return NextResponse.json({ error: 'This provider has no API key configured yet' }, { status: 400 });
  }

  const apiKey = decryptSecret(provider.api_key_encrypted);
  const client = createClientForKind(provider.kind, provider.slug, apiKey, provider.base_url ?? null);
  const result = await client.testConnection(model);

  await updateAiProvider(id, {
    last_tested_at: new Date().toISOString(),
    last_test_ok: result.ok,
    last_test_message: result.message,
  });

  return NextResponse.json(result);
}
