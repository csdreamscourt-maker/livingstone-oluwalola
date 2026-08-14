import { createOpenAICompatibleClient } from './providers/openaiCompatible';
import { createAnthropicClient } from './providers/anthropic';
import { generateNvidiaImage } from './providers/nvidiaImage';
import type { ProviderClient } from './types';

const DEFAULT_BASE_URLS: Record<string, string | undefined> = {
  nvidia: 'https://integrate.api.nvidia.com/v1',
  google: 'https://generativelanguage.googleapis.com/v1beta/openai/',
};

export function createClientForKind(kind: string, slug: string, apiKey: string, baseURL?: string | null): ProviderClient {
  if (kind === 'anthropic') {
    return createAnthropicClient(apiKey, baseURL);
  }
  const client = createOpenAICompatibleClient(slug, apiKey, baseURL ?? DEFAULT_BASE_URLS[kind] ?? null);
  if (kind === 'nvidia') {
    // NVIDIA's chat/embeddings are OpenAI-compatible, but image generation lives on a
    // separate, differently-shaped endpoint — see providers/nvidiaImage.ts.
    return { ...client, generateImage: (model, params) => generateNvidiaImage(slug, apiKey, model, params) };
  }
  return client;
}
