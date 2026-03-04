import { Pool } from 'pg';
import { NewsItem, TrendData, SourceStats, DailySummary, CrawlStatus, Source } from './types';

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// News queries
export async function getRecentNews(limit: number = 50, source?: Source): Promise<NewsItem[]> {
  const query = source
    ? `SELECT * FROM v_recent_news WHERE source = $1 ORDER BY published_at DESC LIMIT $2`
    : `SELECT * FROM v_recent_news ORDER BY published_at DESC LIMIT $1`;
  
  const params = source ? [source, limit] : [limit];
  const result = await pool.query(query, params);
  
  return result.rows.map(row => ({
    id: row.id.toString(),
    title: row.title,
    url: row.url,
    source: row.source as Source,
    publishedAt: row.published_at,
    crawledAt: row.crawled_at,
    sentiment: row.sentiment || 'neutral',
    sentimentScore: parseFloat(row.sentiment_score) || 0,
    summary: row.summary,
    topics: row.topics || [],
    mentions: [],
    engagement: {
      upvotes: row.upvotes ? parseInt(row.upvotes) : undefined,
      comments: row.comments ? parseInt(row.comments) : undefined,
      score: row.score ? parseInt(row.score) : undefined,
    },
  }));
}

export async function getNewsById(id: string): Promise<NewsItem | null> {
  const result = await pool.query(
    `SELECT * FROM news_items WHERE id = $1`,
    [id]
  );
  
  if (result.rows.length === 0) return null;
  
  const row = result.rows[0];
  return {
    id: row.id.toString(),
    title: row.title,
    url: row.url,
    source: row.source as Source,
    publishedAt: row.published_at,
    crawledAt: row.crawled_at,
    sentiment: row.sentiment || 'neutral',
    sentimentScore: parseFloat(row.sentiment_score) || 0,
    summary: row.summary,
    topics: row.topics || [],
    mentions: [],
    engagement: row.engagement || {},
  };
}

// Trends queries
export async function getTrendingTopics(days: number = 7): Promise<TrendData[]> {
  const result = await pool.query(`
    WITH topic_counts AS (
      SELECT
        unnest(topics) as topic,
        COUNT(*) as current_count,
        AVG(sentiment_score) as avg_sentiment
      FROM news_items
      WHERE published_at > NOW() - ($1 * INTERVAL '1 day')
      GROUP BY unnest(topics)
    ),
    previous_counts AS (
      SELECT
        unnest(topics) as topic,
        COUNT(*) as previous_count
      FROM news_items
      WHERE published_at BETWEEN NOW() - ($2 * INTERVAL '1 day') AND NOW() - ($1 * INTERVAL '1 day')
      GROUP BY unnest(topics)
    )
    SELECT
      tc.topic,
      tc.current_count as count,
      tc.avg_sentiment,
      COALESCE(
        ROUND(((tc.current_count - COALESCE(pc.previous_count, 0))::numeric /
        NULLIF(COALESCE(pc.previous_count, 1), 0) * 100), 0),
        0
      ) as change
    FROM topic_counts tc
    LEFT JOIN previous_counts pc ON tc.topic = pc.topic
    ORDER BY tc.current_count DESC
    LIMIT 20
  `, [days, days * 2]);
  
  return result.rows.map(row => ({
    topic: row.topic,
    count: parseInt(row.count),
    change: parseInt(row.change),
    sentiment: row.avg_sentiment > 0.2 ? 'positive' : row.avg_sentiment < -0.2 ? 'negative' : 'neutral',
  }));
}

// Source stats
export async function getSourceStats(): Promise<SourceStats[]> {
  const result = await pool.query(`SELECT * FROM v_source_stats`);
  
  return result.rows.map(row => ({
    source: row.source as Source,
    totalItems: parseInt(row.total_items),
    avgSentiment: parseFloat(row.avg_sentiment) || 0,
    lastCrawled: row.last_crawled,
  }));
}

