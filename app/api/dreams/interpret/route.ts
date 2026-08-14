import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/session';
import { getDreamById, upsertDreamInterpretation } from '@/lib/db';
import { runChatCompletion } from '@/lib/ai/router';
import { buildFounderGroundedMessages } from '@/lib/knowledge/prompt';
import { recordDreamElements } from '@/lib/memory/patterns';

export async function POST(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { dreamId } = await req.json();
  if (!dreamId) {
    return NextResponse.json({ error: 'dreamId is required' }, { status: 400 });
  }

  const dream = await getDreamById(session.sub, dreamId);
  if (!dream) {
    return NextResponse.json({ error: 'Dream not found' }, { status: 404 });
  }

  const dreamContent = [dream.title, dream.description, dream.content].filter(Boolean).join('\n\n');

  const userPrompt = `Analyze the following dream and respond with JSON only, in this exact shape:
{
  "interpretation": "a grounded discernment of the dream, following the ground rules you were given — note the dream's likely type (plain/complex) and sphere (intrinsic/extrinsic) where discernible, and be explicit about what remains uncertain",
  "key_themes": ["theme1", "theme2"],
  "symbolic_meanings": "how the dream's symbols may connect to each other and the whole dream — not a symbol-by-symbol dictionary lookup",
  "psychological_insights": "only if the dream shows signs of a natural or psychological origin (memory, body, ordinary thought) rather than a spiritual one — per the teaching that not every dream is a message; otherwise state that this appears spiritually significant rather than natural",
  "biblical_references": ["reference1", "reference2"],
  "confidence_score": 0.85,
  "elements": {
    "people": ["specific people or roles that appeared, e.g. \\"mother\\", \\"a stranger in uniform\\""],
    "places": ["distinct locations, e.g. \\"childhood home\\", \\"an unfamiliar city\\""],
    "numbers": ["any numbers that stood out"],
    "colors": ["colors that stood out"],
    "symbols": ["concrete symbolic objects or creatures, e.g. \\"snake\\", \\"locked door\\""],
    "emotions": ["the dreamer's felt emotions in the dream, e.g. \\"fear\\", \\"peace\\""]
  }
}

Keep confidence_score conservative — low when the dream is thin on detail or the founder's teaching doesn't clearly speak to it, higher only where there is real scriptural or textual grounding for the reading. For "elements", only list things actually present in this dream — short, concrete labels, not sentences; leave an array empty if nothing of that kind appears. These are recorded so future dreams from the same person can be checked for recurrence — they are a factual inventory, not an interpretation.

Dream: ${dreamContent}`;

  try {
    const messages = await buildFounderGroundedMessages(dreamContent, userPrompt, session.sub);

    const completion = await runChatCompletion('dream_interpretation', {
      messages,
      temperature: 0.7,
      maxTokens: 1200,
      responseFormat: 'json_object',
    });

    if (!completion.content) {
      throw new Error('No response from AI provider');
    }

    const parsed = JSON.parse(completion.content);

    const saved = await upsertDreamInterpretation(dreamId, session.sub, {
      interpretation: parsed.interpretation,
      key_themes: parsed.key_themes,
      symbolic_meanings: parsed.symbolic_meanings,
      psychological_insights: parsed.psychological_insights,
      biblical_references: parsed.biblical_references,
      confidence_score: parsed.confidence_score,
      model_used: completion.model,
    });

    try {
      await recordDreamElements(dreamId, session.sub, parsed.elements);
    } catch (error) {
      console.error('Recording dream elements failed (non-fatal):', error);
    }

    return NextResponse.json({ interpretation: saved });
  } catch (error) {
    console.error('Dream interpretation error:', error);
    return NextResponse.json({ error: 'Failed to interpret dream' }, { status: 500 });
  }
}
