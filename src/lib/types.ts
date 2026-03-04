export type Sentiment = 'positive' | 'negative' | 'neutral';

export type Source = 
  | 'hacker_news'
  | 'techcrunch'
  | 'anthropic_blog'
  | 'openai_blog'
  | 'deepmind_blog'
  | 'reddit_ml'
  | 'reddit_locallama'
  | 'arxiv'
  | 'google_ai_blog';

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: Source;
  publishedAt: string;
  crawledAt: string;
  sentiment: Sentiment;
  sentimentScore: number; // -1 to 1
  summary?: string;
  topics: string[];
  mentions: {
    entity: string;
    count: number;
  }[];
  engagement?: {
    score?: number;
    comments?: number;
    upvotes?: number;
  };
}

export interface TrendData {
  topic: string;
  count: number;
  change: number; // percentage change from previous period
  sentiment: Sentiment;
}

export interface SourceStats {
  source: Source;
  totalItems: number;
  avgSentiment: number;
  lastCrawled: string;
}

export interface DailySummary {
  date: string;
  totalItems: number;
  sentimentBreakdown: {
    positive: number;
    negative: number;
    neutral: number;
  };
  topTopics: TrendData[];
  highlights: string[];
}

export interface CrawlStatus {
  source: Source;
  lastRun: string;
  nextRun: string;
  status: 'success' | 'error' | 'running';
  itemsCollected: number;
  errorMessage?: string;
}

export const SOURCE_LABELS: Record<Source, string> = {
  hacker_news: 'Hacker News',
  techcrunch: 'TechCrunch',
  anthropic_blog: 'Anthropic',
  openai_blog: 'OpenAI',
  deepmind_blog: 'DeepMind',
  reddit_ml: 'r/MachineLearning',
  reddit_locallama: 'r/LocalLLaMA',
  arxiv: 'arXiv',
  google_ai_blog: 'Google AI',
};

export const SOURCE_COLORS: Record<Source, string> = {
  hacker_news: '#ff6600',
  techcrunch: '#0a9e01',
  anthropic_blog: '#d4a574',
  openai_blog: '#10a37f',
  deepmind_blog: '#4285f4',
  reddit_ml: '#ff4500',
  reddit_locallama: '#ff4500',
  arxiv: '#b31b1b',
  google_ai_blog: '#34a853',
};
