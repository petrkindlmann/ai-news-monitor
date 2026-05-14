import { askJson } from './ai';
import { RankedItem, Cluster, Issue } from './types';
import { issueSlug, weekRange } from './week';

const WRITE_SYSTEM = `You are writing a weekly AI news zine called "AI News Monitor".
The reader is technical, skeptical, and busy.
They do not want hype.

They want to know:
- what shipped
- what changed
- what is actually useful
- what is noise
- what to watch next

Voice:
- sharp but not snarky
- opinionated but fair
- builder-focused
- concise
- no corporate newsletter tone
- no "Here are this week's updates"
- no generic AI revolution language

HARD RULES:
- Every story.url MUST exist in the input clusters (use canonical URL from input).
- Every story.title MAY rephrase the original, but must be grounded in the input title/summary — do NOT invent facts.
- Output 10-15 stories total across all sections.
- editorLetter must be under 250 words.
- Each blurb under 80 words.
- watchNext: 3-5 short open threads.
- ignoredThisWeek: 2-5 themes you intentionally skipped, with reason.

Return ONLY a JSON object matching this shape, no prose, no code fences:
{
  "issueTitle": "...",
  "slug": "...",
  "publishedAt": "...",
  "weekRange": { "start": "...", "end": "..." },
  "editorLetter": "...",
  "sections": [
    {
      "title": "The 5 That Matter | Builder Notes | Research Worth Skimming | Hype I'm Ignoring | etc.",
      "description": "one line",
      "stories": [
        {
          "title": "...",
          "source": "...",
          "url": "...",
          "publishedAt": "...",
          "label": "Signal|Tool|Research|Model|Policy|Drama|Ignore",
          "blurb": "...",
          "whyItMatters": "...",
          "takeaway": "...",
          "heat": 1
        }
      ]
    }
  ],
  "ignoredThisWeek": [{ "theme": "...", "reason": "..." }],
  "oneThingToTry": "...",
  "watchNext": ["...", "..."]
}`;

export async function writeIssue(
  clusters: Cluster[],
  ranked: RankedItem[],
  now: Date = new Date()
): Promise<Issue> {
  const byId = new Map(ranked.map(r => [r.id, r]));

  // Hydrate clusters with canonical item details for the model.
  const hydrated = clusters.map(c => {
    const canonical = byId.get(c.canonicalItemId);
    const supporting = c.supportingItemIds.map(id => byId.get(id)).filter(Boolean);
    return {
      clusterTitle: c.clusterTitle,
      whyItMatters: c.whyItMatters,
      angle: c.angle,
      canonical: canonical && {
        id: canonical.id,
        title: canonical.title,
        url: canonical.url,
        source: canonical.sourceLabel,
        publishedAt: canonical.publishedAt,
        summary: canonical.summary?.slice(0, 400) ?? '',
        category: canonical.category,
      },
      supporting: supporting.map(s => s && {
        title: s.title,
        url: s.url,
        source: s.sourceLabel,
      }),
    };
  });

  const slug = issueSlug(now);
  const range = weekRange(now);

  const userMsg = `Write this week's issue.
Issue slug: ${slug}
Week: ${range.start} to ${range.end}

Clusters:
${JSON.stringify(hydrated, null, 2)}`;

  return askJson<Issue>({
    model: 'smart',
    system: WRITE_SYSTEM,
    user: userMsg,
    maxTokens: 8000,
    temperature: 0.6,
  });
}
