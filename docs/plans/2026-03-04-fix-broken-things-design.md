# Fix Broken Things — Design

**Date:** 2026-03-04
**Goal:** Fix all broken, stale, and dead code in the dashboard. No redesign, no new features — just make what exists correct and functional.

## Scope

### Critical (actively wrong)
1. **Hydration mismatch** — `Math.random()` in `mockSentimentHistory` at module scope produces different values server vs client. Fix: make deterministic.
2. **SQL interpolation** — `db.ts` string-interpolates `days` param in `getTrendingTopics` and `getSentimentHistory`. Fix: parameterized queries.
3. **Source filter dead** — dropdown has no onChange/state. Fix: wire up filtering.
4. **Loading state unused** — `loading` is set but never rendered. Fix: add loading indicator.
5. **Sequential API calls** — 4 `await fetch()` in series. Fix: `Promise.all`.

### Important (stale content)
6. **Footer tech stack** — says "Playwright — Web crawling". Fix: "RSS feeds — Data ingestion".
7. **Footer data sources** — missing Google AI Blog. Fix: update list.
8. **Mock data** — missing `google_ai_blog` in sourceStats and crawlStatus. Fix: add it.
9. **Hardcoded stats** — "12% vs yesterday", "from arXiv". Fix: derive from data or remove.
10. **Header GitHub URL** — `pkindlmann` → `petr-kin`.

### Cleanup
11. **Dead utils** — remove `truncateText`, `getChangeIndicator`, `getSentimentLabel`.
12. **Dead mock data** — remove `mockVolumeBySource`.
13. **Remove `date-fns`** — unused dependency.
14. **Google Fonts** — switch from CSS `@import` to `next/font`.

## What stays the same
- All component visual design
- All API route structure
- DB schema
- n8n workflows
