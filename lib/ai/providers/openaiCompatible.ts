import OpenAI from 'openai';
import type {
  ProviderClient,
  ChatCompletionParams,
  ChatCompletionResult,
  ImageGenerationParams,
  ImageGenerationResult,
  ConnectionTestResult,
  EmbeddingResult,
} from '../types';

/**
 * Works for OpenAI, NVIDIA NIM, Google's Gemini OpenAI-compatibility endpoint, and any
 * custom OpenAI-compatible provider — they all speak the same chat.completions shape,
 * differing only in apiKey/baseURL.
 */
export function createOpenAICompatibleClient(providerSlug: string, apiKey: string, baseURL?: string | null): ProviderClient {
  const client = new OpenAI({ apiKey, ...(baseURL ? { baseURL } : {}) });

  async function chatCompletion(model: string, params: ChatCompletionParams): Promise<ChatCompletionResult> {
    const completion = await client.chat.completions.create({
      model,
      messages: params.messages.map((m) => ({ role: m.role, content: m.content })),
      temperature: params.temperature,
      max_tokens: params.maxTokens,
      ...(params.responseFormat === 'json_object' ? { response_format: { type: 'json_object' as const } } : {}),
    });
    const content = completion.choices[0]?.message?.content ?? '';
    return { content, model: completion.model, provider: providerSlug };
  }

  async function generateImage(model: string, params: ImageGenerationParams): Promise<ImageGenerationResult> {
    const result = await client.images.generate({
      model,
      prompt: params.prompt,
      size: (params.size as '1024x1024' | '1792x1024' | '1024x1792' | undefined) ?? '1024x1024',
      n: 1,
    });
    const url = result.data?.[0]?.url;
    if (!url) throw new Error('No image returned');
    return { url, model, provider: providerSlug };
  }

  async function createEmbedding(model: string, text: string): Promise<EmbeddingResult> {
    const result = await client.embeddings.create({ model, input: text });
    const embedding = result.data?.[0]?.embedding;
    if (!embedding) throw new Error('No embedding returned');
    return { embedding, model, provider: providerSlug };
  }

  async function testConnection(model: string): Promise<ConnectionTestResult> {
    try {
      await client.chat.completions.create({
        model,
        messages: [{ role: 'user', content: 'ping' }],
        max_tokens: 5,
      });
      return { ok: true, message: 'Connected successfully' };
    } catch (err) {
      return { ok: false, message: err instanceof Error ? err.message : 'Connection failed' };
    }
  }

  return { chatCompletion, generateImage, createEmbedding, testConnection };
}
