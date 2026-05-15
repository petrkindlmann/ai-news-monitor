# RSS Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace Playwright crawlers with RSS feeds for all sources except Anthropic Blog, removing the Docker/Chromium dependency.

**Architecture:** n8n RSS Read nodes fetch 8 feeds in parallel, a Code node normalizes all items into the `news_items` schema, then the existing dedup/store/analyze pipeline handles the rest. Anthropic Blog (no RSS) keeps a minimal Playwright script triggered via Execute Command.

**Tech Stack:** n8n (RSS Read nodes, Code nodes, Execute Command), Playwright (Anthropic only), PostgreSQL (unchanged), Next.js dashboard (unchanged)

---

### Task 1: Rewrite n8n main workflow with RSS Read nodes

**Files:**
- Modify: `n8n/main-workflow.json` (complete rewrite)

**Step 1: Replace `n8n/main-workflow.json` with new RSS-based workflow**

```json
{
  "name": "AI News Monitor - Main Orchestrator",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "hours",
              "hoursInterval": 2
            }
          ]
        }
      },
      "id": "schedule-trigger",
      "name": "Every 2 Hours",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1.1,
      "position": [0, 0]
    },
    {
      "parameters": {
        "url": "https://techcrunch.com/category/artificial-intelligence/feed/"
      },
      "id": "rss-techcrunch",
      "name": "RSS: TechCrunch AI",
      "type": "n8n-nodes-base.rssFeedRead",
      "typeVersion": 1,
      "position": [300, -400]
    },
    {
      "parameters": {
        "url": "https://openai.com/blog/rss.xml"
      },
      "id": "rss-openai",
      "name": "RSS: OpenAI Blog",
      "type": "n8n-nodes-base.rssFeedRead",
      "typeVersion": 1,
      "position": [300, -280]
    },
    {
      "parameters": {
        "url": "https://deepmind.google/blog/rss.xml"
      },
      "id": "rss-deepmind",
      "name": "RSS: DeepMind Blog",
      "type": "n8n-nodes-base.rssFeedRead",
      "typeVersion": 1,
      "position": [300, -160]
    },
    {
      "parameters": {
        "url": "https://blog.google/technology/ai/rss/"
      },
      "id": "rss-google-ai",
      "name": "RSS: Google AI Blog",
      "type": "n8n-nodes-base.rssFeedRead",
      "typeVersion": 1,
      "position": [300, -40]
    },
    {
      "parameters": {
        "url": "https://hnrss.org/newest?q=AI+OR+LLM+OR+%22machine+learning%22"
      },
      "id": "rss-hackernews",
      "name": "RSS: Hacker News",
      "type": "n8n-nodes-base.rssFeedRead",
      "typeVersion": 1,
      "position": [300, 80]
    },
    {
      "parameters": {
        "url": "https://www.reddit.com/r/MachineLearning/.rss"
      },
      "id": "rss-reddit-ml",
      "name": "RSS: Reddit r/ML",
      "type": "n8n-nodes-base.rssFeedRead",
      "typeVersion": 1,
      "position": [300, 200]
    },
    {
      "parameters": {
        "url": "https://www.reddit.com/r/LocalLLaMA/.rss"
      },
      "id": "rss-reddit-locallama",
      "name": "RSS: Reddit r/LocalLLaMA",
      "type": "n8n-nodes-base.rssFeedRead",
      "typeVersion": 1,
      "position": [300, 320]
    },
    {
      "parameters": {
        "url": "https://rss.arxiv.org/rss/cs.AI"
      },
      "id": "rss-arxiv",
      "name": "RSS: arXiv cs.AI",
      "type": "n8n-nodes-base.rssFeedRead",
      "typeVersion": 1,
      "position": [300, 440]
    },
    {
      "parameters": {
        "command": "cd /path/to/ai-news-monitor/crawlers && npx tsx anthropic-crawler.ts"
      },
      "id": "exec-anthropic",
      "name": "Crawl: Anthropic Blog",
      "type": "n8n-nodes-base.executeCommand",
      "typeVersion": 1,
      "position": [300, 560]
    },
    {
      "parameters": {
        "jsCode": "// Collect all items from all RSS inputs and the Anthropic crawler\nconst allItems = [];\n\n// Helper: derive source name from feed URL or node name\nfunction getSource(item) {\n  const feed = item.json.feed || '';\n  const title = item.json.feedTitle || '';\n  if (feed.includes('techcrunch')) return 'techcrunch';\n  if (feed.includes('openai.com')) return 'openai_blog';\n  if (feed.includes('deepmind.google')) return 'deepmind_blog';\n  if (feed.includes('blog.google')) return 'google_ai_blog';\n  if (feed.includes('hnrss.org')) return 'hacker_news';\n  if (feed.includes('r/MachineLearning')) return 'reddit_ml';\n  if (feed.includes('r/LocalLLaMA')) return 'reddit_locallama';\n  if (feed.includes('arxiv.org')) return 'arxiv';\n  return 'unknown';\n}\n\n// Helper: generate external_id from link\nfunction externalId(link) {\n  try {\n    const url = new URL(link);\n    // Use last meaningful path segment\n    const segments = url.pathname.split('/').filter(Boolean);\n    return segments.slice(-2).join('-') || Buffer.from(link).toString('base64').slice(0, 32);\n  } catch {\n    return Buffer.from(link).toString('base64').slice(0, 32);\n  }\n}\n\n// Process RSS items from all feed nodes\nconst feedNodes = [\n  'RSS: TechCrunch AI',\n  'RSS: OpenAI Blog',\n  'RSS: DeepMind Blog',\n  'RSS: Google AI Blog',\n  'RSS: Hacker News',\n  'RSS: Reddit r/ML',\n  'RSS: Reddit r/LocalLLaMA',\n  'RSS: arXiv cs.AI',\n];\n\nfor (const nodeName of feedNodes) {\n  try {\n    const items = $(nodeName).all();\n    for (const item of items) {\n      const link = item.json.link || item.json.url || '';\n      if (!link) continue;\n      \n      allItems.push({\n        json: {\n          source: getSource(item),\n          external_id: externalId(link),\n          title: (item.json.title || '').trim(),\n          url: link,\n          published_at: item.json.pubDate || item.json.isoDate || item.json.updated || null,\n          engagement: {},\n          raw_data: {\n            description: item.json.contentSnippet || item.json.description || null,\n            author: item.json.creator || item.json['dc:creator'] || item.json.author || null,\n            categories: item.json.categories || [],\n          }\n        }\n      });\n    }\n  } catch (err) {\n    // Node may have returned no items — skip\n  }\n}\n\n// Process Anthropic crawler output\ntry {\n  const anthropicOutput = $('Crawl: Anthropic Blog').first();\n  if (anthropicOutput && anthropicOutput.json.stdout) {\n    const posts = JSON.parse(anthropicOutput.json.stdout);\n    for (const post of posts) {\n      allItems.push({\n        json: {\n          source: 'anthropic_blog',\n          external_id: post.external_id,\n          title: post.title,\n          url: post.url,\n          published_at: post.published_at,\n          engagement: {},\n          raw_data: post\n        }\n      });\n    }\n  }\n} catch (err) {\n  // Anthropic crawl may have failed — continue with RSS items\n}\n\nreturn allItems;"
      },
      "id": "normalize-items",
      "name": "Normalize All Items",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [600, 80]
    },
    {
      "parameters": {
        "operation": "executeQuery",
        "query": "INSERT INTO news_items (source, external_id, title, url, published_at, engagement, raw_data, crawled_at)\nVALUES ($1, $2, $3, $4, $5, $6, $7, NOW())\nON CONFLICT (source, external_id) DO UPDATE SET\n  engagement = EXCLUDED.engagement,\n  crawled_at = NOW()",
        "options": {}
      },
      "id": "db-insert",
      "name": "Store in Database",
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.3,
      "position": [820, 80],
      "credentials": {
        "postgres": {
          "id": "postgres-cred",
          "name": "PostgreSQL"
        }
      }
    },
    {
      "parameters": {
        "operation": "executeQuery",
        "query": "SELECT id, title, url, source FROM news_items WHERE sentiment IS NULL ORDER BY crawled_at DESC LIMIT 20",
        "options": {}
      },
      "id": "db-fetch-unanalyzed",
      "name": "Fetch Unanalyzed Items",
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.3,
      "position": [1040, 80]
    },
    {
      "parameters": {
        "resource": "chat",
        "model": "claude-sonnet-4-20250514",
        "messages": {
          "values": [
            {
              "content": "=Analyze this AI/tech news headline and provide:\n1. sentiment: 'positive', 'negative', or 'neutral'\n2. sentiment_score: number from -1 to 1\n3. summary: 1-2 sentence summary (max 200 chars)\n4. topics: array of 3-5 relevant tags\n\nHeadline: {{ $json.title }}\nSource: {{ $json.source }}\n\nRespond ONLY with valid JSON, no markdown:\n{\"sentiment\": \"...\", \"sentiment_score\": 0.0, \"summary\": \"...\", \"topics\": [...]}"
            }
          ]
        },
        "options": {
          "maxTokens": 300
        }
      },
      "id": "claude-analyze",
      "name": "Claude: Analyze Sentiment",
      "type": "@n8n/n8n-nodes-langchain.lmChatAnthropic",
      "typeVersion": 1,
      "position": [1260, 80],
      "credentials": {
        "anthropicApi": {
          "id": "anthropic-cred",
          "name": "Anthropic API"
        }
      }
    },
    {
      "parameters": {
        "jsCode": "const item = $input.first().json;\nconst analysis = JSON.parse(item.message.content);\n\nreturn [{\n  json: {\n    id: item.id,\n    sentiment: analysis.sentiment,\n    sentiment_score: analysis.sentiment_score,\n    summary: analysis.summary,\n    topics: analysis.topics\n  }\n}];"
      },
      "id": "parse-claude-response",
      "name": "Parse Claude Response",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [1480, 80]
    },
    {
      "parameters": {
        "operation": "executeQuery",
        "query": "UPDATE news_items SET sentiment = $2, sentiment_score = $3, summary = $4, topics = $5 WHERE id = $1",
        "options": {}
      },
      "id": "db-update-sentiment",
      "name": "Update Sentiment",
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.3,
      "position": [1700, 80]
    },
    {
      "parameters": {
        "channel": "#ai-news-alerts",
        "text": "=🤖 *AI News Update*\n\nCrawled {{ $json.total_items }} new items\n• Positive: {{ $json.positive }}\n• Neutral: {{ $json.neutral }}\n• Negative: {{ $json.negative }}\n\n*Top Story:*\n{{ $json.top_story.title }}\n{{ $json.top_story.url }}",
        "options": {}
      },
      "id": "slack-notify",
      "name": "Slack: Send Summary",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 2.1,
      "position": [1920, 80]
    }
  ],
  "connections": {
    "Every 2 Hours": {
      "main": [
        [
          { "node": "RSS: TechCrunch AI", "type": "main", "index": 0 },
          { "node": "RSS: OpenAI Blog", "type": "main", "index": 0 },
          { "node": "RSS: DeepMind Blog", "type": "main", "index": 0 },
          { "node": "RSS: Google AI Blog", "type": "main", "index": 0 },
          { "node": "RSS: Hacker News", "type": "main", "index": 0 },
          { "node": "RSS: Reddit r/ML", "type": "main", "index": 0 },
          { "node": "RSS: Reddit r/LocalLLaMA", "type": "main", "index": 0 },
          { "node": "RSS: arXiv cs.AI", "type": "main", "index": 0 },
          { "node": "Crawl: Anthropic Blog", "type": "main", "index": 0 }
        ]
      ]
    },
    "RSS: TechCrunch AI": {
      "main": [
        [{ "node": "Normalize All Items", "type": "main", "index": 0 }]
      ]
    },
    "RSS: OpenAI Blog": {
      "main": [
        [{ "node": "Normalize All Items", "type": "main", "index": 0 }]
      ]
    },
    "RSS: DeepMind Blog": {
      "main": [
        [{ "node": "Normalize All Items", "type": "main", "index": 0 }]
      ]
    },
    "RSS: Google AI Blog": {
      "main": [
        [{ "node": "Normalize All Items", "type": "main", "index": 0 }]
      ]
    },
    "RSS: Hacker News": {
      "main": [
        [{ "node": "Normalize All Items", "type": "main", "index": 0 }]
      ]
    },
    "RSS: Reddit r/ML": {
      "main": [
        [{ "node": "Normalize All Items", "type": "main", "index": 0 }]
      ]
    },
    "RSS: Reddit r/LocalLLaMA": {
      "main": [
        [{ "node": "Normalize All Items", "type": "main", "index": 0 }]
      ]
    },
    "RSS: arXiv cs.AI": {
      "main": [
        [{ "node": "Normalize All Items", "type": "main", "index": 0 }]
      ]
    },
    "Crawl: Anthropic Blog": {
      "main": [
        [{ "node": "Normalize All Items", "type": "main", "index": 0 }]
      ]
    },
    "Normalize All Items": {
      "main": [
        [{ "node": "Store in Database", "type": "main", "index": 0 }]
      ]
    },
    "Store in Database": {
      "main": [
        [{ "node": "Fetch Unanalyzed Items", "type": "main", "index": 0 }]
      ]
    },
    "Fetch Unanalyzed Items": {
      "main": [
        [{ "node": "Claude: Analyze Sentiment", "type": "main", "index": 0 }]
      ]
    },
    "Claude: Analyze Sentiment": {
      "main": [
        [{ "node": "Parse Claude Response", "type": "main", "index": 0 }]
      ]
    },
    "Parse Claude Response": {
      "main": [
        [{ "node": "Update Sentiment", "type": "main", "index": 0 }]
      ]
    },
    "Update Sentiment": {
      "main": [
        [{ "node": "Slack: Send Summary", "type": "main", "index": 0 }]
      ]
    }
  },
  "settings": {
    "executionOrder": "v1"
  },
  "staticData": null,
  "tags": ["ai-news", "automation", "monitoring", "rss"]
}
```

