export type TextChunk = {
  content: string;
  page?: number;
  chapter?: string;
};

const MAX_CHUNK_CHARS = 1200;
const MIN_CHUNK_CHARS = 200;
const PAGE_MARKER = /^={3,}\s*PAGE\s+(\d+)\s*={3,}$/i;
const CHAPTER_MARKER = /^CHAPTER\s+\d+/i;

/**
 * Splits source text into semantic chunks for embedding. Recognizes the
 * "===== PAGE N =====" markers our PDF extraction emits (see scripts that
 * ingest a knowledge source) to attach page numbers, and tracks the most
 * recent "CHAPTER N" heading as chapter metadata. Falls back to plain
 * paragraph chunking when no page markers are present (e.g. pasted text).
 */
export function chunkText(rawText: string): TextChunk[] {
  const lines = rawText.split('\n');
  const chunks: TextChunk[] = [];

  let currentPage: number | undefined;
  let currentChapter: string | undefined;
  let paragraphBuffer: string[] = [];
  let chunkBuffer = '';

  const flushParagraph = () => {
    const paragraph = paragraphBuffer.join(' ').trim();
    paragraphBuffer = [];
    if (!paragraph) return;

    if (chunkBuffer.length > 0 && chunkBuffer.length + paragraph.length + 1 > MAX_CHUNK_CHARS) {
      chunks.push({ content: chunkBuffer.trim(), page: currentPage, chapter: currentChapter });
      chunkBuffer = '';
    }

    if (paragraph.length > MAX_CHUNK_CHARS) {
      if (chunkBuffer.trim()) {
        chunks.push({ content: chunkBuffer.trim(), page: currentPage, chapter: currentChapter });
        chunkBuffer = '';
      }
      for (let i = 0; i < paragraph.length; i += MAX_CHUNK_CHARS) {
        chunks.push({ content: paragraph.slice(i, i + MAX_CHUNK_CHARS).trim(), page: currentPage, chapter: currentChapter });
      }
      return;
    }

    chunkBuffer = chunkBuffer ? `${chunkBuffer} ${paragraph}` : paragraph;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    const pageMatch = line.match(PAGE_MARKER);
    if (pageMatch) {
      flushParagraph();
      currentPage = Number(pageMatch[1]);
      continue;
    }

    if (CHAPTER_MARKER.test(line)) {
      flushParagraph();
      currentChapter = line;
      continue;
    }

    if (!line) {
      flushParagraph();
      continue;
    }

    paragraphBuffer.push(line);
  }
  flushParagraph();

  if (chunkBuffer.trim()) {
    chunks.push({ content: chunkBuffer.trim(), page: currentPage, chapter: currentChapter });
  }

  // Merge any trailing tiny chunk into the previous one so we don't index fragments.
  const merged: TextChunk[] = [];
  for (const chunk of chunks) {
    const previous = merged[merged.length - 1];
    if (previous && chunk.content.length < MIN_CHUNK_CHARS && previous.chapter === chunk.chapter) {
      previous.content = `${previous.content} ${chunk.content}`;
    } else {
      merged.push({ ...chunk });
    }
  }

  return merged.filter((c) => c.content.length > 0);
}
