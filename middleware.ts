import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // For development, add a mock user session
  const response = NextResponse.next();
  response.headers.set('x-user-id', 'default-user');
  return response;
}

// Skip auth for development
export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
