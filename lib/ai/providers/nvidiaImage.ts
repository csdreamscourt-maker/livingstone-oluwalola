import type { ImageGenerationParams, ImageGenerationResult } from '../types';

const NVIDIA_GENAI_BASE = 'https://ai.api.nvidia.com/v1/genai';

/**
 * NVIDIA's hosted image models (Flux, Stable Diffusion, etc.) don't live on the same
 * OpenAI-compatible host as chat/embeddings (integrate.api.nvidia.com) and don't speak the
 * OpenAI images.generate() shape — they're invoked per-model at a Stability-AI-style REST
 * endpoint (ai.api.nvidia.com/v1/genai/{model}) that returns base64 image data directly,
 * not a hosted URL. Verified directly against black-forest-labs/flux.1-dev with a real key.
 */
export async function generateNvidiaImage(
  providerSlug: string,
  apiKey: string,
  model: string,
  params: ImageGenerationParams
): Promise<ImageGenerationResult> {
  const res = await fetch(`${NVIDIA_GENAI_BASE}/${model}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      prompt: params.prompt,
      cfg_scale: 3.5,
      width: 1024,
      height: 1024,
      seed: 0,
      steps: 30,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`NVIDIA image generation failed (${res.status}): ${text.slice(0, 300)}`);
  }

  const data = await res.json();
  const base64 = data?.artifacts?.[0]?.base64;
  if (!base64) throw new Error('NVIDIA image generation returned no image data');

  return { base64, contentType: 'image/jpeg', model, provider: providerSlug };
}