**Step 2: Commit**

```bash
git add n8n/main-workflow.json
git commit -m "feat: rewrite main workflow to use RSS feeds instead of custom crawlers"
```

---

### Task 2: Create minimal Anthropic-only crawler

**Files:**
- Create: `crawlers/anthropic-crawler.ts`
- Delete: `crawlers/blog-crawler.ts`
- Delete: `crawlers/techcrunch-crawler.ts`

**Step 1: Create `crawlers/anthropic-crawler.ts`**

```typescript
import { chromium } from 'playwright';

interface BlogPost {
  source: string;
  external_id: string;
  title: string;
  url: string;
  published_at: string | null;
}

async function crawlAnthropic(): Promise<BlogPost[]> {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const context = await browser.newContext({
    userAgent: 'AI-News-Monitor/1.0 (https://ai-news.kindlmann.com)',
  });

  const page = await context.newPage();
  const posts: BlogPost[] = [];

  try {
    await page.goto('https://www.anthropic.com/news', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    await page.waitForSelector('article, [class*="post"], [class*="article"]', {
      timeout: 10000,
    });

    const elements = await page.$$('article, [class*="post"], [class*="article"]');

    for (const element of elements.slice(0, 20)) {
      try {
        const linkEl = await element.$('a[href*="/news/"]');
        const titleEl = await element.$('h2, h3, [class*="title"]');
        const dateEl = await element.$('time, [class*="date"]');

        if (!linkEl || !titleEl) continue;

        const href = await linkEl.getAttribute('href');
        const title = await titleEl.textContent();
        const dateText = dateEl ? await dateEl.textContent() : null;

        if (!href || !title) continue;

        const url = href.startsWith('http')
          ? href
          : new URL(href, 'https://www.anthropic.com').toString();

        const external_id = url.split('/').filter(Boolean).pop() ||
          Buffer.from(url).toString('base64').slice(0, 32);

        let published_at: string | null = null;
        if (dateText) {
          const date = new Date(dateText.trim());
          if (!isNaN(date.getTime())) {
            published_at = date.toISOString();
          }
        }

        posts.push({
          source: 'anthropic_blog',
          external_id,
          title: title.trim(),
          url,
          published_at,
        });
      } catch {
        // Skip individual post errors
      }
    }
  } finally {
    await browser.close();
  }

  return posts;
}

crawlAnthropic()
  .then(posts => console.log(JSON.stringify(posts)))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
```

