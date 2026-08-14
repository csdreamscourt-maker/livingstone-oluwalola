import { NextResponse } from 'next/server';
import { listAiPromptSlots, ensureAiPromptSlot, getPublishedPromptContent } from '@/lib/db';
import { requireAdminSession } from '@/lib/session';
import { AI_PROMPT_SLOTS } from '@/lib/ai/promptSlots';

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  for (const registered of AI_PROMPT_SLOTS) {
    await ensureAiPromptSlot(registered.key, registered.label, registered.description);
  }

  const slots = await listAiPromptSlots();
  const withContent = await Promise.all(
    slots.map(async (slot) => ({ ...slot, published_content: await getPublishedPromptContent(slot.key) }))
  );

  return NextResponse.json({ slots: withContent });
}
