import { NextRequest, NextResponse } from 'next/server';
import { getDailySummary } from '@/lib/db';
import { mockDailySummary } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date') || undefined;
  const useMock = searchParams.get('mock') === 'true' || !process.env.DATABASE_URL;

  try {
    if (useMock) {
      return NextResponse.json({
        data: mockDailySummary,
        mock: true,
      });
    }

    const data = await getDailySummary(date);

    return NextResponse.json({
      data,
      mock: false,
    });
  } catch (error) {
    console.error('Error fetching summary:', error);
    
    return NextResponse.json({
      data: mockDailySummary,
      mock: true,
      error: 'Database unavailable, showing demo data',
    });
  }
}
