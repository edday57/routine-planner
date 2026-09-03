create type public.goal_horizon as enum ('short', 'long');
create type public.goal_status as enum ('active', 'reached');

create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  why text,
  horizon public.goal_horizon not null,
  emoji text,
  target_steps smallint,
  status public.goal_status not null default 'active',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint goals_title_not_empty check (char_length(btrim(title)) > 0),
  constraint goals_target_steps_range check (
    target_steps is null or (target_steps >= 1 and target_steps <= 365)
  )
);

create table public.goal_steps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  goal_id uuid not null references public.goals (id) on delete cascade,
  title text not null,
  logged_on date not null default (current_date),
  created_at timestamptz not null default now(),
  constraint goal_steps_title_not_empty check (char_length(btrim(title)) > 0)
);

create index goals_user_id_idx on public.goals (user_id, sort_order);
create index goal_steps_user_goal_idx on public.goal_steps (user_id, goal_id, logged_on desc);

alter table public.goals enable row level security;
alter table public.goal_steps enable row level security;

create policy goals_select_own
  on public.goals for select to authenticated
  using (user_id = (select auth.uid()));

create policy goals_insert_own
  on public.goals for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy goals_update_own
  on public.goals for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy goals_delete_own
  on public.goals for delete to authenticated
  using (user_id = (select auth.uid()));

create policy goal_steps_select_own
  on public.goal_steps for select to authenticated
  using (user_id = (select auth.uid()));

create policy goal_steps_insert_own
  on public.goal_steps for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy goal_steps_update_own
  on public.goal_steps for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy goal_steps_delete_own
  on public.goal_steps for delete to authenticated
  using (user_id = (select auth.uid()));
