import { NextRequest, NextResponse } from 'next/server';
import { listAiProviders, createAiProvider } from '@/lib/db';
import { requireAdminSession } from '@/lib/session';
import { encryptSecret } from '@/lib/secrets';

const VALID_KINDS = ['openai', 'anthropic', 'google', 'nvidia', 'custom'];

function toSafeProvider(provider: Awaited<ReturnType<typeof listAiProviders>>[number]) {
  const { api_key_encrypted, ...rest } = provider;
  return { ...rest, has_api_key: Boolean(api_key_encrypted) };
}

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const providers = await listAiProviders();
  return NextResponse.json({ providers: providers.map(toSafeProvider) });
}

export async function POST(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  if (!body.slug || !body.name || !VALID_KINDS.includes(body.kind)) {
    return NextResponse.json({ error: 'slug, name, and a valid kind are required' }, { status: 400 });
  }

  const provider = await createAiProvider({
    slug: body.slug,
    name: body.name,
    kind: body.kind,
    base_url: body.base_url || null,
    api_key_encrypted: body.api_key ? encryptSecret(body.api_key) : null,
    enabled: body.enabled,
  });

  return NextResponse.json({ provider: toSafeProvider(provider) }, { status: 201 });
}
