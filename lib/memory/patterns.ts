import 'server-only';
import { getRecurringPatternsForUser, replaceDreamElements, type DreamElementType, type DreamElementInput } from '@/lib/db';

export const ELEMENT_TYPES: DreamElementType[] = ['person', 'place', 'number', 'color', 'symbol', 'emotion'];

const ELEMENT_TYPE_LABELS: Record<DreamElementType, string> = {
  person: 'people',
  place: 'places',
  number: 'numbers',
  color: 'colors',
  symbol: 'symbols',
  emotion: 'emotions',
};

export type ExtractedElements = Partial<Record<DreamElementType, string[]>>;

/** Flattens the AI's `{people: [...], places: [...], ...}` shape into rows ready to persist. */
export function flattenElements(elements: ExtractedElements | undefined | null): DreamElementInput[] {
  if (!elements) return [];
  const rows: DreamElementInput[] = [];
  for (const type of ELEMENT_TYPES) {
    const key = ELEMENT_TYPE_LABELS[type] as keyof ExtractedElements;
    const values = elements[key];
    if (!Array.isArray(values)) continue;
    for (const raw of values) {
      const value = String(raw ?? '').trim();
      if (value) rows.push({ element_type: type, value });
    }
  }
  return rows;
}

/**
 * Builds a system-message block describing what has recurred across the dreamer's own
 * archive so far, for injection into an interpretation call. Fails soft — pattern lookup
 * must never break interpretation — and deliberately instructs the model not to treat
 * recurrence as proof of spiritual significance on its own.
 */
export async function buildPatternContext(userId: string): Promise<string> {
  try {
    const patterns = await getRecurringPatternsForUser(userId, 2, 8);
    if (patterns.length === 0) return '';

    const lines = patterns.map((p) => {
      const titles = p.dream_titles.slice(0, 3).join(', ');
      return `- ${p.element_type} "${p.value}" has appeared in ${p.occurrences} dreams in this dreamer's archive (e.g. ${titles}), most recently ${new Date(p.last_seen).toDateString()}.`;
    });

    return [
      "This dreamer's own archive shows the following recurring elements across past dreams:",
      ...lines,
      'Recurrence alone does not prove spiritual significance — a repeated symbol can just as easily reflect ordinary memory, habit, or current circumstances. If a pattern above is genuinely relevant to this dream, you may note it to the dreamer as an observation worth their own reflection ("this is the Nth time X has shown up for you") — never as settled meaning, and only when it actually connects to what this specific dream contains.',
    ].join('\n');
  } catch (error) {
    console.error('Pattern context lookup failed:', error);
    return '';
  }
}

/** Persists the elements the interpretation call extracted for this dream. */
export async function recordDreamElements(dreamId: string, userId: string, elements: ExtractedElements | undefined | null) {
  await replaceDreamElements(dreamId, userId, flattenElements(elements));
}
