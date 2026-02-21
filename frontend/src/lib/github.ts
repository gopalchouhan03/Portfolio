// GitHub Integration - Fetches contribution data from backend API
import { GitHubContributionData } from '@/types';

const CACHE_DURATION_HOURS = 24;

async function fetchFromBackend(): Promise<GitHubContributionData> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  
  try {
    const response = await fetch(`${apiUrl}/api/github/contributions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`❌ Backend API HTTP ${response.status}`);
      throw new Error(`Backend API error: ${response.status}`);
    }

    const json = await response.json();

    if (json.error) {
      console.error('❌ Backend API error:', json.error);
      throw new Error(json.error);
    }

    // Transform data from backend format
    const contributions = (json.data?.weeks || [])
      .flatMap((week: any) =>
        week.contributionDays.map((day: any) => ({
          date: day.date,
          count: day.contributionCount,
          level: getContributionLevel(day.contributionCount),
        }))
      );

    return {
      username: json.data?.username || '',
      totalContributions: json.data?.totalContributions || 0,
      contributions,
      fetchedAt: new Date(),
      expiresAt: new Date(Date.now() + CACHE_DURATION_HOURS * 60 * 60 * 1000),
    };
  } catch (error) {
    console.error('❌ Error fetching GitHub contributions from backend:', error);
    return getFallbackData();
  }
}

export async function getGitHubContributions(): Promise<GitHubContributionData> {
  // Fetch fresh data from backend
  return await fetchFromBackend();
}

/**
 * Map contribution count to GitHub's heatmap levels
 */
function getContributionLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0;
  if (count <= 5) return 1;
  if (count <= 10) return 2;
  if (count <= 20) return 3;
  return 4;
}

function getFallbackData(): GitHubContributionData {
  return {
    username: '',
    totalContributions: 0,
    contributions: [],
    fetchedAt: new Date(),
    expiresAt: new Date(Date.now() + CACHE_DURATION_HOURS * 60 * 60 * 1000),
  };
}

export function calculateStats(data: GitHubContributionData) {
  const last7Days = data.contributions
    .slice(-7)
    .reduce((sum, day) => sum + day.count, 0);

  const last30Days = data.contributions
    .slice(-30)
    .reduce((sum, day) => sum + day.count, 0);

  const currentYear = new Date().getFullYear();
  const currentYearStart = new Date(currentYear, 0, 1);
  const thisYearContributions = data.contributions
    .filter(day => new Date(day.date) >= currentYearStart)
    .reduce((sum, day) => sum + day.count, 0);

  return {
    totalContributions: data.totalContributions,
    last7Days,
    last30Days,
    thisYearContributions,
    lastContributionDate: data.contributions[data.contributions.length - 1]?.date,
  };
}
