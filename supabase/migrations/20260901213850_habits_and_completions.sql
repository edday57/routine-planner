create type public.habit_type as enum ('daily', 'scheduled', 'weekly_target');

create table public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  type public.habit_type not null,
  scheduled_days smallint[],
  weekly_target smallint,
  time_label text,
  emoji text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint habits_name_not_empty check (char_length(btrim(name)) > 0),
  constraint habits_weekly_target_range check (
    weekly_target is null or (weekly_target >= 1 and weekly_target <= 7)
  )
);

create table public.completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  habit_id uuid not null references public.habits (id) on delete cascade,
  completed_on date not null,
  created_at timestamptz not null default now(),
  unique (user_id, habit_id, completed_on)
);

create index habits_user_id_idx on public.habits (user_id, sort_order);
create index completions_user_id_date_idx on public.completions (user_id, completed_on);

alter table public.habits enable row level security;
alter table public.completions enable row level security;

create policy habits_select_own
  on public.habits for select to authenticated
  using (user_id = (select auth.uid()));

create policy habits_insert_own
  on public.habits for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy habits_update_own
  on public.habits for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy habits_delete_own
  on public.habits for delete to authenticated
  using (user_id = (select auth.uid()));

create policy completions_select_own
  on public.completions for select to authenticated
  using (user_id = (select auth.uid()));

create policy completions_insert_own
  on public.completions for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy completions_update_own
  on public.completions for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy completions_delete_own
  on public.completions for delete to authenticated
  using (user_id = (select auth.uid()));
