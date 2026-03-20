-- =============================================================================
-- UP
-- =============================================================================

-- -----------------------------------------------------------------------------
-- profiles: one row per auth user, stores display name and timestamps
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid        primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists idx_profiles_id on public.profiles(id);

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------
alter table public.profiles enable row level security;

-- select: user can only read their own row
create policy "profiles_select_own" on public.profiles
  for select using (id = auth.uid());

-- update: user can only update their own row
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid());

-- insert: user can only insert a row for themselves
create policy "profiles_insert_own" on public.profiles
  for insert with check (id = auth.uid());

-- -----------------------------------------------------------------------------
-- Trigger: auto-create a profiles row when a new auth.users row is inserted
-- -----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();

-- =============================================================================
-- DOWN
-- =============================================================================

-- drop trigger on_auth_user_created on auth.users;
-- drop function if exists public.handle_new_user();
-- drop policy if exists "profiles_insert_own" on public.profiles;
-- drop policy if exists "profiles_update_own" on public.profiles;
-- drop policy if exists "profiles_select_own" on public.profiles;
-- drop index if exists idx_profiles_id;
-- drop table if exists public.profiles;
