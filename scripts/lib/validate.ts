import { Issue, RawItem } from './types';
import { IssueSchema } from './schema';

export interface ValidationOptions {
  force?: boolean;
  minStories?: number;
  maxStories?: number;
}

export interface ValidationResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
}

export function validateIssue(
  issue: Issue,
  rawItems: RawItem[],
  opts: ValidationOptions = {}
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const schemaResult = IssueSchema.safeParse(issue);
  if (!schemaResult.success) {
    errors.push('Schema validation failed:');
    schemaResult.error.issues.forEach(i => errors.push(`  ${i.path.join('.')}: ${i.message}`));
  }

  const allStories = issue.sections.flatMap(s => s.stories);
  const minStories = opts.minStories ?? 8;
  const maxStories = opts.maxStories ?? 15;

  if (allStories.length < minStories) errors.push(`Too few stories: ${allStories.length} (min ${minStories})`);
  if (allStories.length > maxStories) errors.push(`Too many stories: ${allStories.length} (max ${maxStories})`);

  // Editor letter length
  const wordCount = (s: string) => s.trim().split(/\s+/).length;
  if (wordCount(issue.editorLetter) > 250) errors.push(`Editor letter too long: ${wordCount(issue.editorLetter)} words (max 250)`);

  // Blurb length
  allStories.forEach((s, idx) => {
    if (wordCount(s.blurb) > 80) errors.push(`Story #${idx + 1} blurb too long: ${wordCount(s.blurb)} words (max 80)`);
  });

  // Grounding: every story URL must exist in raw items
  const rawUrls = new Set(rawItems.map(r => r.url));
  allStories.forEach(s => {
    if (!rawUrls.has(s.url)) errors.push(`Story URL not in source feeds: ${s.url}`);
  });

  // Unique URLs
  const urls = allStories.map(s => s.url);
  const dup = urls.find((u, i) => urls.indexOf(u) !== i);
  if (dup) errors.push(`Duplicate story URL: ${dup}`);

  // Source diversity
  const sources = new Set(allStories.map(s => s.source));
  if (sources.size < 4) warnings.push(`Only ${sources.size} distinct sources (recommend >=4)`);

  // Reddit/HN cap
  const discussionCount = allStories.filter(s =>
    /hacker news|reddit/i.test(s.source)
  ).length;
  if (discussionCount > 3) warnings.push(`Too many discussion-board stories: ${discussionCount} (recommend <=3)`);

  return { ok: opts.force ? true : errors.length === 0, errors, warnings };
}
