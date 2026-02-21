'use client';

import { useEffect, useState, useCallback } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface ProjectStats {
  projectId: string;
  likeCount: number;
  viewCount: number;
}

export function useProjectStats(projectId: string) {
  const [likes, setLikes] = useState<number>(0);
  const [views, setViews] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // NOTE: Project stats functionality is not yet implemented in the backend
  // This hook is kept for future implementation
  
  useEffect(() => {
    setIsLoading(false);
  }, [projectId]);

  const toggleLike = useCallback(async () => {
    setError('Project stats not implemented');
  }, [projectId]);

  const incrementView = useCallback(async () => {
    // Not implemented yet
  }, [projectId]);

  return {
    likes,
    views,
    toggleLike,
    incrementView,
    isLoading,
    error,
  };
}

export function useVisitorCount() {
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCount() {
      try {
        // Increment visitor count and fetch updated value
        const postResponse = await fetch(`${API_BASE_URL}/visitor-count`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ inc: 1 }),
        });
        if (postResponse.ok) {
          const data = await postResponse.json();
          setCount(data.count || 0);
        } else {
          // Fallback: fetch current count
          const getResponse = await fetch(`${API_BASE_URL}/visitor-count`);
          if (getResponse.ok) {
            const data = await getResponse.json();
            setCount(data.count || 0);
          }
        }
      } catch (err) {
        console.error('Failed to fetch visitor count:', err);
        // Silently fail - not critical
      } finally {
        setIsLoading(false);
      }
    }

    fetchCount();
  }, []);

  return { count, isLoading };
}

interface GitHubStats {
  totalContributions: number;
  contributions: Array<{
    date: string;
    count: number;
    level: 0 | 1 | 2 | 3 | 4;
  }>;
  stats?: {
    last7Days: number;
    last30Days: number;
  };
}

export function useGitHubContributions() {
  const [data, setData] = useState<GitHubStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/github/contributions`);
        const result = await response.json();

        if (result.success) {
          // Backend may return `weeks` (GitHub GraphQL calendar) or a pre-flattened `contributions` array.
          let contributions: Array<any> = [];

          // Helper to map count -> heatmap level (keep in sync with lib/github.ts)
          const getContributionLevel = (count: number): 0 | 1 | 2 | 3 | 4 => {
            if (count === 0) return 0;
            if (count <= 5) return 1;
            if (count <= 10) return 2;
            if (count <= 20) return 3;
            return 4;
          };

          if (Array.isArray(result.data?.contributions) && result.data.contributions.length > 0) {
            contributions = result.data.contributions.map((d: any) => ({
              date: d.date,
              count: d.count || 0,
              level: d.level ?? getContributionLevel(d.count || 0),
            }));
          } else if (Array.isArray(result.data?.weeks)) {
            // Convert weeks -> flat list of days
            contributions = (result.data.weeks || [])
              .flatMap((week: any) =>
                (week.contributionDays || []).map((day: any) => ({
                  date: day.date,
                  count: day.contributionCount || 0,
                  level: getContributionLevel(day.contributionCount || 0),
                }))
              )
              .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
          }

          const today = new Date();
          const last7 = contributions
            .filter((c: any) => {
              const d = new Date(c.date + 'T00:00:00');
              return (today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24) < 7;
            })
            .reduce((s: number, c: any) => s + (c.count || 0), 0);
          const last30 = contributions
            .filter((c: any) => {
              const d = new Date(c.date + 'T00:00:00');
              return (today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24) < 30;
            })
            .reduce((s: number, c: any) => s + (c.count || 0), 0);

          const withStats = { ...(result.data || {}), contributions, stats: { last7Days: last7, last30Days: last30 } };
          setData(withStats);
        } else {
          setError(result.error || 'Failed to fetch GitHub data');
        }
      } catch (err) {
        console.error('GitHub data fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch GitHub data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, isLoading, error };
}
