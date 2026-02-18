import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Maintenance mode gate
  if (process.env.MAINTENANCE_MODE === 'true') {
    const { pathname } = req.nextUrl;
    if (pathname !== '/coming-soon' && !pathname.startsWith('/api') && !pathname.startsWith('/_next')) {
      return NextResponse.redirect(new URL('/coming-soon', req.url));
    }
    return res;
  }

  // Skip Supabase auth if env vars aren't configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return res;
  }

  try {
    const supabase = createMiddlewareClient({ req, res });
    // Refresh session if expired
    await supabase.auth.getSession();
  } catch {
    // Supabase not available - continue without auth
  }

  return res;
}

// Specify which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
