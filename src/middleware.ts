// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userRole = request.cookies.get('user_role')?.value;

  // Allow public access to organizer signup and onboarding pages
  if (pathname === '/organizer/signup' || pathname === '/organizer/onboarding') {
    return NextResponse.next();
  }

  // Protect Rider routes
  if (pathname.startsWith('/rider') && userRole !== 'RIDER') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Protect Business routes
  if (pathname.startsWith('/business') && userRole !== 'BUSINESS_OWNER') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Protect other Organizer routes (except signup/onboarding)
  if (pathname.startsWith('/organizer') && userRole !== 'ORGANIZER') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/rider/:path*', '/business/:path*', '/organizer/:path*'],
};