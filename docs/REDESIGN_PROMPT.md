# Design Prompt — AI News Monitor redesign

Redesign **AI News Monitor**, a weekly AI-news zine for builders who want *signal, not another firehose*. It is a static, hand-edited weekly publication with a single, opinionated editorial voice. Right now it renders as one long unstyled column of posts with no navigation or identity. The redesign should turn it into a real publication: a cohesive **editorial print-zine** look plus proper site structure and navigation.

## Visual direction — editorial print zine

Think a well-made print magazine / paper newsletter, not a SaaS dashboard or a terminal.

- **Tone:** warm, calm, confident, readable. Whitespace is a feature.
- **Type:** serif display headlines (large, with real hierarchy); clean sans or serif body; a mono accent only for metadata (dates, labels, source names).
- **Palette:** paper/stone neutrals — off-white background (`stone-50`), near-black ink (`stone-900`), muted grays for secondary text, hairline rules (`stone-300`). One restrained accent color for labels/heat — pick something editorial (e.g. a deep red or ink-blue), not neon.
- **Masthead:** a proper publication masthead at the top — wordmark + tagline ("Weekly field notes from the AI firehose") + issue number / week range.
- **Do NOT** use a dark "void" background, neon-on-black, or a cyber/terminal aesthetic. (The current codebase has a leftover dark grid theme — discard it.)

## Site structure / navigation

Global masthead nav present on every page, linking:

1. **Home** — the latest issue, rendered in full.
2. **Archive** — an index page listing all past issues by week (issue number, week range, title, a one-line teaser). Each links to its issue page.
3. **Issue page** — a single back-issue, same layout as home.
4. **About** — who's behind it and the editorial promise (signal, not firehose).
5. **Subscribe / RSS** — email-signup placeholder and an RSS link (can live in the nav and footer).

## Per-issue layout

A single issue is the core reading experience. In order:

1. **Issue header** — issue title, issue number, week range, publish date.
2. **Editor's letter** — short italic intro, set apart like a column lede.
3. **Sticky section jump-nav** — lets the reader jump between sections (Models / Research / Tools / Open Source / etc.); highlights the active section on scroll.
4. **Sections** — each has a title + italic description, then a list of **story cards**.
5. **One Thing To Try** — a single highlighted callout.
6. **Watch Next Week** — a short arrow list of things to watch.
7. **Hype I'm Ignoring** — a list of `theme — reason` pairs, styled as a deliberately understated "skipped" list.

### Story card

Each story should show, scannably:
- **Title** (links out to `url`)
- **Label** — one of: Signal, Tool, Research, Model, Policy, Drama (small colored tag)
- **Heat** — a 1–5 indicator (e.g. filled bars/dots), visually distinct from the label
- **Source** + **publish date** (mono metadata)
- **Blurb** — 1–2 sentence summary
- **Why it matters** — short
- **Takeaway** — short, set apart (e.g. emphasized or pull-quote style)

## Real data shape

Design against this actual content model, not lorem ipsum:

```ts
interface Issue {
  issueTitle: string;
  slug: string;                 // "2026-W22"
  publishedAt: string;          // ISO
  weekRange: { start: string; end: string };
  editorLetter: string;
  sections: {
    title: string;
    description: string;
    stories: {
      title: string;
      source: string;
      url: string;
      publishedAt: string;
      label: 'Signal' | 'Tool' | 'Research' | 'Model' | 'Policy' | 'Drama';
      blurb: string;
      whyItMatters: string;
      takeaway: string;
      heat: 1 | 2 | 3 | 4 | 5;
    }[];
  }[];
  oneThingToTry: string;
  watchNext: string[];
  ignoredThisWeek: { theme: string; reason: string }[];
}
```

## Technical constraints

- **Next.js (App Router) with static export** — `output: 'export'`, all pages prerendered. No database, no server, no API routes, no client-side data fetching. Issues are JSON files read at build time.
- **Tailwind CSS** for styling.
- Must stay fully static and deployable as flat files.
- Responsive: reads well on mobile (single column, collapsible nav) and desktop.

## Deliverable

A complete, polished editorial-zine front end: global masthead + nav + footer, the four page types above, the issue layout, and a reusable story-card component — all driven by the data shape above.
