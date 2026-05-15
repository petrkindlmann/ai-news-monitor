# AI News Monitor

Weekly field notes from the AI firehose. A static zine generated every Monday by a Claude-powered curation pipeline.

**Live:** [ai-news.kindlmann.com](https://ai-news.kindlmann.com)

## How it works

1. A GitHub Action runs every Monday 09:00 UTC.
2. `scripts/build-issue.ts` fetches ~8 AI RSS feeds, pre-filters, then runs a 3-stage Claude pipeline:
   - **Rank** every item (Haiku) on signal vs hype.
   - **Cluster** related stories to avoid duplicate coverage.
   - **Write** the issue (Sonnet) with editor's letter, story blurbs, and "Hype I'm ignoring."
3. The result is committed to `content/issues/YYYY-Www.json`.
4. Cloudflare Pages auto-deploys the static site.

## Stack

- Next.js 14 (static export)
- TypeScript scripts (run via `tsx`)
- `rss-parser`, `zod`
- `@anthropic-ai/sdk` — Claude Haiku 4.5 + Sonnet 4.6
- GitHub Actions (cron)
- Cloudflare Pages

## Local dev

```bash
npm install
cp .env.example .env.local   # paste your ANTHROPIC_API_KEY
npm run build-issue          # generates content/issues/<slug>.json
npm run dev                  # http://localhost:3000
```