// Crawl status
export async function getCrawlStatus(): Promise<CrawlStatus[]> {
  const result = await pool.query(`
    SELECT DISTINCT ON (source)
      source,
      started_at as last_run,
      status,
      items_collected,
      error_message
    FROM crawl_runs
    ORDER BY source, started_at DESC
  `);
  
  return result.rows.map(row => ({
    source: row.source as Source,
    lastRun: row.last_run,
    nextRun: new Date(new Date(row.last_run).getTime() + 2 * 60 * 60 * 1000).toISOString(),
    status: row.status as 'success' | 'error' | 'running',
    itemsCollected: row.items_collected,
    errorMessage: row.error_message,
  }));
}

// Daily summary
export async function getDailySummary(date?: string): Promise<DailySummary | null> {
  const targetDate = date || new Date().toISOString().split('T')[0];
  
  const result = await pool.query(
    `SELECT * FROM daily_summaries WHERE date = $1`,
    [targetDate]
  );
  
  if (result.rows.length === 0) {
    // Generate on-the-fly if not cached
    return generateDailySummary(targetDate);
  }
  
  const row = result.rows[0];
  return {
    date: row.date,
    totalItems: row.total_items,
    sentimentBreakdown: row.sentiment_breakdown,
    topTopics: row.top_topics || [],
    highlights: row.highlights || [],
  };
}

async function generateDailySummary(date: string): Promise<DailySummary> {
  const newsResult = await pool.query(`
    SELECT 
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE sentiment = 'positive') as positive,
      COUNT(*) FILTER (WHERE sentiment = 'negative') as negative,
      COUNT(*) FILTER (WHERE sentiment = 'neutral') as neutral
    FROM news_items
    WHERE DATE(published_at) = $1
  `, [date]);
  
  const row = newsResult.rows[0];
  const trends = await getTrendingTopics(1);
  
  return {
    date,
    totalItems: parseInt(row.total) || 0,
    sentimentBreakdown: {
      positive: parseInt(row.positive) || 0,
      negative: parseInt(row.negative) || 0,
      neutral: parseInt(row.neutral) || 0,
    },
    topTopics: trends.slice(0, 5),
    highlights: [], // Would be generated by Claude in production
  };
}

// Sentiment history for charts
export async function getSentimentHistory(days: number = 14): Promise<Array<{
  date: string;
  positive: number;
  negative: number;
  neutral: number;
}>> {
  const result = await pool.query(`
    SELECT
      DATE(published_at) as date,
      COUNT(*) FILTER (WHERE sentiment = 'positive') as positive,
      COUNT(*) FILTER (WHERE sentiment = 'negative') as negative,
      COUNT(*) FILTER (WHERE sentiment = 'neutral') as neutral
    FROM news_items
    WHERE published_at > NOW() - ($1 * INTERVAL '1 day')
    GROUP BY DATE(published_at)
    ORDER BY date ASC
  `, [days]);
  
  return result.rows.map(row => ({
    date: row.date.toISOString().split('T')[0],
    positive: parseInt(row.positive),
    negative: parseInt(row.negative),
    neutral: parseInt(row.neutral),
  }));
}

// Search
export async function searchNews(query: string, limit: number = 20): Promise<NewsItem[]> {
  const result = await pool.query(`
    SELECT * FROM news_items
    WHERE 
      title ILIKE $1 
      OR summary ILIKE $1
      OR $2 = ANY(topics)
    ORDER BY published_at DESC
    LIMIT $3
  `, [`%${query}%`, query.toLowerCase(), limit]);
  
  return result.rows.map(row => ({
    id: row.id.toString(),
    title: row.title,
    url: row.url,
    source: row.source as Source,
    publishedAt: row.published_at,
    crawledAt: row.crawled_at,
    sentiment: row.sentiment || 'neutral',
    sentimentScore: parseFloat(row.sentiment_score) || 0,
    summary: row.summary,
    topics: row.topics || [],
    mentions: [],
    engagement: row.engagement || {},
  }));
}

// Health check
export async function checkDbConnection(): Promise<boolean> {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch {
    return false;
  }
}

export { pool };
