/**
 * API: Visitor Count
 * POST /api/visitor - Increment global visitor count
 * GET /api/visitor - Get visitor count
 * 
 * Tracks page views with basic rate limiting
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { VisitorStats, ApiResponse } from '@/types';

const visitTracker = new Map<string, number>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const lastVisit = visitTracker.get(ip) || 0;
  const diff = now - lastVisit;
  return diff < 3600000; // 1 count per IP per hour
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';

    // Rate limit: 1 count per IP per hour
    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: 'You have already been counted. Try again later.',
          timestamp: new Date(),
        } as ApiResponse<null>,
        { status: 429 }
      );
    }

    const collection = await getCollection('visitor-count');
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Increment both global and daily counts
    await collection.updateOne(
      { type: 'global' },
      { $inc: { count: 1 }, $set: { updatedAt: new Date() } },
      { upsert: true }
    );

    await collection.updateOne(
      { type: 'daily', date: today },
      { $inc: { count: 1 }, $set: { updatedAt: new Date() } },
      { upsert: true }
    );

    visitTracker.set(ip, Date.now());

    const globalStats = (await collection.findOne({ type: 'global' })) as VisitorStats | null;

    if (!globalStats) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to record visit',
          timestamp: new Date(),
        } as ApiResponse<null>,
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: { count: globalStats.count },
        timestamp: new Date(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in POST /api/visitor:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to record visit',
        timestamp: new Date(),
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const collection = await getCollection('visitor-count');
    const globalStats = (await collection.findOne({ type: 'global' })) as VisitorStats | null;

    return NextResponse.json(
      {
        success: true,
        data: { count: globalStats?.count || 0 },
        timestamp: new Date(),
      },
      { status: 200, headers: { 'Cache-Control': 'max-age=300' } }
    );
  } catch (error) {
    console.error('Error in GET /api/visitor:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch visitor count',
        timestamp: new Date(),
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
