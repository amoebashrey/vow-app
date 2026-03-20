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

**Routing**: App Router with `app/` directory. Dynamic route `[id]` for contracts. URL query params (`?message=`, `?created=1`, `?updated=1`) carry success/error state between server action redirects.

## UI/Design

Neo-brutalist aesthetic: dark background (#09090B), zinc/emerald/red/amber palette, uppercase bold text with wide tracking, 2px black borders, hard drop shadows (`shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`). Custom components in `components/ui/` — no external UI library.

## Environment Variables

Requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`.
