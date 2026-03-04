import { NextRequest, NextResponse } from 'next/server';
import { getSourceStats, getCrawlStatus, getSentimentHistory } from '@/lib/db';
import { mockSourceStats, mockCrawlStatus, mockSentimentHistory } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type') || 'all';
  const useMock = searchParams.get('mock') === 'true' || !process.env.DATABASE_URL;

  try {
    if (useMock) {
      const response: Record<string, any> = { mock: true };
      
      if (type === 'all' || type === 'sources') {
        response.sources = mockSourceStats;
      }
      if (type === 'all' || type === 'crawl') {
        response.crawlStatus = mockCrawlStatus;
      }
      if (type === 'all' || type === 'sentiment') {
        response.sentimentHistory = mockSentimentHistory;
      }
      
      return NextResponse.json(response);
    }

    const response: Record<string, any> = { mock: false };

    if (type === 'all' || type === 'sources') {
      response.sources = await getSourceStats();
    }
    if (type === 'all' || type === 'crawl') {
      response.crawlStatus = await getCrawlStatus();
    }
    if (type === 'all' || type === 'sentiment') {
      const days = parseInt(searchParams.get('days') || '14');
      response.sentimentHistory = await getSentimentHistory(days);
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching stats:', error);
    
    return NextResponse.json({
      sources: mockSourceStats,
      crawlStatus: mockCrawlStatus,
      sentimentHistory: mockSentimentHistory,
      mock: true,
      error: 'Database unavailable, showing demo data',
    });
  }
}
