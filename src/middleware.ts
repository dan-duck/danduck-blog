import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // API response caching headers
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Set cache headers for API routes
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');
    
    // Add CORS headers if needed
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  }
  
  // Static asset caching
  if (request.nextUrl.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico|woff|woff2|ttf|otf)$/i)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  
  // CSS and JS caching
  if (request.nextUrl.pathname.match(/\.(css|js)$/i)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  
  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};