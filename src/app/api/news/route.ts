import { NextRequest, NextResponse } from 'next/server';
import { getRecentNews, searchNews } from '@/lib/db';
import { mockNews } from '@/lib/mock-data';
import { Source } from '@/lib/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get('limit') || '50');
  const source = searchParams.get('source') as Source | null;
  const query = searchParams.get('q');
  const useMock = searchParams.get('mock') === 'true' || !process.env.DATABASE_URL;

  try {
    // Use mock data if no database configured
    if (useMock) {
      let data = mockNews;
      
      if (source) {
        data = data.filter(item => item.source === source);
      }
      
      if (query) {
        const q = query.toLowerCase();
        data = data.filter(item => 
          item.title.toLowerCase().includes(q) ||
          item.summary?.toLowerCase().includes(q) ||
          item.topics.some(t => t.toLowerCase().includes(q))
        );
      }
      
      return NextResponse.json({
        data: data.slice(0, limit),
        total: data.length,
        mock: true,
      });
    }

    // Use real database
    const data = query 
      ? await searchNews(query, limit)
      : await getRecentNews(limit, source || undefined);

    return NextResponse.json({
      data,
      total: data.length,
      mock: false,
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    
    // Fallback to mock data on error
    return NextResponse.json({
      data: mockNews.slice(0, limit),
      total: mockNews.length,
      mock: true,
      error: 'Database unavailable, showing demo data',
    });
  }
}
