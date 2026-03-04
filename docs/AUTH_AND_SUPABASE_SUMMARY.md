# Auth and Supabase – Current State Summary

## Supabase Dashboard config (for smooth local + small-friends testing)

1. **Authentication → URL Configuration**
   - **Site URL**: `http://localhost:3002` (or your dev port)
   - **Redirect URLs**: Add `http://localhost:3002/auth/callback` (and your production callback URL when you deploy)

2. **Authentication → Providers → Email**
   - **Confirm email**: OFF for fastest local dev (sign up → immediate login)
   - **Confirm email**: ON for production or when you want users to verify their email (sign up → check email → click link → login)

3. **Optional env**: `NEXT_PUBLIC_SITE_URL=http://localhost:3002` so the signup confirmation email links back to your dev server. If unset, defaults to `http://localhost:3000`.

---

## How auth works right now

1. **Supabase server client** (`lib/supabase/server.ts`)
   - Uses `createServerClient` from `@supabase/ssr` with `cookies()` from `next/headers`
   - Cookie handlers: `get`, `set`, `remove` – read/write auth tokens
   - Used in: Server Components (Shell, pages), Server Actions (login, signup, createContract, acceptContract, resolveContract)

2. **Login** (`app/login/`)
   - Client: `page.tsx` renders form, calls `login` server action
   - Server: `actions.ts` uses `signInWithPassword`, redirects on success
   - No auth callback route; no middleware for session refresh

3. **Signup** (`app/signup/`)
   - Client: `page.tsx` renders form, calls `signup` server action
   - Server: `actions.ts` uses `signUp`, redirects on success
   - If email confirmation is on, user is not logged in until they click the confirmation link

4. **Protected routes**
   - Each page (dashboard, contracts/new, contracts/[id], contracts/[id]/accept) calls `supabase.auth.getUser()` and redirects to `/login?redirect=...` if no user

## How we talk to Supabase

- **Single server client**: `createSupabaseServerClient()` in `lib/supabase/server.ts`
- **Pattern**: Import in Server Components and Server Actions, call `supabase.from('table')`, `supabase.auth.getUser()`, etc.
- **No middleware**: Session refresh can trigger cookie writes during Server Component render → "Cookies can only be modified in a Server Action or Route Handler"
- **No auth callback**: Email confirmation link has nowhere to land that can set cookies → same error
