-- Bedrijfsbrede marge-instellingen. Eén rij, alleen super-admin mag wijzigen.
create table if not exists public.marge_config (
  id                int primary key default 1,
  ziekteverzuim_pct numeric(5,2) not null default 4.0,
  administratie_pct numeric(5,2) not null default 3.3,
  juridisch_pct     numeric(5,2) not null default 2.0,
  verzekeringen_pct numeric(5,2) not null default 1.3,
  nettowinst_pct    numeric(5,2) not null default 33.0,
  updated_at        timestamptz not null default now(),
  constraint marge_config_one_row check (id = 1)
);

insert into public.marge_config (id) values (1) on conflict (id) do nothing;

alter table public.marge_config enable row level security;

drop policy if exists marge_config_select on public.marge_config;
create policy marge_config_select on public.marge_config for select using (public.is_admin());

drop policy if exists marge_config_update on public.marge_config;
create policy marge_config_update on public.marge_config for update
  using (exists (select 1 from public.admin_users a where a.user_id = auth.uid() and a.role = 'super_admin'));
