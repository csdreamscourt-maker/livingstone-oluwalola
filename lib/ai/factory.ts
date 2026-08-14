import { createOpenAICompatibleClient } from './providers/openaiCompatible';
import { createAnthropicClient } from './providers/anthropic';
import type { ProviderClient } from './types';

const DEFAULT_BASE_URLS: Record<string, string | undefined> = {
  nvidia: 'https://integrate.api.nvidia.com/v1',
  google: 'https://generativelanguage.googleapis.com/v1beta/openai/',
};

export function createClientForKind(kind: string, slug: string, apiKey: string, baseURL?: string | null): ProviderClient {
  if (kind === 'anthropic') {
    return createAnthropicClient(apiKey, baseURL);
  }
  return createOpenAICompatibleClient(slug, apiKey, baseURL ?? DEFAULT_BASE_URLS[kind] ?? null);
}
