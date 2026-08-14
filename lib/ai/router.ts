import 'server-only';
import OpenAI from 'openai';
import { getSecret, decryptSecret } from '@/lib/secrets';
import { getAiTaskAssignment, getAiModelWithProvider } from '@/lib/db';
import { createClientForKind } from './factory';
import type { ChatCompletionParams, ChatCompletionResult, ImageGenerationParams, ImageGenerationResult, ProviderClient } from './types';

async function resolveModelClient(modelId: string): Promise<{ client: ProviderClient; modelId: string } | null> {
  const row = await getAiModelWithProvider(modelId);
  if (!row || !row.model_enabled || !row.provider_enabled || !row.api_key_encrypted) return null;
  const apiKey = decryptSecret(row.api_key_encrypted);
  const client = createClientForKind(row.provider_kind, row.provider_slug, apiKey, row.base_url);
  return { client, modelId: row.model_id };
}

async function candidateModelIds(taskKey: string): Promise<string[]> {
  const assignment = await getAiTaskAssignment(taskKey);
  if (!assignment) return [];
  return [assignment.primary_model_id, ...(assignment.fallback_model_ids || [])].filter((id): id is string => Boolean(id));
}

async function legacyOpenAIChatCompletion(params: ChatCompletionParams): Promise<ChatCompletionResult> {
  const apiKey = await getSecret('OPENAI_API_KEY');
  if (!apiKey) throw new Error('No AI provider is configured for this task');
  const openai = new OpenAI({ apiKey });
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: params.messages.map((m) => ({ role: m.role, content: m.content })),
    temperature: params.temperature,
    max_tokens: params.maxTokens,
    ...(params.responseFormat === 'json_object' ? { response_format: { type: 'json_object' as const } } : {}),
  });
  return { content: completion.choices[0]?.message?.content ?? '', model: 'gpt-4o', provider: 'openai' };
}

async function legacyOpenAIImageGeneration(params: ImageGenerationParams): Promise<ImageGenerationResult> {
  const apiKey = await getSecret('OPENAI_API_KEY');
  if (!apiKey) throw new Error('No AI provider is configured for this task');
  const openai = new OpenAI({ apiKey });
  const result = await openai.images.generate({
    model: 'dall-e-3',
    prompt: params.prompt,
    size: (params.size as '1024x1024' | undefined) ?? '1024x1024',
    n: 1,
  });
  const url = result.data?.[0]?.url;
  if (!url) throw new Error('No image returned from OpenAI');
  return { url, model: 'dall-e-3', provider: 'openai' };
}

/**
 * Runs a chat completion for the given task, trying the admin-configured primary model,
 * then its fallback chain in order. If no admin routing is configured for the task yet
 * (fresh install), falls back to the original env-based OpenAI call so nothing regresses.
 */
export async function runChatCompletion(taskKey: string, params: ChatCompletionParams): Promise<ChatCompletionResult> {
  const candidates = await candidateModelIds(taskKey);

  let lastError: unknown;
  for (const modelId of candidates) {
    const resolved = await resolveModelClient(modelId);
    if (!resolved) continue;
    try {
      return await resolved.client.chatCompletion(resolved.modelId, params);
    } catch (err) {
      lastError = err;
    }
  }

  if (candidates.length > 0) {
    if (lastError) throw lastError;
    throw new Error('No enabled AI provider is configured for this task');
  }

  return legacyOpenAIChatCompletion(params);
}

export async function runImageGeneration(taskKey: string, params: ImageGenerationParams): Promise<ImageGenerationResult> {
  const candidates = await candidateModelIds(taskKey);

  let lastError: unknown;
  for (const modelId of candidates) {
    const resolved = await resolveModelClient(modelId);
    if (!resolved || !resolved.client.generateImage) continue;
    try {
      return await resolved.client.generateImage(resolved.modelId, params);
    } catch (err) {
      lastError = err;
    }
  }

  if (candidates.length > 0) {
    if (lastError) throw lastError;
    throw new Error('No enabled image-generation AI provider is configured for this task');
  }

  return legacyOpenAIImageGeneration(params);
}
