// Cloudflare Worker: Handle project likes
const likeTracker = new Map();

function getRateLimitKey(projectId, ip) {
  return `${projectId}:${ip}`;
}

function isRateLimited(key) {
  const now = Date.now();
  const lastLike = likeTracker.get(key) || 0;
  const diff = now - lastLike;
  return diff < 60000; // 1 like per minute per IP per project
}

export async function onRequest(context) {
  const { request, env, params } = context;
  const method = request.method;
  const projectId = params.id;
  const ip = request.headers.get('cf-connecting-ip') || 'unknown';

  if (!projectId) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Project ID is required',
        timestamp: new Date(),
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (method === 'POST') {
    const rateLimitKey = getRateLimitKey(projectId, ip);

    // Rate limit check
    if (isRateLimited(rateLimitKey)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Rate limit exceeded. Try again in a minute.',
          timestamp: new Date(),
        }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    try {
      const statsKey = `project:stats:${projectId}`;
      const stats = await env.PORTFOLIO_KV.get(statsKey, 'json') || {
        projectId,
        likeCount: 0,
        viewCount: 0,
      };

      stats.likeCount = (stats.likeCount || 0) + 1;
      stats.updatedAt = new Date();

      await env.PORTFOLIO_KV.put(statsKey, JSON.stringify(stats));
      likeTracker.set(rateLimitKey, Date.now());

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            projectId,
            likeCount: stats.likeCount,
            isLiked: true,
          },
          timestamp: new Date(),
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to process like',
          timestamp: new Date(),
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } else if (method === 'GET') {
    try {
      const statsKey = `project:stats:${projectId}`;
      const stats = await env.PORTFOLIO_KV.get(statsKey, 'json') || {
        projectId,
        likeCount: 0,
        viewCount: 0,
      };

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            projectId,
            likeCount: stats.likeCount || 0,
          },
          timestamp: new Date(),
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to fetch like count',
          timestamp: new Date(),
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  return new Response('Method not allowed', { status: 405 });
}
