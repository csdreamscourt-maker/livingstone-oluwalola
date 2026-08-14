import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/session';
import { getDreamById, upsertDreamInterpretation } from '@/lib/db';
import { runChatCompletion } from '@/lib/ai/router';

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

  const prompt = `You are a thoughtful dream interpretation expert with knowledge of psychology, spirituality, and symbolism. Analyze the following dream and provide:
1. A comprehensive interpretation
2. Key themes and patterns
3. Symbolic meanings
4. Psychological insights
5. Any relevant biblical references if applicable

Dream: ${dreamContent}

Respond with JSON only, in this exact shape:
{
  "interpretation": "...",
  "key_themes": ["theme1", "theme2"],
  "symbolic_meanings": "...",
  "psychological_insights": "...",
  "biblical_references": ["reference1", "reference2"],
  "confidence_score": 0.85
}`;

  try {
    const completion = await runChatCompletion('dream_interpretation', {
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      maxTokens: 1000,
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

    return NextResponse.json({ interpretation: saved });
  } catch (error) {
    console.error('Dream interpretation error:', error);
    return NextResponse.json({ error: 'Failed to interpret dream' }, { status: 500 });
  }
}
