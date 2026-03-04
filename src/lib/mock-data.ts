import { NewsItem, TrendData, SourceStats, DailySummary, CrawlStatus } from './types';

// Generate realistic mock data
const now = new Date();

export const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'Claude 4.5 Opus Released: New Benchmark in Reasoning and Code',
    url: 'https://anthropic.com/news/claude-4-5',
    source: 'anthropic_blog',
    publishedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    crawledAt: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
    sentiment: 'positive',
    sentimentScore: 0.85,
    summary: 'Anthropic releases Claude 4.5 Opus with significant improvements in reasoning, coding, and multi-step task completion.',
    topics: ['claude', 'anthropic', 'llm-release', 'benchmarks'],
    mentions: [
      { entity: 'Claude', count: 12 },
      { entity: 'Anthropic', count: 8 },
      { entity: 'GPT-4', count: 3 },
    ],
    engagement: { upvotes: 842, comments: 156 },
  },
  {
    id: '2',
    title: 'OpenAI Announces GPT-5 Development Timeline',
    url: 'https://openai.com/blog/gpt5-timeline',
    source: 'openai_blog',
    publishedAt: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
    crawledAt: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
    sentiment: 'positive',
    sentimentScore: 0.72,
    summary: 'OpenAI shares expected timeline for GPT-5, emphasizing safety testing and capability improvements.',
    topics: ['openai', 'gpt-5', 'ai-safety', 'llm-release'],
    mentions: [
      { entity: 'OpenAI', count: 15 },
      { entity: 'GPT-5', count: 9 },
      { entity: 'Sam Altman', count: 4 },
    ],
    engagement: { upvotes: 1203, comments: 423 },
  },
  {
    id: '3',
    title: 'EU AI Act Implementation Begins: What Companies Need to Know',
    url: 'https://techcrunch.com/eu-ai-act-implementation',
    source: 'techcrunch',
    publishedAt: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(),
    crawledAt: new Date(now.getTime() - 7 * 60 * 60 * 1000).toISOString(),
    sentiment: 'neutral',
    sentimentScore: 0.1,
    summary: 'First phase of EU AI Act takes effect, requiring high-risk AI systems to meet new compliance standards.',
    topics: ['regulation', 'eu-ai-act', 'compliance', 'policy'],
    mentions: [
      { entity: 'EU', count: 18 },
      { entity: 'AI Act', count: 12 },
      { entity: 'OpenAI', count: 3 },
      { entity: 'Google', count: 2 },
    ],
    engagement: { upvotes: 567, comments: 234 },
  },
  {
    id: '4',
    title: 'Local LLMs Match GPT-4 on Coding Tasks: Qwen2.5-Coder Benchmark Results',
    url: 'https://reddit.com/r/LocalLLaMA/qwen-coder-benchmark',
    source: 'reddit_locallama',
    publishedAt: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
    crawledAt: new Date(now.getTime() - 11 * 60 * 60 * 1000).toISOString(),
    sentiment: 'positive',
    sentimentScore: 0.78,
    summary: 'Community benchmarks show Qwen2.5-Coder-32B matching GPT-4 performance on HumanEval and MBPP coding benchmarks.',
    topics: ['local-llm', 'qwen', 'coding', 'benchmarks', 'open-source'],
    mentions: [
      { entity: 'Qwen', count: 8 },
      { entity: 'GPT-4', count: 6 },
      { entity: 'Llama', count: 3 },
    ],
    engagement: { upvotes: 2341, comments: 567 },
  },
  {
    id: '5',
    title: 'DeepMind Gemini 2.0 Achieves State-of-the-Art on Math Olympiad',
    url: 'https://deepmind.google/gemini-2-math',
    source: 'deepmind_blog',
    publishedAt: new Date(now.getTime() - 18 * 60 * 60 * 1000).toISOString(),
    crawledAt: new Date(now.getTime() - 17 * 60 * 60 * 1000).toISOString(),
    sentiment: 'positive',
    sentimentScore: 0.91,
    summary: 'Gemini 2.0 solves 85% of International Math Olympiad problems, surpassing previous AI systems.',
    topics: ['deepmind', 'gemini', 'math', 'benchmarks', 'reasoning'],
    mentions: [
      { entity: 'Gemini', count: 14 },
      { entity: 'DeepMind', count: 9 },
      { entity: 'Google', count: 5 },
    ],
    engagement: { upvotes: 1567, comments: 312 },
  },
  {
    id: '6',
    title: 'Concerns Raised Over AI Training Data Consent',
    url: 'https://news.ycombinator.com/item?id=39234567',
    source: 'hacker_news',
    publishedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
    crawledAt: new Date(now.getTime() - 23 * 60 * 60 * 1000).toISOString(),
    sentiment: 'negative',
    sentimentScore: -0.45,
    summary: 'Discussion on ethical concerns around AI companies using web content for training without explicit consent.',
    topics: ['ethics', 'training-data', 'copyright', 'consent'],
    mentions: [
      { entity: 'OpenAI', count: 7 },
      { entity: 'Meta', count: 5 },
      { entity: 'Google', count: 4 },
    ],
    engagement: { upvotes: 923, comments: 456 },
  },
  {
    id: '7',
    title: 'Attention Is All You Need: 7 Years Later - Impact Analysis',
    url: 'https://arxiv.org/abs/2411.xxxxx',
    source: 'arxiv',
    publishedAt: new Date(now.getTime() - 36 * 60 * 60 * 1000).toISOString(),
    crawledAt: new Date(now.getTime() - 35 * 60 * 60 * 1000).toISOString(),
    sentiment: 'neutral',
    sentimentScore: 0.25,
    summary: 'Retrospective analysis of transformer architecture impact on NLP, computer vision, and beyond.',
    topics: ['transformers', 'research', 'nlp', 'architecture'],
    mentions: [
      { entity: 'Transformer', count: 23 },
      { entity: 'Google', count: 8 },
      { entity: 'BERT', count: 5 },
    ],
    engagement: { score: 156 },
  },
  {
    id: '8',
    title: 'Microsoft Copilot Gets Major Enterprise Update',
    url: 'https://techcrunch.com/microsoft-copilot-enterprise',
    source: 'techcrunch',
    publishedAt: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(),
    crawledAt: new Date(now.getTime() - 47 * 60 * 60 * 1000).toISOString(),
    sentiment: 'positive',
    sentimentScore: 0.55,
    summary: 'Microsoft announces Copilot enterprise features including custom knowledge bases and enhanced security.',
    topics: ['microsoft', 'copilot', 'enterprise', 'productivity'],
    mentions: [
      { entity: 'Microsoft', count: 12 },
      { entity: 'Copilot', count: 9 },
      { entity: 'OpenAI', count: 4 },
    ],
    engagement: { upvotes: 445, comments: 123 },
  },
  {
    id: '9',
    title: 'AI Chip Shortage Expected to Ease in 2025',
    url: 'https://news.ycombinator.com/item?id=39234890',
    source: 'hacker_news',
    publishedAt: new Date(now.getTime() - 52 * 60 * 60 * 1000).toISOString(),
    crawledAt: new Date(now.getTime() - 51 * 60 * 60 * 1000).toISOString(),
    sentiment: 'positive',
    sentimentScore: 0.42,
    summary: 'NVIDIA and AMD ramp up production, analysts predict improved GPU availability for AI workloads.',
    topics: ['hardware', 'nvidia', 'gpu', 'supply-chain'],
    mentions: [
      { entity: 'NVIDIA', count: 11 },
      { entity: 'AMD', count: 6 },
      { entity: 'H100', count: 4 },
    ],
    engagement: { upvotes: 678, comments: 234 },
  },
  {
    id: '10',
    title: 'r/MachineLearning Weekly: Best Papers from NeurIPS 2024',
    url: 'https://reddit.com/r/MachineLearning/neurips-best-papers',
    source: 'reddit_ml',
    publishedAt: new Date(now.getTime() - 72 * 60 * 60 * 1000).toISOString(),
    crawledAt: new Date(now.getTime() - 71 * 60 * 60 * 1000).toISOString(),
    sentiment: 'positive',
    sentimentScore: 0.68,
    summary: 'Community discussion on standout papers from NeurIPS 2024, focusing on efficiency and interpretability.',
    topics: ['neurips', 'research', 'papers', 'conference'],
    mentions: [
      { entity: 'NeurIPS', count: 15 },
      { entity: 'Transformer', count: 6 },
      { entity: 'Meta', count: 4 },
    ],
    engagement: { upvotes: 1234, comments: 345 },
  },
];