**Step 2: Delete old crawler files**

```bash
rm crawlers/blog-crawler.ts
rm crawlers/techcrunch-crawler.ts
```

**Step 3: Commit**

```bash
git add crawlers/anthropic-crawler.ts
git rm crawlers/blog-crawler.ts crawlers/techcrunch-crawler.ts
git commit -m "feat: replace multi-blog crawler with Anthropic-only crawler"
```

---

### Task 3: Clean up crawlers package.json

**Files:**
- Modify: `crawlers/package.json`

**Step 1: Update package.json — remove unused scripts, keep only what's needed**

```json
{
  "name": "ai-news-crawlers",
  "version": "2.0.0",
  "description": "Anthropic blog crawler (only source without RSS)",
  "scripts": {
    "crawl:anthropic": "npx tsx anthropic-crawler.ts"
  },
  "dependencies": {
    "playwright": "^1.40.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.4.0",
    "tsx": "^4.7.0"
  }
}
```

Note: `fast-xml-parser` removed — RSS parsing is now handled by n8n.

**Step 2: Commit**

```bash
git add crawlers/package.json
git commit -m "chore: slim down crawler deps, remove fast-xml-parser"
```

---

### Task 4: Remove Docker files

**Files:**
- Delete: `crawlers/Dockerfile.crawler`
- Delete: `docker-compose.yml`
- Delete: `Dockerfile`

