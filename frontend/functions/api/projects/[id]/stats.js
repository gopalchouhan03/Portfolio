// Cloudflare Worker: Handle project stats
export async function onRequest(context) {
  const { request, env, params } = context;
  const method = request.method;
  const projectId = params.id;

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

  const statsKey = `project:stats:${projectId}`;

  if (method === 'GET') {
    try {
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
            viewCount: stats.viewCount || 0,
          },
          timestamp: new Date(),
        }),
        { 
          status: 200, 
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'max-age=60',
          }
        }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to fetch stats',
          timestamp: new Date(),
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } else if (method === 'POST') {
    try {
      const stats = await env.PORTFOLIO_KV.get(statsKey, 'json') || {
        projectId,
        likeCount: 0,
        viewCount: 0,
      };

      stats.viewCount = (stats.viewCount || 0) + 1;
      stats.updatedAt = new Date();

      await env.PORTFOLIO_KV.put(statsKey, JSON.stringify(stats));

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            projectId,
            likeCount: stats.likeCount,
            viewCount: stats.viewCount,
          },
          timestamp: new Date(),
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to increment view count',
          timestamp: new Date(),
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  return new Response('Method not allowed', { status: 405 });
}
