import { NextRequest, NextResponse } from 'next/server';
import { listAiModels, createAiModel } from '@/lib/db';
import { requireAdminSession } from '@/lib/session';

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const models = await listAiModels();
  return NextResponse.json({ models });
}

export async function POST(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  if (!body.provider_id || !body.model_id || !body.display_name) {
    return NextResponse.json({ error: 'provider_id, model_id, and display_name are required' }, { status: 400 });
  }

  const model = await createAiModel({
    provider_id: body.provider_id,
    model_id: body.model_id,
    display_name: body.display_name,
    supports_text: body.supports_text,
    supports_vision: body.supports_vision,
    supports_image_generation: body.supports_image_generation,
    supports_embeddings: body.supports_embeddings,
    context_window: body.context_window || null,
    cost_tier: body.cost_tier || null,
    enabled: body.enabled,
  });

  return NextResponse.json({ model }, { status: 201 });
}
