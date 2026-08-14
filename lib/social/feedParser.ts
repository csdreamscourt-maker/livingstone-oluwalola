/**
 * Minimal, dependency-free parsers for the two feed formats social sync relies on:
 * Substack's RSS 2.0 export and YouTube's public per-channel Atom feed. Both are small,
 * stable, well-documented formats, so a couple of targeted regexes are enough — pulling in
 * a general XML parser dependency for this would be more machinery than the problem needs.
 */

export type SubstackFeedItem = {
  externalId: string;
  title: string;
  link: string;
  publishedAt: string | null;
  author: string | null;
  contentText: string;
};

export type YoutubeFeedItem = {
  externalId: string;
  title: string;
  link: string;
  publishedAt: string | null;
  description: string;
};

function decodeEntities(text: string): string {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
}

function stripHtml(html: string): string {
  return decodeEntities(html)
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function extractTag(block: string, tag: string): string | null {
  const match = block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? decodeEntities(match[1]).trim() : null;
}

export function parseSubstackFeed(xml: string, limit = 20): SubstackFeedItem[] {
  const items: SubstackFeedItem[] = [];
  const blocks = xml.match(/<item>[\s\S]*?<\/item>/g) || [];

  for (const block of blocks.slice(0, limit)) {
    const link = extractTag(block, 'link');
    const guid = extractTag(block, 'guid');
    const title = extractTag(block, 'title');
    if (!title || !(guid || link)) continue;

    const contentEncoded = extractTag(block, 'content:encoded');
    const description = extractTag(block, 'description');

    items.push({
      externalId: guid || link!,
      title,
      link: link || guid || '',
      publishedAt: extractTag(block, 'pubDate'),
      author: extractTag(block, 'dc:creator'),
      contentText: stripHtml(contentEncoded || description || ''),
    });
  }

  return items;
}

export function parseYoutubeFeed(xml: string, limit = 20): YoutubeFeedItem[] {
  const items: YoutubeFeedItem[] = [];
  const blocks = xml.match(/<entry>[\s\S]*?<\/entry>/g) || [];

  for (const block of blocks.slice(0, limit)) {
    const videoId = extractTag(block, 'yt:videoId');
    const title = extractTag(block, 'title');
    if (!videoId || !title) continue;

    const linkMatch = block.match(/<link[^>]*rel="alternate"[^>]*href="([^"]+)"/i);
    const description = extractTag(block, 'media:description');

    items.push({
      externalId: videoId,
      title,
      link: linkMatch ? decodeEntities(linkMatch[1]) : `https://www.youtube.com/watch?v=${videoId}`,
      publishedAt: extractTag(block, 'published'),
      description: description ? stripHtml(description) : '',
    });
  }

  return items;
}