export const mockTrends: TrendData[] = [
  { topic: 'Claude', count: 156, change: 45, sentiment: 'positive' },
  { topic: 'GPT-5', count: 134, change: 120, sentiment: 'positive' },
  { topic: 'EU AI Act', count: 89, change: 15, sentiment: 'neutral' },
  { topic: 'Local LLMs', count: 78, change: 32, sentiment: 'positive' },
  { topic: 'AI Safety', count: 67, change: -5, sentiment: 'neutral' },
  { topic: 'Gemini', count: 54, change: 28, sentiment: 'positive' },
  { topic: 'Training Data', count: 45, change: 67, sentiment: 'negative' },
  { topic: 'Coding AI', count: 43, change: 12, sentiment: 'positive' },
];

export const mockSourceStats: SourceStats[] = [
  { source: 'hacker_news', totalItems: 1234, avgSentiment: 0.35, lastCrawled: new Date(now.getTime() - 30 * 60 * 1000).toISOString() },
  { source: 'techcrunch', totalItems: 456, avgSentiment: 0.42, lastCrawled: new Date(now.getTime() - 45 * 60 * 1000).toISOString() },
  { source: 'anthropic_blog', totalItems: 89, avgSentiment: 0.78, lastCrawled: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString() },
  { source: 'openai_blog', totalItems: 123, avgSentiment: 0.72, lastCrawled: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString() },
  { source: 'deepmind_blog', totalItems: 67, avgSentiment: 0.81, lastCrawled: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString() },
  { source: 'reddit_ml', totalItems: 2345, avgSentiment: 0.28, lastCrawled: new Date(now.getTime() - 15 * 60 * 1000).toISOString() },
  { source: 'reddit_locallama', totalItems: 1567, avgSentiment: 0.45, lastCrawled: new Date(now.getTime() - 20 * 60 * 1000).toISOString() },
  { source: 'arxiv', totalItems: 890, avgSentiment: 0.15, lastCrawled: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString() },
];

