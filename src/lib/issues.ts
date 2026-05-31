import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Issue } from './types';

const ISSUES_DIR = resolve(process.cwd(), 'content/issues');

const SLUG_RE = /^\d{4}-W\d{2}\.json$/;

/** All issues, newest-first by slug (e.g. 2026-W22 before 2026-W20). */
export function getAllIssues(): Issue[] {
  return readdirSync(ISSUES_DIR)
    .filter((f) => SLUG_RE.test(f))
    .map((f) => JSON.parse(readFileSync(resolve(ISSUES_DIR, f), 'utf8')) as Issue)
    .sort((a, b) => b.slug.localeCompare(a.slug));
}

export function getIssue(slug: string): Issue | null {
  try {
    return JSON.parse(readFileSync(resolve(ISSUES_DIR, `${slug}.json`), 'utf8')) as Issue;
  } catch {
    return null;
  }
}

/** Slug of the newest issue — the one served at "/". */
export function getLatestSlug(): string {
  return getAllIssues()[0]?.slug ?? '';
}

export * from './format';
