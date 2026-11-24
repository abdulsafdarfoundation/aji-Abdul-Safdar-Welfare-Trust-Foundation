-- ============================================================================
-- Site content managed from /admin: updates & announcements, work-done media,
-- reviews, and admin-added causes. Plus the public `media` storage bucket the
-- admin uploads photos/videos into from their phone.
--
-- Run in Supabase Studio → SQL Editor (after 0001_init.sql).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- posts — one table for the three media feeds, split by `kind`
--   update → /updates page (announcements, may have text + one photo/video)
--   work   → "Work" gallery on the home page
--   review → /reviews page (photo / video reviews)
-- ---------------------------------------------------------------------------
create table if not exists public.posts (
  id         uuid primary key default gen_random_uuid(),
  kind       text not null check (kind in ('update', 'work', 'review')),
  title      text not null default '',
  body       text not null default '',
  media_url  text,
  media_path text,
  media_type text check (media_type in ('image', 'video')),
  created_at timestamptz not null default now()
);

create index if not exists posts_kind_created_idx on public.posts (kind, created_at desc);

-- ---------------------------------------------------------------------------
-- causes — added from the admin, shown above the built-in causes
-- ---------------------------------------------------------------------------
create table if not exists public.causes (
  id             uuid primary key default gen_random_uuid(),
  title_en       text not null,
  title_fr       text not null default '',
  description_en text not null default '',
  description_fr text not null default '',
  category_en    text not null default '',
  category_fr    text not null default '',
  image_url      text,
  image_path     text,
  popular        boolean not null default false,
  created_at     timestamptz not null default now()
);

create index if not exists causes_created_idx on public.causes (created_at desc);

-- ---------------------------------------------------------------------------
-- RLS: everyone reads, staff (admin/editor) write
-- ---------------------------------------------------------------------------
alter table public.posts  enable row level security;
alter table public.causes enable row level security;

drop policy if exists "posts are public" on public.posts;
create policy "posts are public" on public.posts for select using (true);

drop policy if exists "staff manage posts" on public.posts;
create policy "staff manage posts" on public.posts
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "causes are public" on public.causes;
create policy "causes are public" on public.causes for select using (true);

drop policy if exists "staff manage causes" on public.causes;
create policy "staff manage causes" on public.causes
  for all using (public.is_staff()) with check (public.is_staff());

-- ---------------------------------------------------------------------------
-- Storage bucket `media` — public read, staff upload/delete.
-- Uploads go straight from the admin's phone browser to Storage, so large
-- videos never pass through the Next.js server. 50 MB is the free-plan cap.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media', 'media', true, 52428800,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif',
        'video/mp4', 'video/quicktime', 'video/webm', 'video/3gpp']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "staff upload media" on storage.objects;
create policy "staff upload media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_staff());

drop policy if exists "staff delete media" on storage.objects;
create policy "staff delete media" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_staff());
