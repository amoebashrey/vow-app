import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

/**
 * Creates a Supabase server client for use in Server Components, Server Actions, and Route Handlers.
 *
 * Cookie writes (setAll) are wrapped in try/catch: middleware refreshes the session before we run,
 * so Server Components usually only read. If a write is needed (e.g. in a Server Action), it succeeds.
 * In Server Component render, cookie writes throw – we catch and no-op to avoid "Cookies can only
 * be modified in a Server Action or Route Handler".
 *
 * Auth callback (email confirmation) MUST hit app/auth/callback/route.ts – that Route Handler
 * can set cookies. Configure Supabase: Redirect URLs = http://localhost:3002/auth/callback
 */
export function createSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options ?? {})
            );
          } catch {
            // Server Components cannot set cookies; middleware handles refresh.
            // No-op to avoid "Cookies can only be modified in a Server Action or Route Handler".
          }
        }
      }
    }
  );
}
