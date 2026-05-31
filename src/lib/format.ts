/* Pure, client-safe formatting helpers (no filesystem access). */

export const issueNo = (slug: string) => String(parseInt(slug.split('-W')[1], 10));
export const weekNo = (slug: string) => slug.split('-W')[1];

export function fmtMonthDay(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}

export function fmtFull(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

export function fmtRange(start: string, end: string): string {
  const s = new Date(start), e = new Date(end);
  const m = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' });
  const day = (d: Date) => d.toLocaleDateString('en-US', { day: 'numeric', timeZone: 'UTC' });
  const yr = e.getUTCFullYear();
  if (m(s) === m(e)) return `${m(s)} ${day(s)}–${day(e)}, ${yr}`;
  return `${m(s)} ${day(s)} – ${m(e)} ${day(e)}, ${yr}`;
}

export function firstSentence(t: string): string {
  const clean = t.replace(/\n+/g, ' ').trim();
  const m = clean.match(/^.*?[.!?](\s|$)/);
  return (m ? m[0] : clean).trim();
}

/** Where a given issue lives: latest → "/", otherwise "/issue/<slug>/". */
export function issueHref(slug: string, latestSlug: string): string {
  return slug === latestSlug ? '/' : `/issue/${slug}/`;
}
