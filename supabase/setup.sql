-- مِداد: جدول روابط الطالب. شغّل هذا الملف مرة واحدة في Supabase SQL Editor.
create table if not exists public.study_resources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  subject_id text not null check (subject_id in (
    'math', 'physics', 'science', 'islamic', 'history',
    'arabic', 'french', 'philosophy', 'english'
  )),
  title text not null check (char_length(title) between 1 and 120),
  url text not null check (
    char_length(url) <= 2048 and url ~* '^https?://'
  ),
  created_at timestamptz not null default now()
);

create index if not exists study_resources_user_subject_created_idx
  on public.study_resources (user_id, subject_id, created_at desc);

alter table public.study_resources enable row level security;

revoke all on table public.study_resources from anon, authenticated;
grant usage on schema public to authenticated;
grant select, insert, delete on table public.study_resources to authenticated;

drop policy if exists "Students read their own study resources" on public.study_resources;
create policy "Students read their own study resources"
  on public.study_resources for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Students add their own study resources" on public.study_resources;
create policy "Students add their own study resources"
  on public.study_resources for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Students delete their own study resources" on public.study_resources;
create policy "Students delete their own study resources"
  on public.study_resources for delete
  to authenticated
  using ((select auth.uid()) = user_id);
