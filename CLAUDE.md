# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vow is a private accountability contracts app where users create commitments with deadlines and penalties, then invite a partner to hold them accountable. Built with Next.js 14 (App Router), Supabase (PostgreSQL + Auth + RLS), and Tailwind CSS.

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint
```

No test runner is configured.

## Architecture

**Server-first pattern**: Pages are Server Components that fetch data directly from Supabase. Mutations use Server Actions (`'use server'` in `actions.ts` files colocated with pages). Client components (`'use client'`) are only used for interactive forms, using `useState` + `useTransition` for local UI state. No global state library.

**Auth flow**: Supabase email+password auth with optional email confirmation (PKCE). `middleware.ts` refreshes the session on every request. `lib/supabase/server.ts` provides the server client factory using cookies. Route Handlers at `/auth/callback` and `/auth/logout` handle confirmation and logout.

**Database**: Supabase PostgreSQL with Row Level Security. Three tables: `contracts`, `contract_participants`, `profiles`. All access is scoped by RLS policies — users only see contracts they participate in. Migrations live in `supabase/migrations/`. A trigger auto-creates a profile row on user signup.

**Contract lifecycle**: Creator makes a contract (`/contracts/new`) → partner receives link → partner accepts (`/contracts/[id]/accept`) → creator resolves as completed/failed (`/contracts/[id]`).

**Route groups**: The `app/` directory uses Next.js route groups to control layout wrapping:
- `app/(main)/` — All authenticated pages (dashboard, contracts, profile, privacy, etc.). Wrapped by `Shell` component (header nav + footer).
- `app/(onboarding)/` — Onboarding flow. No Shell, renders full-viewport.
- `app/auth/` — Route Handlers for callback and logout. Sits at app root (not in a route group) to avoid Next.js 14 build issues with route handlers in route groups.

Route groups are transparent in URLs — `app/(main)/dashboard/page.tsx` serves `/dashboard`.

**Routing**: Dynamic route `[id]` for contracts. URL query params (`?message=`, `?created=1`, `?updated=1`) carry success/error state between server action redirects.

## UI/Design

Dark glass-card aesthetic: background `#09090B`, volt yellow accent `#EFFF00` (CSS var `--volt`). Headings use Bebas Neue (self-hosted via `next/font/google`, CSS var `--font-bebas`). Contract cards use glass treatment (`bg-white/[0.03]`, `border-white/[0.08]`, rounded-xl) with radial gradient blooms. Status badges are pill-shaped. Custom components in `components/ui/` — no external UI library. PWA-enabled with manifest and service worker.

## Environment Variables

Requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`. `SUPABASE_SERVICE_ROLE_KEY` is needed for account deletion (admin API). `NEXT_PUBLIC_SITE_URL` is used for password reset redirect URLs.
