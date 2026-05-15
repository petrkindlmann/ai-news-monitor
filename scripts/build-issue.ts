#!/usr/bin/env tsx
import { writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fetchAllFeeds } from './lib/feeds';
import { prefilter } from './lib/prefilter';
import { rankItems } from './lib/rank';
import { clusterItems } from './lib/cluster';
import { writeIssue } from './lib/write-issue';
import { validateIssue } from './lib/validate';
import { issueSlug } from './lib/week';

const ROOT = process.cwd();
const ISSUES_DIR = resolve(ROOT, 'content/issues');
const DEBUG_DIR = resolve(ROOT, 'scripts/output');

async function writeJson(path: string, data: unknown): Promise<void> {
  await mkdir(resolve(path, '..'), { recursive: true });
  await writeFile(path, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

async function main() {
  const force = process.argv.includes('--force');
  const now = new Date();
  const slug = issueSlug(now);

  console.log(`[build-issue] Building issue ${slug} (force=${force})`);

  console.log('[A] Fetching feeds...');
  const { items: rawAll, health } = await fetchAllFeeds();
  await writeJson(resolve(DEBUG_DIR, 'feed-health.json'), health);
  console.log(`     ${rawAll.length} raw items across ${health.length} feeds`);
  health.forEach(h => console.log(`     - ${h.source}: ${h.status} (${h.itemsFetched})`));

  console.log('[B] Pre-filtering...');
  const filtered = prefilter(rawAll, now);
  await writeJson(resolve(DEBUG_DIR, 'filtered.json'), filtered);
  console.log(`     ${filtered.length} items after pre-filter`);

  if (filtered.length < 10 && !force) {
    throw new Error(`Only ${filtered.length} items after pre-filter; refusing to build (use --force to override)`);
  }

  console.log('[C] Ranking with Haiku...');
  const ranked = await rankItems(filtered);
  await writeJson(resolve(DEBUG_DIR, 'ranked.json'), ranked);
  console.log(`     ${ranked.filter(r => r.keep).length}/${ranked.length} items marked keep`);

  console.log('[D] Clustering...');
  const clusters = await clusterItems(ranked);
  await writeJson(resolve(DEBUG_DIR, 'clusters.json'), clusters);
  console.log(`     ${clusters.length} clusters`);

  console.log('[E] Writing issue with Sonnet...');
  const issue = await writeIssue(clusters, ranked, now);
  await writeJson(resolve(DEBUG_DIR, 'issue-draft.json'), issue);

  console.log('[F] Validating...');
  const result = validateIssue(issue, rawAll, { force });
  result.warnings.forEach(w => console.warn(`     WARN: ${w}`));
  if (!result.ok) {
    result.errors.forEach(e => console.error(`     ERR:  ${e}`));
    throw new Error('Validation failed. Use --force to publish anyway.');
  }

  const issuePath = resolve(ISSUES_DIR, `${slug}.json`);
  const latestPath = resolve(ISSUES_DIR, 'latest.json');
  await writeJson(issuePath, issue);
  await writeJson(latestPath, issue);
  console.log(`[done] Wrote ${issuePath}`);
  console.log(`[done] Wrote ${latestPath}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
