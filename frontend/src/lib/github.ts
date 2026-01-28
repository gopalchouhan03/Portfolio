// GitHub Integration - Fetches and caches contribution data
import { GitHubContributionData } from '@/types';
import { getCollection } from './db';

const GITHUB_USERNAME = process.env.GITHUB_USERNAME || '';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const CACHE_DURATION_HOURS = 24;

async function fetchFromGitHub(): Promise<GitHubContributionData> {
  if (!GITHUB_TOKEN) {
    console.warn('⚠️  GITHUB_TOKEN not set. Using fallback data.');
    return getFallbackData();
  }

  const query = `
    query {
      user(login: "${GITHUB_USERNAME}") {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      console.error(`❌ GitHub API HTTP ${response.status}`);
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const json = await response.json();

    if (json.errors) {
      console.error('❌ GitHub GraphQL errors:', json.errors);
      return getFallbackData();
    }

    const calendar = json.data?.user?.contributionsCollection?.contributionCalendar;
    if (!calendar) {
      console.error('❌ No calendar data in GitHub response');
      return getFallbackData();
    }

    // Flatten weeks and days into a simple array
    const contributions = calendar.weeks
      .flatMap((week: any) =>
        week.contributionDays.map((day: any) => ({
          date: day.date,
          count: day.contributionCount,
          level: getContributionLevel(day.contributionCount),
        }))
      );

    return {
      username: GITHUB_USERNAME,
      totalContributions: calendar.totalContributions,
      contributions,
      fetchedAt: new Date(),
      expiresAt: new Date(Date.now() + CACHE_DURATION_HOURS * 60 * 60 * 1000),
    };
  } catch (error) {
    console.error('Failed to fetch GitHub contributions:', error);
    return getFallbackData();
  }
}

export async function getGitHubContributions(
  forceRefresh = false
): Promise<GitHubContributionData> {
  const collection = await getCollection('github-cache');

  // Try to get from cache
  if (!forceRefresh) {
    const cached = await collection.findOne({ type: 'contributions' });
    if (cached && new Date(cached.expiresAt) > new Date()) {
      return cached as GitHubContributionData;
    }
  }

  // Fetch fresh data
  const freshData = await fetchFromGitHub();

  // Update cache
  await collection.updateOne(
    { type: 'contributions' },
    { $set: { ...freshData, type: 'contributions' } },
    { upsert: true }
  );

  return freshData;
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
    username: GITHUB_USERNAME || 'unknown',
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
