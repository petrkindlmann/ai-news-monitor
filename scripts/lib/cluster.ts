import { askJson } from './ai';
import { RankedItem, Cluster } from './types';

const CLUSTER_SYSTEM = `You group related news stories into clusters for a weekly AI zine.

Rules:
- If multiple sources cover the same release, merge them into one cluster.
- Prefer original sources (OpenAI blog, DeepMind, Anthropic, arXiv) over secondary coverage (TechCrunch, HN, Reddit).
- Keep Hacker News / Reddit only when discussion adds useful builder context.
- A cluster may contain 1-5 items.
- Choose one canonical source URL per cluster (use canonicalItemId).
- Output 8-20 clusters total.

Return ONLY a JSON array, no prose, no code fences. Each cluster:
{
  "clusterTitle": "...",
  "canonicalItemId": "...",
  "supportingItemIds": ["..."],
  "whyItMatters": "...",
  "angle": "..."
}`;

export async function clusterItems(ranked: RankedItem[]): Promise<Cluster[]> {
  // Take top 50 by score (or all if fewer)
  const top = [...ranked].sort((a, b) => b.score - a.score).slice(0, 50);
  if (top.length === 0) return [];

  const payload = top.map(it => ({
    id: it.id,
    source: it.sourceLabel,
    title: it.title,
    url: it.url,
    score: it.score,
    category: it.category,
    summary: it.summary?.slice(0, 200) ?? '',
  }));

  const userMsg = `Cluster these ${top.length} ranked items. Every canonicalItemId and every supportingItemId must appear in the input.\n\n${JSON.stringify(payload, null, 2)}`;

  return askJson<Cluster[]>({
    model: 'cheap',
    system: CLUSTER_SYSTEM,
    user: userMsg,
    maxTokens: 6000,
    temperature: 0.2,
  });
}
