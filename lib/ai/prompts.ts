import 'server-only';
import { getPublishedPromptContent } from '@/lib/db';

/** Reads a slot's published prompt content, falling back to the code-level default if the admin hasn't configured one (or the DB call fails). */
export async function getPrompt(key: string, fallback: string): Promise<string> {
  try {
    const published = await getPublishedPromptContent(key);
    return published ?? fallback;
  } catch (error) {
    console.error(`Failed to load prompt "${key}" from DB, using fallback:`, error instanceof Error ? error.message : error);
    return fallback;
  }
}
