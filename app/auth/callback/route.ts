import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * Auth callback route – handles redirects from Supabase after email confirmation.
 * Supabase sends users here with ?code=... (PKCE) or ?token_hash=...&type=...
 * We exchange the code for a session and set cookies here (Route Handlers CAN set cookies).
 *
 * Supabase Dashboard config:
 * - Authentication → URL Configuration → Redirect URLs: add http://localhost:3002/auth/callback (and prod URL)
 * - For local dev without confirmation: Authentication → Providers → Email → "Confirm email" OFF
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/dashboard';

  if (code) {
    const cookieStore = cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options ?? {})
            );
          }
        }
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }
  }

  return NextResponse.redirect(new URL('/login?error=auth_callback', requestUrl.origin));
}
