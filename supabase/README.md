# Supabase Setup

## Create the `contracts` and `contract_participants` tables

The app needs these tables in your Supabase project. Run the migration SQL:

1. Open your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor**
4. Click **New query**
5. Copy the entire contents of `migrations/20260227000000_vow_schema_sync.sql`
6. Paste into the editor
7. Click **Run**

You should see "Success. No rows returned." The tables and RLS policies are now created.

## Verify

After running, go to **Table Editor** → you should see `contracts` and `contract_participants` under the `public` schema.
