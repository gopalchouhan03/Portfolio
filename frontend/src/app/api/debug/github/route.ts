import { NextResponse } from 'next/server';
import { getGitHubContributions } from '@/lib/github';

export async function GET() {
  try {
    console.log('🔍 Debugging GitHub contributions endpoint...');
    const data = await getGitHubContributions(true); // Force refresh
    
    console.log('📊 Data received:', {
      username: data.username,
      totalContributions: data.totalContributions,
      contributionsDays: data.contributions.length,
    });

    return NextResponse.json({
      success: true,
      debug: true,
      data,
    });
  } catch (error) {
    console.error('❌ Error in debug endpoint:', error);
    return NextResponse.json({
      success: false,
      error: String(error),
    }, { status: 500 });
  }
}
