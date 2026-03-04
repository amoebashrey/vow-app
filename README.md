## Vow App V1

Private accountability contracts built on Next.js, Supabase, and Tailwind.

### Getting Started

- **Env**: Create a `.env.local` with:
  - `NEXT_PUBLIC_SUPABASE_URL=...`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`
- **Install**:

```bash
npm install
```

- **Run dev**:

```bash
npm run dev
```

### Supabase Schema (required before creating contracts)

**Create the tables first.** Otherwise you'll get "Could not find the table 'public.contracts' in the schema cache".

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project → **SQL Editor**
2. Create a **New query**
3. Copy the full contents of `supabase/migrations/20260227000000_vow_schema_sync.sql`
4. Paste and click **Run**

This creates `contracts` and `contract_participants` with RLS. See `supabase/README.md` for details.

