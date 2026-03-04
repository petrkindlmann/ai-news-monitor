# AI News Monitor — Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              AI News Monitor                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                   │
│  │   Schedule   │───▶│   n8n        │───▶│  RSS Read    │                   │
│  │   Trigger    │    │   Workflow   │    │  (8 feeds)   │                   │
│  └──────────────┘    └──────┬───────┘    └──────┬───────┘                   │
│                             │                    │                           │
│                             │              ┌─────┴──────┐                    │
│                             │              │ Anthropic   │                   │
│                             │              │ Crawler     │                   │
│                             │              │ (Playwright)│                   │
│                             │              └─────┬──────┘                    │
│                             │                    │                           │
│                             ▼                    ▼                           │
│                      ┌──────────────┐    ┌──────────────┐                   │
│                      │  PostgreSQL  │◀───│  Normalize   │                   │
│                      │   Database   │    │  All Items   │                   │
│                      └──────┬───────┘    └──────────────┘                   │
│                             │                                                │
│                             ▼                                                │
│                      ┌──────────────┐    ┌──────────────┐                   │
│                      │  Unanalyzed  │───▶│  Claude API  │                   │
│                      │    Items     │    │  (Analysis)  │                   │
│                      └──────────────┘    └──────┬───────┘                   │
│                                                  │                           │
│                             ┌────────────────────┘                           │
│                             ▼                                                │
│                      ┌──────────────┐    ┌──────────────┐                   │
│                      │  Enriched    │───▶│   Next.js    │                   │
│                      │    Data      │    │  Dashboard   │                   │
│                      └──────────────┘    └──────────────┘                   │
│                                                  │                           │
│                             ┌────────────────────┘                           │
│                             ▼                                                │
│                      ┌──────────────┐                                        │
│                      │    Slack     │                                        │
│                      │   Alerts     │                                        │
│                      └──────────────┘                                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Ingestion Phase

**Frequency:** Every 2 hours (configurable)

**Sources & Methods:**

| Source | Method | Feed URL | Notes |
|--------|--------|----------|-------|
| Hacker News | RSS | `hnrss.org/newest?q=AI+OR+LLM+OR+%22machine+learning%22` | Community RSS service, pre-filtered |
| Reddit r/ML | RSS (Atom) | `reddit.com/r/MachineLearning/.rss` | Native Reddit feed |
| Reddit r/LocalLLaMA | RSS (Atom) | `reddit.com/r/LocalLLaMA/.rss` | Native Reddit feed |
| TechCrunch AI | RSS | `techcrunch.com/category/artificial-intelligence/feed/` | Category-specific feed |
| Anthropic Blog | Playwright | `anthropic.com/news` | No RSS available — only scraped source |
| OpenAI Blog | RSS | `openai.com/blog/rss.xml` | Official blog feed |
| DeepMind Blog | RSS | `deepmind.google/blog/rss.xml` | Official blog feed |
| Google AI Blog | RSS | `blog.google/technology/ai/rss/` | Google AI research blog |
| arXiv cs.AI | RSS | `rss.arxiv.org/rss/cs.AI` | Daily paper listings |

**Processing:**
- All 8 RSS feeds fetched in parallel by n8n RSS Read nodes
- Anthropic Blog crawled via Execute Command (Playwright)
- All items normalized into unified schema by Code node
- Deduplication by `(source, external_id)` via `ON CONFLICT`

**Note on engagement data:** RSS feeds do not provide engagement metrics (upvotes, comments). The `engagement` field is stored as `{}` for RSS sources. Anthropic Blog also has no engagement data.

### 2. Storage Phase

**Database:** PostgreSQL 15

**Main Table: `news_items`**
```sql
- id: SERIAL PRIMARY KEY
- source: VARCHAR(50)
- external_id: VARCHAR(255)
- title: TEXT
- url: TEXT
- published_at: TIMESTAMPTZ
- crawled_at: TIMESTAMPTZ
- sentiment: VARCHAR(20)
- sentiment_score: DECIMAL(4,3)
- summary: TEXT
- topics: TEXT[]
- engagement: JSONB
- raw_data: JSONB
```

