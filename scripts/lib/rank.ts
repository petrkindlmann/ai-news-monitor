import { askJson } from './ai';
import { RawItem, RankedItem } from './types';

const RANK_SYSTEM = `You are the editor of a weekly AI news zine for technical builders.
Your job is to score RSS items from the past week.
Audience:
- QA automation engineers
- indie hackers
- AI tool builders
- technical founders
- people tired of AI hype

Score each item from 0-5 on:
1. Practical impact
2. Technical novelty
3. Ecosystem importance
4. Signal over hype
5. Reader usefulness

Penalize:
- vague funding news
- recycled opinion
- product launches with no technical detail
- "AI will change everything" fluff
- duplicate coverage

Boost:
- new model releases
- API/platform changes
- open-source releases
- benchmark shifts
- pricing/rate-limit changes
- regulation that affects builders
- security failures
- surprising research with near-term implications

Return ONLY a JSON array, no prose, no code fences. Each element must have:
{ "id": string, "score": number 0-25, "category": "models|research|tools|open-source|policy|business|security|infra", "reason": "one sentence", "keep": boolean }`;

export async function rankItems(items: RawItem[]): Promise<RankedItem[]> {
  if (items.length === 0) return [];

  // Batch into groups of ~40 to keep response size manageable
  const BATCH = 40;
  const results: Array<Omit<RankedItem, keyof RawItem> & { id: string }> = [];

  for (let i = 0; i < items.length; i += BATCH) {
    const slice = items.slice(i, i + BATCH);
    const payload = slice.map(it => ({
      id: it.id,
      source: it.sourceLabel,
      title: it.title,
      summary: it.summary?.slice(0, 300) ?? '',
      publishedAt: it.publishedAt,
    }));

    const userMsg = `Score these ${slice.length} items. Return a JSON array with one element per id.\n\n${JSON.stringify(payload, null, 2)}`;

    const batch = await askJson<Array<{
      id: string;
      score: number;
      category: RankedItem['category'];
      reason: string;
      keep: boolean;
    }>>({
      model: 'cheap',
      system: RANK_SYSTEM,
      user: userMsg,
      maxTokens: 8000,
      temperature: 0.2,
    });

    results.push(...batch);
  }

  const byId = new Map(results.map(r => [r.id, r]));
  return items
    .map(it => {
      const r = byId.get(it.id);
      if (!r) return null;
      return {
        ...it,
        score: r.score,
        category: r.category,
        reason: r.reason,
        keep: r.keep,
      } as RankedItem;
    })
    .filter((x): x is RankedItem => x !== null);
}
