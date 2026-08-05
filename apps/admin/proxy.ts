import { auth } from '@/lib/auth/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const handler = auth.middleware({
  loginUrl: '/login',
});

export async function proxy(request: NextRequest) {
  // Bypass middleware for Next.js Server Actions
  // Server Actions already validate auth.getSession() within their respective functions
  if (request.method === 'POST' && request.headers.has('next-action')) {
    return NextResponse.next();
  }

  return handler(request);
}

export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
};
