import { OpenAI } from 'openai';

export async function POST(request: Request) {
  try {
    const { dreamId, userId, dreamContent } = await request.json();

    if (!dreamId || !userId || !dreamContent) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return Response.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `You are a thoughtful dream interpretation expert with knowledge of psychology, spirituality, and symbolism. Analyze the following dream and provide:
1. A comprehensive interpretation
2. Key themes and patterns
3. Symbolic meanings
4. Psychological insights
5. Any relevant biblical references if applicable

Dream: ${dreamContent}

Please format your response as JSON with the following structure:
{
  "interpretation": "...",
  "key_themes": ["theme1", "theme2", ...],
  "symbolic_meanings": "...",
  "psychological_insights": "...",
  "biblical_references": ["reference1", "reference2", ...],
  "confidence_score": 0.85
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const responseText = completion.choices[0].message.content;
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    const interpretation = JSON.parse(responseText);

    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return Response.json({ error: 'Database not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from('dream_interpretations')
      .insert([
        {
          dream_id: dreamId,
          user_id: userId,
          interpretation: interpretation.interpretation,
          key_themes: interpretation.key_themes,
          symbolic_meanings: interpretation.symbolic_meanings,
          psychological_insights: interpretation.psychological_insights,
          biblical_references: interpretation.biblical_references,
          confidence_score: interpretation.confidence_score,
          model_used: 'gpt-4',
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return Response.json(data);
  } catch (error) {
    console.error('Dream interpretation error:', error);
    return Response.json({ error: 'Failed to interpret dream' }, { status: 500 });
  }
}