**Step 1: Delete Docker files**

```bash
rm crawlers/Dockerfile.crawler
rm docker-compose.yml
rm Dockerfile
```

**Step 2: Commit**

```bash
git rm crawlers/Dockerfile.crawler docker-compose.yml Dockerfile
git commit -m "chore: remove Docker files, app runs directly on host"
```

---

### Task 5: Update README.md

**Files:**
- Modify: `README.md`

**Step 1: Update README to reflect RSS-based architecture**

Key changes:
- Replace architecture diagram — show RSS feeds flowing into n8n
- Update Data Sources table — change Type column from "Playwright" to "RSS" for 7 sources, add Google AI Blog
- Remove Docker section from Quick Start
- Update Tech Stack — remove Playwright from main list, note it's only for Anthropic
- Remove `docker-compose up -d` from Deployment section
- Update Project Structure — reflect new crawler setup

Data Sources table should become:

```markdown
| Source | Type | Feed URL |
|--------|------|----------|
| Hacker News | RSS | hnrss.org/newest?q=AI+OR+LLM |
| Reddit r/MachineLearning | RSS (Atom) | reddit.com/r/MachineLearning/.rss |
| Reddit r/LocalLLaMA | RSS (Atom) | reddit.com/r/LocalLLaMA/.rss |
| TechCrunch AI | RSS | techcrunch.com/.../feed/ |
| Anthropic Blog | Playwright | anthropic.com/news (no RSS available) |
| OpenAI Blog | RSS | openai.com/blog/rss.xml |
| DeepMind Blog | RSS | deepmind.google/blog/rss.xml |
| Google AI Blog | RSS | blog.google/technology/ai/rss/ |
| arXiv cs.AI | RSS | rss.arxiv.org/rss/cs.AI |
```

