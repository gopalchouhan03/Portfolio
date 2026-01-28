'use client';

import { useEffect, useState, useCallback } from 'react';

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

  // Fetch stats on mount
  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch(`/api/projects/${projectId}/stats`);
        const data = await response.json();
        if (data.success) {
          setLikes(data.data.likeCount);
          setViews(data.data.viewCount);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      } finally {
        setIsLoading(false);
      }
    }

    if (projectId) {
      fetchStats();
    }
  }, [projectId]);

  const toggleLike = useCallback(async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/like`, {
        method: 'POST',
      });

      const data = await response.json();
      if (data.success) {
        setLikes(data.data.likeCount);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle like');
    }
  }, [projectId]);

  const incrementView = useCallback(async () => {
    try {
      await fetch(`/api/projects/${projectId}/stats`, {
        method: 'POST',
      });
      // Update local state optimistically
      setViews(prev => prev + 1);
    } catch (err) {
      console.error('Failed to increment view:', err);
    }
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
        // Try to increment first (counts this visitor)
        const postResponse = await fetch('/api/visitor', { method: 'POST' });
        if (postResponse.ok) {
          const data = await postResponse.json();
          if (data.success) {
            setCount(data.data.count);
          }
        }
      } catch (err) {
        // Fall back to just fetching
        try {
          const getResponse = await fetch('/api/visitor');
          const data = await getResponse.json();
          if (data.success) {
            setCount(data.data.count);
          }
        } catch (e) {
          console.error('Failed to fetch visitor count:', e);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchCount();
  }, []);

  return { count, isLoading };
}

interface GitHubStats {
  username: string;
  totalContributions: number;
  contributions: Array<{
    date: string;
    count: number;
    level: 0 | 1 | 2 | 3 | 4;
  }>;
  stats?: {
    last7Days: number;
    last30Days: number;
    thisYearContributions: number;
  };
}

export function useGitHubContributions() {
  const [data, setData] = useState<GitHubStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/github/contributions');
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch GitHub data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, isLoading, error };
}