export const mockDailySummary: DailySummary = {
  date: new Date().toISOString().split('T')[0],
  totalItems: 47,
  sentimentBreakdown: {
    positive: 28,
    negative: 7,
    neutral: 12,
  },
  topTopics: mockTrends.slice(0, 5),
  highlights: [
    'Claude 4.5 Opus release dominates discussion with highly positive reception',
    'OpenAI GPT-5 timeline announcement sparks speculation about capabilities',
    'EU AI Act implementation begins, creating compliance discussions',
    'Local LLM community celebrates Qwen2.5-Coder matching GPT-4 benchmarks',
  ],
};

export const mockCrawlStatus: CrawlStatus[] = [
  { source: 'hacker_news', lastRun: new Date(now.getTime() - 30 * 60 * 1000).toISOString(), nextRun: new Date(now.getTime() + 90 * 60 * 1000).toISOString(), status: 'success', itemsCollected: 23 },
  { source: 'techcrunch', lastRun: new Date(now.getTime() - 45 * 60 * 1000).toISOString(), nextRun: new Date(now.getTime() + 75 * 60 * 1000).toISOString(), status: 'success', itemsCollected: 8 },
  { source: 'anthropic_blog', lastRun: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), nextRun: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString(), status: 'success', itemsCollected: 1 },
  { source: 'openai_blog', lastRun: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(), nextRun: new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString(), status: 'success', itemsCollected: 2 },
  { source: 'reddit_ml', lastRun: new Date(now.getTime() - 15 * 60 * 1000).toISOString(), nextRun: new Date(now.getTime() + 105 * 60 * 1000).toISOString(), status: 'running', itemsCollected: 0 },
  { source: 'reddit_locallama', lastRun: new Date(now.getTime() - 20 * 60 * 1000).toISOString(), nextRun: new Date(now.getTime() + 100 * 60 * 1000).toISOString(), status: 'success', itemsCollected: 15 },
  { source: 'arxiv', lastRun: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(), nextRun: new Date(now.getTime() + 6 * 60 * 60 * 1000).toISOString(), status: 'error', itemsCollected: 0, errorMessage: 'Rate limit exceeded' },
];

// Chart data for sentiment over time
export const mockSentimentHistory = Array.from({ length: 14 }, (_, i) => {
  const date = new Date(now.getTime() - (13 - i) * 24 * 60 * 60 * 1000);
  return {
    date: date.toISOString().split('T')[0],
    positive: Math.floor(Math.random() * 30) + 20,
    negative: Math.floor(Math.random() * 15) + 5,
    neutral: Math.floor(Math.random() * 20) + 10,
  };
});

// Volume by source for charts
export const mockVolumeBySource = mockSourceStats.map(s => ({
  source: s.source,
  count: Math.floor(Math.random() * 50) + 10,
}));
