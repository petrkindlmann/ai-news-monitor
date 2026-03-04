import { NextResponse } from 'next/server';
import { checkDbConnection } from '@/lib/db';

export async function GET() {
  const dbConnected = process.env.DATABASE_URL ? await checkDbConnection() : false;
  
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: dbConnected ? 'connected' : 'disconnected',
    mode: dbConnected ? 'live' : 'demo',
  });
}
