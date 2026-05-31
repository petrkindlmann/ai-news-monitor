export type SourceId =
  | 'hackernews'
  | 'reddit-ml'
  | 'reddit-localllama'
  | 'techcrunch-ai'
  | 'openai-blog'
  | 'deepmind-blog'
  | 'google-ai-blog'
  | 'arxiv-cs-ai';

export interface RawItem {
  id: string;            // stable hash of url
  source: SourceId;
  sourceLabel: string;   // pretty name for UI
  title: string;
  url: string;
  publishedAt: string;   // ISO 8601
  author?: string;
  summary?: string;
  contentSnippet?: string;
  tags?: string[];
}

export interface RankedItem extends RawItem {
  score: number;         // 0-25
  category: 'models' | 'research' | 'tools' | 'open-source' | 'policy' | 'business' | 'security' | 'infra';
  reason: string;
  keep: boolean;
}

export interface Cluster {
  clusterTitle: string;
  canonicalItemId: string;
  supportingItemIds: string[];
  whyItMatters: string;
  angle: string;
}

export type StoryLabel = 'Signal' | 'Tool' | 'Research' | 'Model' | 'Policy' | 'Drama' | 'Ignore';

export interface Story {
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  label: StoryLabel;
  blurb: string;
  whyItMatters: string;
  takeaway: string;
  heat: 1 | 2 | 3 | 4 | 5;
}

export interface IssueSection {
  title: string;
  description: string;
  stories: Story[];
}

export interface Issue {
  issueTitle: string;
  slug: string;                // e.g. "2026-W20"
  publishedAt: string;
  weekRange: { start: string; end: string };
  editorLetter: string;
  sections: IssueSection[];
  oneThingToTry: string;
  watchNext: string[];
}

export interface FeedHealth {
  source: SourceId;
  lastSuccessfulFetch: string;
  itemsFetched: number;
  status: 'ok' | 'empty' | 'error';
  error?: string;
}
