import Anthropic from '@anthropic-ai/sdk';
import type { ProviderClient, ChatCompletionParams, ChatCompletionResult, ConnectionTestResult } from '../types';

export function createAnthropicClient(apiKey: string, baseURL?: string | null): ProviderClient {
  const client = new Anthropic({ apiKey, ...(baseURL ? { baseURL } : {}) });

  async function chatCompletion(model: string, params: ChatCompletionParams): Promise<ChatCompletionResult> {
    const systemText = params.messages
      .filter((m) => m.role === 'system')
      .map((m) => m.content)
      .join('\n\n');
    const conversation = params.messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    let system = systemText || undefined;
    if (params.responseFormat === 'json_object') {
      system = `${system ? `${system}\n\n` : ''}Respond with valid JSON only — no other text before or after.`;
    }

    const response = await client.messages.create({
      model,
      max_tokens: params.maxTokens ?? 4096,
      system,
      messages: conversation,
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    return {
      content: textBlock && textBlock.type === 'text' ? textBlock.text : '',
      model: response.model,
      provider: 'anthropic',
    };
  }

  async function testConnection(model: string): Promise<ConnectionTestResult> {
    try {
      await client.messages.create({
        model,
        max_tokens: 8,
        messages: [{ role: 'user', content: 'ping' }],
      });
      return { ok: true, message: 'Connected successfully' };
    } catch (err) {
      return { ok: false, message: err instanceof Error ? err.message : 'Connection failed' };
    }
  }

  return { chatCompletion, testConnection };
}
