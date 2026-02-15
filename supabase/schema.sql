-- ============================================================
-- Personal Finance Tracker — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ─── EXTENSIONS ─────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── PROFILES ───────────────────────────────────────────────
-- Extends auth.users one-to-one; stores app-level user data
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  currency   text not null default 'USD',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using ((select auth.uid()) = id);

create policy "Users can update own profile"
  on public.profiles for update
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Auto-create profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── CATEGORIES ─────────────────────────────────────────────
create table public.categories (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid references auth.users(id) on delete cascade,  -- null = system default
  name       text not null,
  color      text not null default '#6366f1',
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_categories_user_id on public.categories(user_id);

alter table public.categories enable row level security;

-- Users see their own categories AND system defaults (user_id IS NULL)
create policy "Users can view own and default categories"
  on public.categories for select
  using (user_id is null or (select auth.uid()) = user_id);

create policy "Users can insert own categories"
  on public.categories for insert
  with check ((select auth.uid()) = user_id);

create policy "Users can update own categories"
  on public.categories for update
  using ((select auth.uid()) = user_id);

create policy "Users can delete own categories"
  on public.categories for delete
  using ((select auth.uid()) = user_id);

-- Seed system default categories
insert into public.categories (name, color, is_default, user_id) values
  ('Housing',       '#ef4444', true, null),
  ('Food',          '#f97316', true, null),
  ('Transport',     '#eab308', true, null),
  ('Healthcare',    '#22c55e', true, null),
  ('Entertainment', '#8b5cf6', true, null),
  ('Shopping',      '#ec4899', true, null),
  ('Utilities',     '#06b6d4', true, null),
  ('Salary',        '#10b981', true, null),
  ('Freelance',     '#3b82f6', true, null),
  ('Investments',   '#6366f1', true, null),
  ('Other',         '#6b7280', true, null);

-- ─── TRANSACTIONS ────────────────────────────────────────────
create table public.transactions (
  id                   uuid primary key default uuid_generate_v4(),
  user_id              uuid not null references auth.users(id) on delete cascade,
  amount               numeric(12, 2) not null check (amount > 0),
  type                 text not null check (type in ('income', 'expense')),
  category_id          uuid references public.categories(id) on delete set null,
  date                 date not null,
  note                 text,
  is_recurring         boolean not null default false,
  recurrence_frequency text check (recurrence_frequency in ('daily','weekly','monthly','yearly')),
  created_at           timestamptz not null default now()
);

create index idx_transactions_user_id   on public.transactions(user_id);
create index idx_transactions_date      on public.transactions(date);
create index idx_transactions_category  on public.transactions(category_id);
create index idx_transactions_user_date on public.transactions(user_id, date);

alter table public.transactions enable row level security;

create policy "Users can view own transactions"
  on public.transactions for select
  using ((select auth.uid()) = user_id);

create policy "Users can insert own transactions"
  on public.transactions for insert
  with check ((select auth.uid()) = user_id);

create policy "Users can update own transactions"
  on public.transactions for update
  using ((select auth.uid()) = user_id);

create policy "Users can delete own transactions"
  on public.transactions for delete
  using ((select auth.uid()) = user_id);

-- ─── BUDGETS ─────────────────────────────────────────────────
create table public.budgets (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  category_id    uuid not null references public.categories(id) on delete cascade,
  monthly_limit  numeric(12, 2) not null check (monthly_limit > 0),
  month          smallint not null check (month between 1 and 12),
  year           smallint not null,
  alert_sent_80  boolean not null default false,
  alert_sent_100 boolean not null default false,
  created_at     timestamptz not null default now(),
  unique (user_id, category_id, month, year)
);

create index idx_budgets_user_id    on public.budgets(user_id);
create index idx_budgets_user_month on public.budgets(user_id, year, month);

alter table public.budgets enable row level security;

create policy "Users can manage own budgets"
  on public.budgets for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- ─── SAVINGS GOALS ───────────────────────────────────────────
create table public.savings_goals (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  name           text not null,
  target_amount  numeric(12, 2) not null check (target_amount > 0),
  current_amount numeric(12, 2) not null default 0 check (current_amount >= 0),
  target_date    date,
  created_at     timestamptz not null default now()
);

create index idx_savings_goals_user_id on public.savings_goals(user_id);

alter table public.savings_goals enable row level security;

create policy "Users can manage own savings goals"
  on public.savings_goals for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- ─── SAVINGS CONTRIBUTIONS ───────────────────────────────────
create table public.savings_contributions (
  id         uuid primary key default uuid_generate_v4(),
  goal_id    uuid not null references public.savings_goals(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  amount     numeric(12, 2) not null check (amount > 0),
  date       date not null default current_date,
  note       text,
  created_at timestamptz not null default now()
);

create index idx_contributions_goal_id on public.savings_contributions(goal_id);
create index idx_contributions_user_id on public.savings_contributions(user_id);

alter table public.savings_contributions enable row level security;

create policy "Users can manage own contributions"
  on public.savings_contributions for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Auto-update current_amount on savings_goals when a contribution is inserted/deleted
create or replace function public.update_goal_amount()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if TG_OP = 'INSERT' then
    update savings_goals
    set current_amount = current_amount + new.amount
    where id = new.goal_id;
  elsif TG_OP = 'DELETE' then
    update savings_goals
    set current_amount = greatest(0, current_amount - old.amount)
    where id = old.goal_id;
  end if;
  return coalesce(new, old);
end;
$$;

create trigger on_contribution_change
  after insert or delete on public.savings_contributions
  for each row execute procedure public.update_goal_amount();
