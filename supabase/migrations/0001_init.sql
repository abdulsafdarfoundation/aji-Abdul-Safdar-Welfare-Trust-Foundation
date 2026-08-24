-- ============================================================================
-- Hope Foundation — initial schema
-- Run in Supabase Studio → SQL Editor, or `supabase db push` if using the CLI.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
do $$ begin
  create type campaign_status as enum ('draft', 'active', 'completed', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type donation_status as enum ('pending', 'completed', 'failed', 'refunded');
exception when duplicate_object then null; end $$;

do $$ begin
  create type donation_frequency as enum ('one_time', 'monthly');
exception when duplicate_object then null; end $$;

do $$ begin
  create type user_role as enum ('admin', 'editor', 'viewer');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- profiles — one row per auth user, carries the dashboard role
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text not null,
  full_name  text,
  avatar_url text,
  role       user_role not null default 'viewer',
  created_at timestamptz not null default now()
);

-- Auto-create a profile whenever someone signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Role check used by every policy below. SECURITY DEFINER so that reading
-- `profiles` from inside a `profiles` policy does not recurse.
create or replace function public.has_role(required user_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = any(required)
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$ select public.has_role(array['admin']::user_role[]); $$;

create or replace function public.is_staff()
returns boolean
language sql
stable
as $$ select public.has_role(array['admin', 'editor']::user_role[]); $$;

-- ---------------------------------------------------------------------------
-- campaigns
-- ---------------------------------------------------------------------------
create table if not exists public.campaigns (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title           text not null,
  summary         text not null default '',
  description     text,
  category        text not null default 'Emergency Relief',
  cover_image_url text,
  goal_amount     numeric(12, 2) not null default 0 check (goal_amount >= 0),
  status          campaign_status not null default 'draft',
  featured        boolean not null default false,
  starts_at       timestamptz,
  ends_at         timestamptz,
  -- Denormalized rollups, maintained by trigger. They live on `campaigns`
  -- rather than in a view because anonymous visitors cannot read `donations`
  -- (see RLS below) and a security-invoker view would report zero to them.
  raised_amount   numeric(12, 2) not null default 0,
  donation_count  integer not null default 0,
  donor_count     integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists campaigns_status_idx on public.campaigns (status);
create index if not exists campaigns_featured_idx on public.campaigns (featured) where featured;

-- ---------------------------------------------------------------------------
-- donations
-- ---------------------------------------------------------------------------
create table if not exists public.donations (
  id                uuid primary key default gen_random_uuid(),
  reference         text not null unique,
  campaign_id       uuid references public.campaigns (id) on delete set null,
  donor_name        text not null,
  donor_email       text not null,
  donor_phone       text,
  amount            numeric(12, 2) not null check (amount > 0),
  currency          text not null default 'USD',
  frequency         donation_frequency not null default 'one_time',
  status            donation_status not null default 'pending',
  payment_provider  text not null default 'stub',
  payment_reference text,
  message           text,
  is_anonymous      boolean not null default false,
  created_at        timestamptz not null default now(),
  completed_at      timestamptz
);

create index if not exists donations_campaign_idx on public.donations (campaign_id);
create index if not exists donations_status_idx on public.donations (status);
create index if not exists donations_created_idx on public.donations (created_at desc);
create index if not exists donations_email_idx on public.donations (lower(donor_email));

-- Stamp completed_at whenever a donation flips to completed.
create or replace function public.touch_donation_completed_at()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'completed' and (old.status is distinct from 'completed') then
    new.completed_at := now();
  elsif new.status <> 'completed' then
    new.completed_at := null;
  end if;
  return new;
end;
$$;

drop trigger if exists donations_completed_at on public.donations;
create trigger donations_completed_at
  before insert or update on public.donations
  for each row execute function public.touch_donation_completed_at();

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end;
$$;

drop trigger if exists campaigns_updated_at on public.campaigns;
create trigger campaigns_updated_at
  before update on public.campaigns
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Campaign rollups — recomputed from scratch for any campaign a donation
-- touches. SECURITY DEFINER so the anonymous donor who just inserted a pending
-- row can still trigger the recount without holding read access to donations.
-- ---------------------------------------------------------------------------
create or replace function public.recount_campaign(target uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.campaigns c
  set raised_amount  = coalesce(t.total, 0),
      donation_count = coalesce(t.n, 0),
      donor_count    = coalesce(t.donors, 0)
  from (
    select
      sum(amount)                        as total,
      count(*)                           as n,
      count(distinct lower(donor_email)) as donors
    from public.donations
    where campaign_id = target and status = 'completed'
  ) t
  where c.id = target;
$$;

create or replace function public.on_donation_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op in ('UPDATE', 'DELETE') and old.campaign_id is not null then
    perform public.recount_campaign(old.campaign_id);
  end if;
  if tg_op in ('INSERT', 'UPDATE') and new.campaign_id is not null then
    perform public.recount_campaign(new.campaign_id);
  end if;
  return null;
end;
$$;

drop trigger if exists donations_recount on public.donations;
create trigger donations_recount
  after insert or update or delete on public.donations
  for each row execute function public.on_donation_change();

-- ---------------------------------------------------------------------------
-- donation_totals — lifetime aggregates for the dashboard header tiles.
-- A function rather than a client-side sum so the dashboard never has to pull
-- every donation row down the wire. Staff only.
-- ---------------------------------------------------------------------------
create or replace function public.donation_totals()
returns table (
  total_raised      numeric,
  donation_count    bigint,
  donor_count       bigint,
  pending_count     bigint,
  monthly_recurring numeric
)
language sql
stable
security invoker
set search_path = public
as $$
  select
    coalesce(sum(amount) filter (where status = 'completed'), 0),
    count(*) filter (where status = 'completed'),
    count(distinct lower(donor_email)) filter (where status = 'completed'),
    count(*) filter (where status = 'pending'),
    coalesce(sum(amount) filter (where status = 'completed' and frequency = 'monthly'), 0)
  from public.donations;
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles  enable row level security;
alter table public.campaigns enable row level security;
alter table public.donations enable row level security;

-- profiles ------------------------------------------------------------------
drop policy if exists "own profile readable" on public.profiles;
create policy "own profile readable" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

drop policy if exists "own profile updatable" on public.profiles;
create policy "own profile updatable" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- The policy above lets people edit their own name/avatar. It cannot also
-- freeze `role` — reading profiles from inside a profiles policy recurses — so
-- privilege escalation is blocked by a trigger instead.
create or replace function public.guard_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'only admins may change a role';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_guard_role on public.profiles;
create trigger profiles_guard_role
  before update on public.profiles
  for each row execute function public.guard_profile_role();

drop policy if exists "admins manage profiles" on public.profiles;
create policy "admins manage profiles" on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- campaigns -----------------------------------------------------------------
drop policy if exists "live campaigns are public" on public.campaigns;
create policy "live campaigns are public" on public.campaigns
  for select using (status in ('active', 'completed') or public.is_staff());

drop policy if exists "staff manage campaigns" on public.campaigns;
create policy "staff manage campaigns" on public.campaigns
  for all using (public.is_staff()) with check (public.is_staff());

-- donations -----------------------------------------------------------------
-- Anyone may create a donation, but only ever in `pending` state. Moving money
-- to `completed` is the payment webhook's job (service role) or an admin's.
drop policy if exists "anyone can start a donation" on public.donations;
create policy "anyone can start a donation" on public.donations
  for insert with check (status = 'pending');

drop policy if exists "staff read donations" on public.donations;
create policy "staff read donations" on public.donations
  for select using (public.is_staff());

drop policy if exists "admins manage donations" on public.donations;
create policy "admins manage donations" on public.donations
  for all using (public.is_admin()) with check (public.is_admin());
