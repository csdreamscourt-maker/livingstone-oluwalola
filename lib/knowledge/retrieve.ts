import 'server-only';
import { searchKnowledgeChunks } from '@/lib/db';
import { runEmbedding } from '@/lib/ai/router';
import type { KnowledgeChunkMatch } from '@/types/database';

const EMBEDDING_TASK_KEY = 'knowledge_search';

/**
 * Semantic search over the founder knowledge corpus (published sources only).
 * Returns the most relevant chunks with full source attribution so callers can
 * cite them (e.g. "According to Demystifying Dreams...").
 */
export async function searchFounderKnowledge(query: string, limit = 6, includeUnpublished = false): Promise<KnowledgeChunkMatch[]> {
  if (!query.trim()) return [];
  try {
    const { embedding } = await runEmbedding(EMBEDDING_TASK_KEY, query);
    return await searchKnowledgeChunks(embedding, limit, includeUnpublished);
  } catch (error) {
    // Knowledge retrieval is an enhancement, not a hard dependency — if no embedding
    // provider is configured yet, interpretation should still work without grounding.
    console.error('Founder knowledge search unavailable (non-fatal):', error instanceof Error ? error.message : error);
    return [];
  }
}

/** Formats retrieved chunks into a citation-bearing block to inject into a prompt. */
export function formatKnowledgeContext(matches: KnowledgeChunkMatch[]): string {
  if (matches.length === 0) return '';
  return matches
    .map((match, index) => {
      const citation = [match.source_title, match.source_author].filter(Boolean).join(', by ');
      const pageNote = match.page ? `, p.${match.page}` : '';
      return `[${index + 1}] (${citation}${pageNote}) "${match.content}"`;
    })
    .join('\n\n');
}
