import { RawItem } from './types';

const JUNK_PATTERNS = [
  /\bwe[' ]re hiring\b/i,
  /\bhiring\b.*\bengineers?\b/i,
  /\bpodcast episode\b/i,
  /\bnewsletter\b/i,
  /\bsubscribe\b/i,
  /^\s*(ask|show)\s+hn:?\s*hiring/i,
];

function normalizeTitle(t: string): string {
  return t.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
}

export function prefilter(items: RawItem[], now: Date = new Date()): RawItem[] {
  const cutoff = new Date(now);
  cutoff.setUTCDate(cutoff.getUTCDate() - 8);

  const seenUrl = new Set<string>();
  const seenTitle = new Set<string>();
  const out: RawItem[] = [];

  for (const item of items) {
    if (!item.title || item.title.length < 15) continue;
    if (JUNK_PATTERNS.some(p => p.test(item.title))) continue;

    const published = new Date(item.publishedAt);
    if (isNaN(published.getTime()) || published < cutoff) continue;

    if (seenUrl.has(item.url)) continue;
    seenUrl.add(item.url);

    const normTitle = normalizeTitle(item.title);
    if (seenTitle.has(normTitle)) continue;
    seenTitle.add(normTitle);

    out.push(item);
  }
  return out;
}
