import Parser from 'rss-parser';
import { createHash } from 'node:crypto';
import { RawItem, SourceId, FeedHealth } from './types';

interface FeedConfig {
  id: SourceId;
  label: string;
  url: string;
}

export const FEEDS: FeedConfig[] = [
  { id: 'hackernews',        label: 'Hacker News',         url: 'https://hnrss.org/newest?q=AI+OR+LLM' },
  { id: 'reddit-ml',         label: 'r/MachineLearning',   url: 'https://www.reddit.com/r/MachineLearning/.rss' },
  { id: 'reddit-localllama', label: 'r/LocalLLaMA',        url: 'https://www.reddit.com/r/LocalLLaMA/.rss' },
  { id: 'techcrunch-ai',     label: 'TechCrunch AI',       url: 'https://techcrunch.com/category/artificial-intelligence/feed/' },
  { id: 'openai-blog',       label: 'OpenAI Blog',         url: 'https://openai.com/blog/rss.xml' },
  { id: 'deepmind-blog',     label: 'DeepMind',            url: 'https://deepmind.google/blog/rss.xml' },
  { id: 'google-ai-blog',    label: 'Google AI',           url: 'https://blog.google/technology/ai/rss/' },
  { id: 'arxiv-cs-ai',       label: 'arXiv cs.AI',         url: 'https://rss.arxiv.org/rss/cs.AI' },
];

const parser = new Parser({
  headers: { 'User-Agent': 'ai-news-monitor/1.0 (+https://ai-news.kindlmann.com)' },
  timeout: 20000,
});

function itemId(url: string): string {
  return createHash('sha1').update(url).digest('hex').slice(0, 12);
}

export async function fetchFeed(cfg: FeedConfig): Promise<{ items: RawItem[]; health: FeedHealth }> {
  try {
    const feed = await parser.parseURL(cfg.url);
    const items: RawItem[] = (feed.items || [])
      .filter(i => i.link && i.title)
      .map(i => ({
        id: itemId(i.link!),
        source: cfg.id,
        sourceLabel: cfg.label,
        title: i.title!.trim(),
        url: i.link!,
        publishedAt: (i.isoDate || i.pubDate || new Date().toISOString()),
        author: i.creator || i.author,
        summary: i.contentSnippet?.slice(0, 800),
        contentSnippet: i.contentSnippet?.slice(0, 1200),
        tags: i.categories,
      }));
    return {
      items,
      health: {
        source: cfg.id,
        lastSuccessfulFetch: new Date().toISOString(),
        itemsFetched: items.length,
        status: items.length === 0 ? 'empty' : 'ok',
      },
    };
  } catch (err) {
    return {
      items: [],
      health: {
        source: cfg.id,
        lastSuccessfulFetch: new Date(0).toISOString(),
        itemsFetched: 0,
        status: 'error',
        error: err instanceof Error ? err.message : String(err),
      },
    };
  }
}

export async function fetchAllFeeds(): Promise<{ items: RawItem[]; health: FeedHealth[] }> {
  const results = await Promise.all(FEEDS.map(fetchFeed));
  return {
    items: results.flatMap(r => r.items),
    health: results.map(r => r.health),
  };
}
