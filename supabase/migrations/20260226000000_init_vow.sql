-- Vow App V1 initial schema and RLS

-- contracts table
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

-- contract_participants table
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

-- Enable RLS
alter table public.contracts enable row level security;
alter table public.contract_participants enable row level security;

-- contracts policies
create policy if not exists "contracts_select_participants_only" on public.contracts
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

create policy if not exists "contracts_update_participants_only" on public.contracts
  for update using (
    exists (
      select 1 from public.contract_participants cp
      where cp.contract_id = contracts.id
        and cp.user_id = auth.uid()
    )
  );

create policy if not exists "contracts_delete_creator_only" on public.contracts
  for delete using (
    exists (
      select 1 from public.contract_participants cp
      where cp.contract_id = contracts.id
        and cp.user_id = auth.uid()
        and cp.role = 'creator'
    )
  );

create policy if not exists "contracts_insert_authenticated" on public.contracts
  for insert with check (auth.uid() = creator_id);

-- contract_participants policies
create policy if not exists "contract_participants_select_self" on public.contract_participants
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

create policy if not exists "contract_participants_update_self" on public.contract_participants
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

create policy if not exists "contract_participants_insert_creator_contracts" on public.contract_participants
  for insert with check (
    exists (
      select 1 from public.contracts c
      where c.id = contract_participants.contract_id
      and c.creator_id = auth.uid()
    )
  );

-- Note: initial partner row will have user_id null;
-- it will not be visible until user_id is set on acceptance.
