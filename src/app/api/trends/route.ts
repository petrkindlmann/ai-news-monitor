import { NextRequest, NextResponse } from 'next/server';
import { getTrendingTopics } from '@/lib/db';
import { mockTrends } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const days = parseInt(searchParams.get('days') || '7');
  const useMock = searchParams.get('mock') === 'true' || !process.env.DATABASE_URL;

  try {
    if (useMock) {
      return NextResponse.json({
        data: mockTrends,
        period: `${days} days`,
        mock: true,
      });
    }

    const data = await getTrendingTopics(days);

    return NextResponse.json({
      data,
      period: `${days} days`,
      mock: false,
    });
  } catch (error) {
    console.error('Error fetching trends:', error);
    
    return NextResponse.json({
      data: mockTrends,
      period: `${days} days`,
      mock: true,
      error: 'Database unavailable, showing demo data',
    });
  }
}
