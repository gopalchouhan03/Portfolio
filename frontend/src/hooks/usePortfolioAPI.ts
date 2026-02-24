"use client";

import { useEffect, useState, useCallback } from 'react';
import { GitHubContribution } from '@/types';

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
    // defer setState to avoid synchronous setState-in-effect lint warning
    const t = setTimeout(() => setIsLoading(false), 0);
    return () => clearTimeout(t);
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
    let mounted = true;

    const KEY = 'portfolio.visitor.lastCounted';
    const VISITOR_ID_KEY = 'portfolio.visitor.id';
    const LOCK_KEY = 'portfolio.visitor.lock';
    const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

    const safeGet = (k: string): string | null => {
      try {
        return localStorage.getItem(k);
      } catch (e) {
        return null;
      }
    };
    const safeSet = (k: string, v: string) => {
      try {
        localStorage.setItem(k, v);
      } catch (e) {
        /* ignore */
      }
    };
    const safeRemove = (k: string) => {
      try {
        localStorage.removeItem(k);
      } catch (e) {
        /* ignore */
      }
    };

    const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

    async function fetchCount({ inc }: { inc: boolean }) {
      // ensure visitor id exists
      let visitorId: string | null = null;
      try {
        visitorId = safeGet(VISITOR_ID_KEY);
        if (!visitorId) {
          const hasRandomUUID = typeof crypto !== 'undefined' && 'randomUUID' in crypto;
          visitorId = hasRandomUUID
            ? (crypto as unknown as { randomUUID: () => string }).randomUUID()
            : `v-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
          safeSet(VISITOR_ID_KEY, visitorId);
        }
      } catch (e) {
        visitorId = null;
      }
      try {
        if (inc) {
          const body: { inc: number; token?: string } = { inc: 1 };
          if (visitorId) body.token = visitorId;
          const postResponse = await fetch(`${API_BASE_URL}/visitor-count`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          });
          if (postResponse.ok) {
            const data = await postResponse.json();
            if (mounted) setCount(data.count || 0);
            // only set timestamp after successful increment
            safeSet(KEY, String(Date.now()));
            return;
          }
        }

        const getResponse = await fetch(`${API_BASE_URL}/visitor-count`);
        if (getResponse.ok) {
          const data = await getResponse.json();
          if (mounted) setCount(data.count || 0);
        }
      } catch (err) {
        console.error('Failed to fetch visitor count:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    (async () => {
      const now = Date.now();
      const lastRaw = safeGet(KEY);
      const lastTs = lastRaw ? Number(lastRaw) : 0;

      // If we have a recent timestamp within TTL, do not increment — just fetch
      if (lastTs && !Number.isNaN(lastTs) && now - lastTs < TTL_MS) {
        await fetchCount({ inc: false });
        return;
      }

      // Attempt to acquire a short-lived lock to avoid race increments
      const lockRaw = safeGet(LOCK_KEY);
      const lockTs = lockRaw ? Number(lockRaw) : 0;
      const lockStale = !lockTs || Number.isNaN(lockTs) || now - lockTs > 5000; // 5s

      if (!lockRaw || lockStale) {
        // acquire lock
        safeSet(LOCK_KEY, String(now));
        try {
          await fetchCount({ inc: true });
        } finally {
          safeRemove(LOCK_KEY);
        }
      } else {
        // another tab/component is likely incrementing; wait a bit and then fetch
        await delay(1200);
        await fetchCount({ inc: false });
      }
    })();

    return () => {
      mounted = false;
    };
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
          let contributions: GitHubContribution[] = [];

          // Helper to map count -> heatmap level (keep in sync with lib/github.ts)
          const getContributionLevel = (count: number): 0 | 1 | 2 | 3 | 4 => {
            if (count === 0) return 0;
            if (count <= 5) return 1;
            if (count <= 10) return 2;
            if (count <= 20) return 3;
            return 4;
          };

          if (Array.isArray(result.data?.contributions) && result.data.contributions.length > 0) {
            contributions = result.data.contributions.map((d: { date: string; count?: number; level?: number }) => ({
              date: d.date,
              count: d.count || 0,
              level: d.level ?? getContributionLevel(d.count || 0),
            }));
          } else if (Array.isArray(result.data?.weeks)) {
            // Convert weeks -> flat list of days
            contributions = (result.data.weeks || [])
              .flatMap((week: { contributionDays?: Array<{ date: string; contributionCount?: number }> }) =>
                (week.contributionDays || []).map((day) => ({
                  date: day.date,
                  count: day.contributionCount || 0,
                  level: getContributionLevel(day.contributionCount || 0),
                }))
              )
              .sort((a: { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }, b: { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }) => new Date(a.date).getTime() - new Date(b.date).getTime());
          }

          const today = new Date();
          const last7 = contributions
            .filter((c) => {
              const d = new Date(c.date + 'T00:00:00');
              return (today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24) < 7;
            })
            .reduce((s: number, c) => s + (c.count || 0), 0);
          const last30 = contributions
            .filter((c) => {
              const d = new Date(c.date + 'T00:00:00');
              return (today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24) < 30;
            })
            .reduce((s: number, c) => s + (c.count || 0), 0);

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
