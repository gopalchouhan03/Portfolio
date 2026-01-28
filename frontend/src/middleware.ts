// Cloudflare Pages Middleware to handle Next.js routing
import { NextResponse } from 'next/server';

export function middleware(request: Request) {
  // Let Cloudflare handle all requests through Next.js
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
