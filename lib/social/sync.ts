import 'server-only';
import {
  getKnowledgeSyncConnectionById,
  updateKnowledgeSyncConnection,
  findKnowledgeSourceByExternalId,
  createKnowledgeSource,
  listKnowledgeSyncConnections,
} from '@/lib/db';
import { parseSubstackFeed, parseYoutubeFeed } from './feedParser';

function toPublicationDate(raw: string | null): string | null {
  if (!raw) return null;
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

const YOUTUBE_TRANSCRIPT_NOTE =
  '[Auto-imported from the YouTube video feed — title and description only. YouTube does not expose transcripts to a public feed, so open this video\'s "Show transcript" panel on YouTube, copy the text, and paste it below (replacing or appending to this note) before ingesting this source.]';

export type SyncResult = {
  status: 'ok' | 'failed';
  message: string;
  newCount: number;
  failedCount: number;
};

/** Fetches a connection's feed, creates knowledge_sources for any items not seen before, and records the outcome on the connection itself. */
export async function syncConnection(connectionId: string): Promise<SyncResult> {
  const connection = await getKnowledgeSyncConnectionById(connectionId);
  if (!connection) {
    throw new Error('Sync connection not found');
  }
  if (connection.platform !== 'substack' && connection.platform !== 'youtube') {
    throw new Error(`${connection.platform} has no public feed to sync — add content manually instead`);
  }
  if (!connection.feed_url) {
    throw new Error('This connection has no feed URL configured');
  }

  let newCount = 0;
  let failedCount = 0;

  try {
    const res = await fetch(connection.feed_url, { headers: { 'User-Agent': 'DreamscourtKnowledgeSync/1.0' } });
    if (!res.ok) {
      throw new Error(`Feed request failed with status ${res.status}`);
    }
    const xml = await res.text();

    if (connection.platform === 'substack') {
      const items = parseSubstackFeed(xml);
      for (const item of items) {
        try {
          const existing = await findKnowledgeSourceByExternalId(connectionId, item.externalId);
          if (existing) continue;
          await createKnowledgeSource({
            title: item.title,
            author: item.author,
            source_type: 'article',
            tier: 2,
            publication_date: toPublicationDate(item.publishedAt),
            url: item.link,
            full_text: item.contentText,
            sync_connection_id: connectionId,
            external_id: item.externalId,
            platform: 'substack',
            processing_status: 'pending',
          });
          newCount += 1;
        } catch (itemError) {
          console.error('Substack item ingest failed:', itemError);
          failedCount += 1;
        }
      }
    } else {
      const items = parseYoutubeFeed(xml);
      for (const item of items) {
        try {
          const existing = await findKnowledgeSourceByExternalId(connectionId, item.externalId);
          if (existing) continue;
          await createKnowledgeSource({
            title: item.title,
            source_type: 'video_transcript',
            tier: 2,
            publication_date: toPublicationDate(item.publishedAt),
            url: item.link,
            full_text: `${item.title}\n\n${item.description}\n\n${YOUTUBE_TRANSCRIPT_NOTE}`,
            sync_connection_id: connectionId,
            external_id: item.externalId,
            platform: 'youtube',
            processing_status: 'needs_review',
          });
          newCount += 1;
        } catch (itemError) {
          console.error('YouTube item ingest failed:', itemError);
          failedCount += 1;
        }
      }
    }

    const message = `Synced OK — ${newCount} new, ${failedCount} failed.`;
    await updateKnowledgeSyncConnection(connectionId, {
      last_synced_at: new Date().toISOString(),
      last_sync_status: 'ok',
      last_sync_message: message,
      new_content_count: newCount,
      failed_content_count: failedCount,
    });
    return { status: 'ok', message, newCount, failedCount };
  } catch (error) {
    const message = error instanceof Error ? error.message.slice(0, 500) : 'Sync failed';
    await updateKnowledgeSyncConnection(connectionId, {
      last_synced_at: new Date().toISOString(),
      last_sync_status: 'failed',
      last_sync_message: message,
      new_content_count: newCount,
      failed_content_count: failedCount,
    });
    return { status: 'failed', message, newCount, failedCount };
  }
}

/** Runs syncConnection for every connection with auto_sync enabled — used by the scheduled cron endpoint. */
export async function syncAllAutoConnections(): Promise<{ connectionId: string; result: SyncResult }[]> {
  const connections = await listKnowledgeSyncConnections();
  const autoConnections = connections.filter((c) => c.auto_sync && (c.platform === 'substack' || c.platform === 'youtube'));

  const results: { connectionId: string; result: SyncResult }[] = [];
  for (const connection of autoConnections) {
    const result = await syncConnection(connection.id);
    results.push({ connectionId: connection.id, result });
  }
  return results;
}
