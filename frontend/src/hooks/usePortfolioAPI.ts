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
          setData(result.data);
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
