// Cloudflare Worker: Handle visitor count
import { json } from 'itty-router';

const visitTracker = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const lastVisit = visitTracker.get(ip) || 0;
  const diff = now - lastVisit;
  return diff < 3600000; // 1 count per IP per hour
}

export async function onRequest(context) {
  const { request, env } = context;
  const method = request.method;
  const ip = request.headers.get('cf-connecting-ip') || 'unknown';

  if (method === 'POST') {
    // Rate limit: 1 count per IP per hour
    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'You have already been counted. Try again later.',
          timestamp: new Date(),
        }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    try {
      // Store in Cloudflare KV
      const today = new Date().toISOString().split('T')[0];
      const globalKey = 'visitor:global';
      const dailyKey = `visitor:daily:${today}`;

      const globalData = await env.PORTFOLIO_KV.get(globalKey, 'json') || { count: 0 };
      const dailyData = await env.PORTFOLIO_KV.get(dailyKey, 'json') || { count: 0 };

      globalData.count += 1;
      dailyData.count += 1;

      await env.PORTFOLIO_KV.put(globalKey, JSON.stringify(globalData));
      await env.PORTFOLIO_KV.put(dailyKey, JSON.stringify(dailyData));

      visitTracker.set(ip, Date.now());

      return new Response(
        JSON.stringify({
          success: true,
          data: { count: globalData.count },
          timestamp: new Date(),
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error('Error recording visit:', error);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to record visit',
          timestamp: new Date(),
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } else if (method === 'GET') {
    try {
      const globalKey = 'visitor:global';
      const globalData = await env.PORTFOLIO_KV.get(globalKey, 'json') || { count: 0 };

      return new Response(
        JSON.stringify({
          success: true,
          data: { count: globalData.count || 0 },
          timestamp: new Date(),
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to fetch visitor count',
          timestamp: new Date(),
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  return new Response('Method not allowed', { status: 405 });
}
