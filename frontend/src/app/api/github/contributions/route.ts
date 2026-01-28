/**
 * API: GitHub Contributions
 * GET /api/github/contributions
 * 
 * Returns cached GitHub contribution heatmap data
 * Safe: GitHub token stays on server, never exposed to client
 */

import { NextRequest, NextResponse } from 'next/server';
import { getGitHubContributions, calculateStats } from '@/lib/github';
import { GitHubContributionData, ApiResponse } from '@/types';

export const revalidate = 3600; // Revalidate every hour

export async function GET(request: NextRequest) {
  try {
    // Check if this is a force-refresh request (admin only)
    const forceRefresh = request.nextUrl.searchParams.get('refresh') === 'true';
    const adminKey = request.nextUrl.searchParams.get('key');

    // Optional: Add admin key check for force refresh
    if (forceRefresh && adminKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          timestamp: new Date(),
        } as ApiResponse<null>,
        { status: 401 }
      );
    }

    const data = await getGitHubContributions(forceRefresh);
    const stats = calculateStats(data);

    return NextResponse.json(
      {
        success: true,
        data: {
          ...data,
          stats,
        },
        timestamp: new Date(),
      },
      {
        status: 200,
        headers: {
          // Cache for 1 hour on CDN
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error in GET /api/github/contributions:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch GitHub contributions',
        timestamp: new Date(),
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

/**
 * Optional: POST route for manual cache refresh
 * POST /api/github/contributions?key=YOUR_ADMIN_SECRET_KEY
 */
export async function POST(request: NextRequest) {
  try {
    const adminKey = request.nextUrl.searchParams.get('key');

    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          timestamp: new Date(),
        } as ApiResponse<null>,
        { status: 401 }
      );
    }

    const data = await getGitHubContributions(true);

    return NextResponse.json(
      {
        success: true,
        data,
        message: 'GitHub cache refreshed',
        timestamp: new Date(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in POST /api/github/contributions:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to refresh GitHub data',
        timestamp: new Date(),
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