**Indexes:**
- `(source, external_id)` — UNIQUE, for deduplication
- `published_at DESC` — for timeline queries
- `topics` — GIN index for topic search
- `sentiment` — for filtering

### 3. Analysis Phase

**Tool:** Claude API (claude-sonnet-4-20250514)

**Process:**
1. Fetch items where `sentiment IS NULL`
2. Batch into groups of 20
3. Send to Claude with structured prompt
4. Parse JSON response
5. Update database with:
   - `sentiment`: positive/negative/neutral
   - `sentiment_score`: -1.0 to 1.0
   - `summary`: 1-2 sentence summary
   - `topics`: Array of 3-5 tags

**Cost Estimation:**
- ~100 tokens per analysis
- ~50 items/day average
- ~5,000 tokens/day = ~$0.02/day

### 4. Presentation Phase

**Dashboard:** Next.js 14

**Components:**
- `NewsCard` — Individual article display
- `TrendCard` — Trending topic with change indicator
- `SentimentChart` — Recharts area chart
- `CrawlStatus` — Real-time crawler status
- `DailySummary` — AI-generated highlights

**API Routes:**
```
GET /api/news?limit=50&source=hacker_news
GET /api/trends?days=7
GET /api/stats?type=all
GET /api/summary?date=2024-01-15
GET /api/health
```

### 5. Notification Phase

**Channels:**
- Slack: Daily summary at 8 AM
- Slack: Breaking news alerts (sentiment_score > 0.8)

## n8n Workflow Structure

### Main Workflow (Every 2 hours)
```
Schedule Trigger
    │
    ├──▶ RSS: TechCrunch AI ─────────────┐
    ├──▶ RSS: OpenAI Blog ───────────────┤
    ├──▶ RSS: DeepMind Blog ─────────────┤
    ├──▶ RSS: Google AI Blog ────────────┤
    ├──▶ RSS: Hacker News ───────────────┼──▶ Normalize All Items
    ├──▶ RSS: Reddit r/ML ───────────────┤         │
    ├──▶ RSS: Reddit r/LocalLLaMA ───────┤         ▼
    ├──▶ RSS: arXiv cs.AI ──────────────┤   Store in Database
    └──▶ Crawl: Anthropic Blog ─────────┘         │
              (Execute Command)                    ▼
                                           Fetch Unanalyzed
                                                   │
                                                   ▼
                                           Claude Analysis
                                                   │
                                                   ▼
                                           Update Sentiment
                                                   │
                                                   ▼
                                           Slack Notification
```

### Daily Summary Workflow (8 AM)
```
Daily Trigger
    │
    ├──▶ Fetch Top Stories
    ├──▶ Fetch Top Topics
    └──▶ Fetch Sentiment Stats
            │
            ▼
        Merge Data
            │
            ▼
        Claude Summary
            │
            ▼
        Store Summary
            │
            ▼
        Slack Daily Digest
```

## Adding New Sources

**RSS source (preferred):**
1. Add RSS Read node in `n8n/main-workflow.json` with feed URL
2. Add source name mapping in Normalize All Items code node
3. Connect RSS node → Normalize node
4. Add source type to `src/lib/types.ts`

**Non-RSS source (last resort):**
1. Create crawler script in `crawlers/`
2. Add Execute Command node in n8n workflow
3. Parse stdout JSON in Normalize node
4. Add source type to `src/lib/types.ts`

## Scaling Considerations

### Current Limits
- ~50-100 items/day
- Single PostgreSQL instance
- Single n8n instance
- ~$5/month infrastructure

### Scaling Path
1. **More sources:** Add more RSS feeds (trivial — just add nodes)
2. **Higher frequency:** Move to 30-min or 15-min crawls
3. **More analysis:** Entity extraction, relationship mapping
4. **Database:** Move to managed PostgreSQL, add read replicas
5. **Caching:** Add Redis for dashboard queries

## Security

- API keys stored in n8n credentials (encrypted)
- Database credentials in environment variables
- No PII collected or stored
- Public data only (no login required for sources)

## Monitoring

- n8n execution history
- PostgreSQL query logs
- Slack alerts on workflow failures

## Recovery

- Database backups: Daily (pg_dump)
- Workflow exports: Stored in git
- Re-crawl capability: Can backfill from sources
