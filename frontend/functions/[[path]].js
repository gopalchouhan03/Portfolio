// Cloudflare Pages Functions handler for Next.js
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // Handle API routes
  if (url.pathname.startsWith('/api/')) {
    return new Response('API routes require a backend server', { status: 501 });
  }

  // For all other requests, return 404 (static files should be served by Pages)
  return new Response('Not Found', { status: 404 });
}
