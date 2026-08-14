export const AI_TASK_KEYS: { key: string; label: string; description: string }[] = [
  {
    key: 'dream_interpretation',
    label: 'Dream interpretation',
    description: 'Dream Lab discernment and dream journal AI interpretation (text/chat completions).',
  },
  {
    key: 'image_generation',
    label: 'Dream Lab image generation',
    description: 'Symbolic imagery generated for a dream in Dream Lab.',
  },
  {
    key: 'knowledge_search',
    label: 'Founder knowledge embedding',
    description: 'Embeds founder source text and dream queries for retrieval-augmented interpretation. Requires an embedding-capable model (e.g. OpenAI text-embedding-3-small).',
  },
];
