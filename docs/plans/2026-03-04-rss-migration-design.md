# RSS Migration Design

**Date:** 2026-03-04
**Goal:** Replace Playwright crawlers with RSS feeds for all sources except Anthropic Blog. Remove Docker dependency.

## Current State

- 8 data sources, 4 using Playwright scrapers (fragile CSS selectors)
- Separate Docker container for crawlers with Playwright/Chromium
- n8n uses HTTP Request + Code nodes for HN and Reddit APIs
- Crawlers break when source sites change their HTML

## Target State

- 7 sources via n8n RSS Read nodes (zero custom code)
- 1 source (Anthropic Blog) via minimal Playwright script triggered by n8n Execute Command
- No Docker dependency
- Feed URLs as the only configuration per source

## Feed URLs

| Source | Feed URL | Format |
|---|---|---|
| TechCrunch AI | `https://techcrunch.com/category/artificial-intelligence/feed/` | RSS 2.0 |
| OpenAI Blog | `https://openai.com/blog/rss.xml` | RSS 2.0 |
| DeepMind Blog | `https://deepmind.google/blog/rss.xml` | RSS 2.0 |
| Google AI Blog | `https://blog.google/technology/ai/rss/` | RSS 2.0 |
| Hacker News | `https://hnrss.org/newest?q=AI+OR+LLM+OR+%22machine+learning%22` | RSS 2.0 |
| Reddit r/ML | `https://www.reddit.com/r/MachineLearning/.rss` | Atom 1.0 |
| Reddit r/LocalLLaMA | `https://www.reddit.com/r/LocalLLaMA/.rss` | Atom 1.0 |
| arXiv cs.AI | `https://rss.arxiv.org/rss/cs.AI` | RSS 2.0 |

## n8n Workflow Changes

### Ingestion Phase (rewrite)

```
Schedule Trigger (every 2 hours)
    |
    +---> RSS Read: TechCrunch --------+
    +---> RSS Read: OpenAI Blog -------+
    +---> RSS Read: DeepMind Blog -----+
    +---> RSS Read: Google AI Blog ----+
    +---> RSS Read: Hacker News -------+--> Merge --> Normalize --> Store in DB
    +---> RSS Read: Reddit r/ML -------+
    +---> RSS Read: Reddit r/LocalLLaMA+
    +---> RSS Read: arXiv cs.AI -------+
    +---> Execute Command: Anthropic --+
```

Each RSS Read node outputs items with fields: `title`, `link`, `pubDate`, `description`, `creator`.

### Normalize Node (Code node)

Maps RSS fields to news_items schema:
- `source` = derived from feed URL or node name
- `external_id` = GUID or link hash
- `title` = RSS title
- `url` = RSS link
- `published_at` = RSS pubDate
- `engagement` = `{}` (RSS feeds don't have engagement data)

### Analysis + Storage Phase (unchanged)

Dedup via `ON CONFLICT (source, external_id)` -> Fetch unanalyzed -> Claude analysis -> Update sentiment -> Slack notification.

## File Changes

### Delete
- `crawlers/techcrunch-crawler.ts` — replaced by RSS
- `crawlers/Dockerfile.crawler` — no Docker
- `docker-compose.yml` — not needed

### Modify
- `crawlers/blog-crawler.ts` — strip to Anthropic-only
- `crawlers/package.json` — keep playwright + tsx only
- `n8n/main-workflow.json` — rewrite with RSS Read nodes
- `README.md` — update architecture, remove Docker instructions
- `docs/ARCHITECTURE.md` — update data flow

### No Changes
- `n8n/schema.sql` — schema unchanged
- `n8n/daily-summary-workflow.json` — unchanged
- `src/` — entire dashboard unchanged

## Trade-offs

- **Lost:** HN engagement data (score, comments) — hnrss.org includes some in description text but not as structured fields. Reddit engagement also lost.
- **Gained:** Reliability, no CSS selector maintenance, no Chromium dependency, faster fetches (~1s vs ~30s per source), Google AI Blog as bonus source.