Architecture diagram should become:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  8x RSS Feeds   │────▶│   n8n Workflow  │────▶│   PostgreSQL    │
│  (HTTP GET)     │     │   (Scheduler)   │     │   (Storage)     │
└─────────────────┘     └────────┬────────┘     └────────┬────────┘
                                 │                       │
┌─────────────────┐              │                       ▼
│ Anthropic Blog  │──────────────┘               ┌─────────────────┐
│ (Playwright)    │                              │  Next.js App    │
└─────────────────┘                              │  (Dashboard)    │
         ▲                                       └─────────────────┘
         │
┌─────────────────┐
│   Claude API    │
│  (Analysis)     │
└─────────────────┘
```

**Step 2: Commit**

```bash
git add README.md
git commit -m "docs: update README for RSS-based architecture"
```

---

### Task 6: Update ARCHITECTURE.md

**Files:**
- Modify: `docs/ARCHITECTURE.md`

**Step 1: Update architecture docs**

Key changes:
- Update "Sources & Methods" table — all sources now RSS except Anthropic
- Remove Playwright rate limit concerns for 7 sources
- Update workflow diagram to show RSS Read nodes
- Remove Docker references
- Note that engagement data (upvotes/comments) is no longer available for most sources via RSS

**Step 2: Commit**

```bash
git add docs/ARCHITECTURE.md
git commit -m "docs: update architecture docs for RSS migration"
```

---

### Task 7: Update types to include new source

**Files:**
- Modify: `src/lib/types.ts`

**Step 1: Check if `google_ai_blog` needs to be added as a source type**

Read `src/lib/types.ts` and add `google_ai_blog` to the source union type if one exists.

**Step 2: Commit (if changes needed)**

```bash
git add src/lib/types.ts
git commit -m "feat: add google_ai_blog source type"
```

---

### Task 8: Verify and test

**Step 1: Install crawler dependencies**

```bash
cd crawlers && npm install && cd ..
```

**Step 2: Test Anthropic crawler runs**

```bash
cd crawlers && npx tsx anthropic-crawler.ts
```

Expected: JSON array of blog posts printed to stdout.

**Step 3: Verify n8n workflow JSON is valid**

```bash
node -e "JSON.parse(require('fs').readFileSync('n8n/main-workflow.json', 'utf8')); console.log('Valid JSON')"
```

Expected: `Valid JSON`

**Step 4: Verify dashboard still builds**

```bash
npm run build
```

Expected: Build succeeds with no errors.

**Step 5: Commit any fixes**

If any issues found, fix and commit.
