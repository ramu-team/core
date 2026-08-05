import { auth } from '@/lib/auth/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const handler = auth.middleware({
  loginUrl: '/login',
});

export async function proxy(request: NextRequest) {
  // Bypas middleware untuk Next.js Server Actions
  // Server Action sudah memvalidasi auth.getSession() di dalam fungsinya masing-masing
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
