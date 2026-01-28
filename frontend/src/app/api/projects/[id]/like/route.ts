/**
 * API: Get/Like Project
 * POST /api/projects/[id]/like
 * 
 * - Increments like count in MongoDB
 * - Tracks IP to prevent spam (memory-based, no DB)
 * - No user auth needed
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { ProjectStats, ApiResponse, LikeResponse } from '@/types';

// In-memory like tracking (resets per deployment)
// For production, use Redis or rate-limit middleware
const likeTracker = new Map<string, number>();

function getRateLimitKey(projectId: string, ip: string): string {
  return `${projectId}:${ip}`;
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const lastLike = likeTracker.get(key) || 0;
  const diff = now - lastLike;
  return diff < 60000; // 1 like per minute per IP per project
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitKey = getRateLimitKey(projectId, ip);

    // Rate limit check
    if (isRateLimited(rateLimitKey)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Try again in a minute.',
          timestamp: new Date(),
        } as ApiResponse<null>,
        { status: 429 }
      );
    }

    const collection = await getCollection('project-stats');

    // Increment like count
    const result = await collection.findOneAndUpdate(
      { projectId },
      { $inc: { likeCount: 1 }, $set: { updatedAt: new Date() } },
      { upsert: true, returnDocument: 'after' }
    );

    if (!result || !result.value) {
      throw new Error('Failed to update project stats');
    }

    const stats = result.value as ProjectStats;

    // Record rate limit
    likeTracker.set(rateLimitKey, Date.now());

    return NextResponse.json(
      {
        success: true,
        data: {
          projectId,
          likeCount: stats.likeCount,
          isLiked: true,
        } as LikeResponse,
        timestamp: new Date(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in POST /api/projects/[id]/like:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process like',
        timestamp: new Date(),
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const collection = await getCollection('project-stats');

    const stats = (await collection.findOne({ projectId })) as ProjectStats | null;

    return NextResponse.json(
      {
        success: true,
        data: {
          projectId,
          likeCount: stats?.likeCount || 0,
          viewCount: stats?.viewCount || 0,
        },
        timestamp: new Date(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/projects/[id]/like:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch stats',
        timestamp: new Date(),
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
