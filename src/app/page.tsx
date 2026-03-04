'use client';

import { useEffect, useState } from 'react';
import {
  Header,
  Footer,
  NewsCard,
  TrendCard,
  SentimentChart,
  CrawlStatus,
  StatsCard,
  DailySummary
} from '@/components';
import {
  mockNews,
  mockTrends,
  mockSentimentHistory,
  mockCrawlStatus,
  mockDailySummary
} from '@/lib/mock-data';
import { NewsItem, TrendData, CrawlStatus as CrawlStatusType, DailySummary as DailySummaryType } from '@/lib/types';
import { Newspaper, TrendingUp, Database, Activity } from 'lucide-react';

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>(mockNews);
  const [trends, setTrends] = useState<TrendData[]>(mockTrends);
  const [crawlStatus, setCrawlStatus] = useState<CrawlStatusType[]>(mockCrawlStatus);
  const [dailySummary, setDailySummary] = useState<DailySummaryType>(mockDailySummary);
  const [sentimentHistory, setSentimentHistory] = useState(mockSentimentHistory);
  const [loading, setLoading] = useState(true);
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  useEffect(() => {
    async function fetchData() {
      try {
        const [newsRes, trendsRes, statsRes, summaryRes] = await Promise.all([
          fetch('/api/news?limit=50'),
          fetch('/api/trends'),
          fetch('/api/stats'),
          fetch('/api/summary'),
        ]);

        const [newsData, trendsData, statsData, summaryData] = await Promise.all([
          newsRes.json(),
          trendsRes.json(),
          statsRes.json(),
          summaryRes.json(),
        ]);

        if (newsData.data && newsData.data.length > 0) {
          setNews(newsData.data);
        }

        if (trendsData.data && trendsData.data.length > 0) {
          setTrends(trendsData.data);
        }

        if (statsData.crawlStatus) {
          setCrawlStatus(statsData.crawlStatus);
        }
        if (statsData.sentimentHistory) {
          setSentimentHistory(statsData.sentimentHistory);
        }

        if (summaryData.data) {
          setDailySummary(summaryData.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const totalItems = news.length;
  const positiveCount = news.filter(n => n.sentiment === 'positive').length;
  const avgSentiment = news.reduce((acc, n) => acc + n.sentimentScore, 0) / (news.length || 1);

  const filteredNews = sourceFilter === 'all'
    ? news
    : news.filter(n => {
        if (sourceFilter === 'reddit') return n.source.startsWith('reddit');
        if (sourceFilter === 'blogs') return ['anthropic_blog', 'openai_blog', 'deepmind_blog', 'google_ai_blog'].includes(n.source);
        return n.source === sourceFilter;
      });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-accent text-lg animate-pulse">Loading...</p>
          </div>
        ) : (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatsCard
                label="Articles Today"
                value={dailySummary.totalItems}
                subValue="across all sources"
                icon={<Newspaper className="w-8 h-8" />}
              />
              <StatsCard
                label="Trending Topics"
                value={trends.length}
                subValue="tracked this week"
                icon={<TrendingUp className="w-8 h-8" />}
              />
              <StatsCard
                label="Total Indexed"
                value={totalItems.toString()}
                subValue="articles in database"
                icon={<Database className="w-8 h-8" />}
              />
              <StatsCard
                label="Avg Sentiment"
                value={`${avgSentiment > 0 ? '+' : ''}${(avgSentiment * 100).toFixed(0)}%`}
                subValue={`${positiveCount}/${totalItems} positive`}
                icon={<Activity className="w-8 h-8" />}
              />
            </div>

            {/* AI Summary */}
            <div className="mb-8">
              <DailySummary summary={dailySummary} />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* News Feed - 2 columns */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-sm text-muted uppercase tracking-wider">
                    Latest News
                  </h2>
                  <select className="bg-surface-light border border-border rounded px-3 py-1.5 text-sm text-muted focus:outline-none focus:border-accent" value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}>
                    <option value="all">All Sources</option>
                    <option value="hacker_news">Hacker News</option>
                    <option value="techcrunch">TechCrunch</option>
                    <option value="reddit">Reddit</option>
                    <option value="blogs">Company Blogs</option>
                  </select>
                </div>

                <div className="space-y-4">
                  {filteredNews.map((item) => (
                    <NewsCard key={item.id} item={item} />
                  ))}
                </div>
              </div>

              {/* Sidebar - 1 column */}
              <div className="space-y-6">
                {/* Trending Topics */}
                <div>
                  <h2 className="font-display text-sm text-muted uppercase tracking-wider mb-4">
                    Trending Topics
                  </h2>
                  <div className="space-y-2">
                    {trends.slice(0, 6).map((trend, index) => (
                      <TrendCard key={trend.topic} trend={trend} rank={index + 1} />
                    ))}
                  </div>
                </div>

                {/* Sentiment Chart */}
                <SentimentChart data={sentimentHistory} />

                {/* Crawler Status */}
                <CrawlStatus statuses={crawlStatus} />
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
