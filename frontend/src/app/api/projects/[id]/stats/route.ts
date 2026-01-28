/**
 * API: Get Project Stats
 * GET /api/projects/[id]/stats
 * 
 * Returns likes and view count for a project
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { ProjectStats, ApiResponse } from '@/types';

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
      { status: 200, headers: { 'Cache-Control': 'max-age=60' } }
    );
  } catch (error) {
    console.error('Error in GET /api/projects/[id]/stats:', error);
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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const collection = await getCollection('project-stats');

    // Increment view count
    const result = await collection.findOneAndUpdate(
      { projectId },
      { $inc: { viewCount: 1 }, $set: { updatedAt: new Date() } },
      { upsert: true, returnDocument: 'after' }
    );

    if (!result || !result.value) {
      throw new Error('Failed to update project stats');
    }

    const stats = result.value as ProjectStats;

    return NextResponse.json(
      {
        success: true,
        data: {
          projectId,
          likeCount: stats.likeCount,
          viewCount: stats.viewCount,
        },
        timestamp: new Date(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in POST /api/projects/[id]/stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to increment view count',
        timestamp: new Date(),
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
