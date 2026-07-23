import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { getSessionFromCookies } from '@/lib/session';
import { getDreamById, upsertDreamInterpretation } from '@/lib/db';
import { getSecret } from '@/lib/secrets';

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

  const apiKey = await getSecret('OPENAI_API_KEY');
  if (!apiKey) {
    return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
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
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: 'json_object' },
    });

    const responseText = completion.choices[0].message.content;
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    const parsed = JSON.parse(responseText);

    const saved = await upsertDreamInterpretation(dreamId, session.sub, {
      interpretation: parsed.interpretation,
      key_themes: parsed.key_themes,
      symbolic_meanings: parsed.symbolic_meanings,
      psychological_insights: parsed.psychological_insights,
      biblical_references: parsed.biblical_references,
      confidence_score: parsed.confidence_score,
      model_used: 'gpt-4o',
    });

    return NextResponse.json({ interpretation: saved });
  } catch (error) {
    console.error('Dream interpretation error:', error);
    return NextResponse.json({ error: 'Failed to interpret dream' }, { status: 500 });
  }
}
