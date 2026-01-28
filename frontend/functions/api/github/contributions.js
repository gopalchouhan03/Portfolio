// Cloudflare Worker: Handle GitHub contributions
const GITHUB_USERNAME = 'gopalchouhan03';
const CACHE_DURATION_HOURS = 24;

function getContributionLevel(count) {
  if (count === 0) return 0;
  if (count <= 5) return 1;
  if (count <= 10) return 2;
  if (count <= 20) return 3;
  return 4;
}

function getFallbackData() {
  return {
    username: GITHUB_USERNAME,
    totalContributions: 0,
    contributions: [],
    fetchedAt: new Date(),
    expiresAt: new Date(Date.now() + CACHE_DURATION_HOURS * 60 * 60 * 1000),
  };
}

async function fetchFromGitHub(token) {
  if (!token) {
    console.warn('GitHub token not set. Using fallback data.');
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
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      console.error(`GitHub API HTTP ${response.status}`);
      return getFallbackData();
    }

    const json = await response.json();

    if (json.errors) {
      console.error('GitHub GraphQL errors:', json.errors);
      return getFallbackData();
    }

    const calendar = json.data?.user?.contributionsCollection?.contributionCalendar;
    if (!calendar) {
      console.error('No calendar data in GitHub response');
      return getFallbackData();
    }

    const contributions = calendar.weeks
      .flatMap(week =>
        week.contributionDays.map(day => ({
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

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const method = request.method;

  if (method === 'GET') {
    const forceRefresh = url.searchParams.get('refresh') === 'true';
    const adminKey = url.searchParams.get('key');

    // Optional: Add admin key check for force refresh
    if (forceRefresh && adminKey !== env.ADMIN_SECRET_KEY) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Unauthorized',
          timestamp: new Date(),
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    try {
      const cacheKey = 'github:contributions';
      let data = await env.PORTFOLIO_KV.get(cacheKey, 'json');

      if (!data || forceRefresh || new Date(data.expiresAt) <= new Date()) {
        data = await fetchFromGitHub(env.GITHUB_TOKEN);
        await env.PORTFOLIO_KV.put(cacheKey, JSON.stringify(data), {
          expirationTtl: CACHE_DURATION_HOURS * 60 * 60,
        });
      }

      return new Response(
        JSON.stringify({
          success: true,
          data,
          timestamp: new Date(),
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
          },
        }
      );
    } catch (error) {
      console.error('Error in GET /api/github/contributions:', error);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to fetch GitHub contributions',
          timestamp: new Date(),
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } else if (method === 'POST') {
    const adminKey = url.searchParams.get('key');

    if (adminKey !== env.ADMIN_SECRET_KEY) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Unauthorized',
          timestamp: new Date(),
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    try {
      const data = await fetchFromGitHub(env.GITHUB_TOKEN);
      const cacheKey = 'github:contributions';
      await env.PORTFOLIO_KV.put(cacheKey, JSON.stringify(data), {
        expirationTtl: CACHE_DURATION_HOURS * 60 * 60,
      });

      return new Response(
        JSON.stringify({
          success: true,
          data,
          message: 'GitHub cache refreshed',
          timestamp: new Date(),
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to refresh GitHub cache',
          timestamp: new Date(),
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  return new Response('Method not allowed', { status: 405 });
}
