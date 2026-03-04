-- =============================================================================
-- Vow App: contracts + contract_participants schema
-- Paste this into Supabase → SQL Editor and run.
-- Matches the app's usage: create contract, accept, dashboard, resolve.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- contracts: one row per accountability contract
-- -----------------------------------------------------------------------------
-- goal_text: what the creator committed to (e.g. "Ship the feature by Friday")
-- deadline: date by which it must be done
-- penalty_amount: amount in ₹ if failed (integer, no decimals)
-- status: active | completed | failed
-- creator_id: auth.users.id of who created it
-- partner_email: email of the partner who must accept (used for invite + RLS)
-- -----------------------------------------------------------------------------
create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  goal_text text not null,
  deadline date not null,
  penalty_amount integer not null,
  status text not null default 'active' check (status in ('active', 'completed', 'failed')),
  creator_id uuid not null references auth.users(id) on delete cascade,
  partner_email text not null,
  created_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- contract_participants: links users to contracts (creator + partner)
-- -----------------------------------------------------------------------------
-- creator row: user_id = creator, accepted = true from the start
-- partner row: user_id = null until they accept; accepted = false until then
-- RLS lets the invited partner (by email) see/update their row before user_id is set
-- -----------------------------------------------------------------------------
create table if not exists public.contract_participants (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.contracts(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  role text not null check (role in ('creator', 'partner')),
  accepted boolean not null default false
);

create index if not exists idx_contract_participants_user_id
  on public.contract_participants(user_id);
create index if not exists idx_contract_participants_contract_id
  on public.contract_participants(contract_id);

-- -----------------------------------------------------------------------------
-- Row Level Security (RLS)
-- -----------------------------------------------------------------------------
alter table public.contracts enable row level security;
alter table public.contract_participants enable row level security;

-- Drop existing policies so this migration is re-runnable
drop policy if exists "contracts_select_participants_only" on public.contracts;
drop policy if exists "contracts_update_participants_only" on public.contracts;
drop policy if exists "contracts_delete_creator_only" on public.contracts;
drop policy if exists "contracts_insert_authenticated" on public.contracts;
drop policy if exists "contract_participants_select_self" on public.contract_participants;
drop policy if exists "contract_participants_update_self" on public.contract_participants;
drop policy if exists "contract_participants_insert_creator_contracts" on public.contract_participants;

-- contracts: select if you're a participant (by user_id) OR the invited partner (by email, before user_id set)
create policy "contracts_select_participants_only" on public.contracts
  for select using (
    exists (
      select 1 from public.contract_participants cp
      where cp.contract_id = contracts.id
        and (
          cp.user_id = auth.uid()
          or (
            cp.user_id is null
            and cp.role = 'partner'
            and contracts.partner_email = coalesce((auth.jwt() ->> 'email')::text, '')
          )
        )
    )
  );

-- contracts: update only if you're a participant (with user_id set)
create policy "contracts_update_participants_only" on public.contracts
  for update using (
    exists (
      select 1 from public.contract_participants cp
      where cp.contract_id = contracts.id and cp.user_id = auth.uid()
    )
  );

-- contracts: delete only if you're the creator
create policy "contracts_delete_creator_only" on public.contracts
  for delete using (
    exists (
      select 1 from public.contract_participants cp
      where cp.contract_id = contracts.id
        and cp.user_id = auth.uid()
        and cp.role = 'creator'
    )
  );

-- contracts: insert only as creator (creator_id = auth.uid())
create policy "contracts_insert_authenticated" on public.contracts
  for insert with check (auth.uid() = creator_id);

-- contract_participants: select your own row OR the partner row when your email matches (before user_id set)
create policy "contract_participants_select_self" on public.contract_participants
  for select using (
    user_id = auth.uid()
    or (
      user_id is null
      and role = 'partner'
      and exists (
        select 1 from public.contracts c
        where c.id = contract_participants.contract_id
          and c.partner_email = coalesce((auth.jwt() ->> 'email')::text, '')
      )
    )
  );

-- contract_participants: update your own row OR the partner row when your email matches (for accept flow)
create policy "contract_participants_update_self" on public.contract_participants
  for update using (
    user_id = auth.uid()
    or (
      user_id is null
      and role = 'partner'
      and exists (
        select 1 from public.contracts c
        where c.id = contract_participants.contract_id
          and c.partner_email = coalesce((auth.jwt() ->> 'email')::text, '')
      )
    )
  );

-- contract_participants: insert only for contracts you created (creator_id = auth.uid())
create policy "contract_participants_insert_creator_contracts" on public.contract_participants
  for insert with check (
    exists (
      select 1 from public.contracts c
      where c.id = contract_participants.contract_id
        and c.creator_id = auth.uid()
    )
  );
