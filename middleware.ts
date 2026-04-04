import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * Middleware runs on every request before Server Components.
 * It refreshes the Supabase auth session and updates cookies in the response.
 * This prevents Server Components from needing to write cookies (which would throw).
 * Required by @supabase/ssr for correct auth behavior.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers }
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, { path: '/', ...(options ?? {}) })
          );
        }
      }
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Unauthenticated users at "/" go to onboarding (client-side handles localStorage skip)
  if (!user && pathname === '/') {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  // Session expired: user has auth cookies but getUser() returns null on protected routes
  const hasAuthCookie = request.cookies.getAll().some(c => c.name.startsWith('sb-'));
  const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/contracts') || pathname.startsWith('/profile');
  if (!user && hasAuthCookie && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login?reason=session_expired', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
};
