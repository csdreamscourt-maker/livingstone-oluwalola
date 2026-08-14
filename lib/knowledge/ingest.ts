import 'server-only';
import {
  getKnowledgeSourceById,
  updateKnowledgeSource,
  deleteKnowledgeChunksForSource,
  insertKnowledgeChunk,
} from '@/lib/db';
import { runEmbedding } from '@/lib/ai/router';
import { chunkText } from './chunk';

const EMBEDDING_TASK_KEY = 'knowledge_search';

/**
 * Runs the ingest pipeline for a knowledge source: chunk → embed → index.
 * Re-ingesting a source (e.g. after editing full_text) replaces its chunks.
 */
export async function ingestKnowledgeSource(sourceId: string): Promise<{ chunkCount: number }> {
  const source = await getKnowledgeSourceById(sourceId);
  if (!source) {
    throw new Error('Knowledge source not found');
  }
  if (!source.full_text || !source.full_text.trim()) {
    throw new Error('This source has no text to ingest yet');
  }

  await updateKnowledgeSource(sourceId, { processing_status: 'processing', processing_error: null });

  try {
    const chunks = chunkText(source.full_text);
    if (chunks.length === 0) {
      throw new Error('No chunkable content found in this source');
    }

    await deleteKnowledgeChunksForSource(sourceId);

    for (let i = 0; i < chunks.length; i += 1) {
      const chunk = chunks[i];
      const { embedding } = await runEmbedding(EMBEDDING_TASK_KEY, chunk.content);
      await insertKnowledgeChunk(sourceId, i, chunk.content, embedding, chunk.page, chunk.chapter);
    }

    await updateKnowledgeSource(sourceId, { processing_status: 'indexed', processing_error: null });
    return { chunkCount: chunks.length };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ingestion failed';
    await updateKnowledgeSource(sourceId, { processing_status: 'failed', processing_error: message });
    throw error;
  }
}
