-- Uren per week + salarisschaal/trede op plaatsingen (dataverzameling:
-- part-time vs full-time, en koppeling aan de CAO-schalen). Plus een
-- beheertabel voor de schalen/tredes die elk half jaar wordt bijgewerkt.

alter table public.placements add column if not exists uren_per_week numeric;
alter table public.placements add column if not exists schaal int;
alter table public.placements add column if not exists trede int;
alter table public.placements add column if not exists schaal_bruto numeric; -- momentopname bruto maandbedrag

-- Matrix van schalen (kolommen) x tredes (rijen) met het bruto maandbedrag.
create table if not exists public.salarisschalen (
  id          uuid primary key default gen_random_uuid(),
  schaal      int not null,
  trede       int not null,
  bruto_maand numeric,
  updated_at  timestamptz not null default now(),
  unique (schaal, trede)
);

alter table public.salarisschalen enable row level security;

-- Iedereen in het beheer mag de schalen lezen (nodig voor de plaatsing-keuze).
drop policy if exists salarisschalen_select on public.salarisschalen;
create policy salarisschalen_select on public.salarisschalen for select using (public.is_admin());

-- Alleen een super-admin mag de schalen invullen/bijwerken.
drop policy if exists salarisschalen_write on public.salarisschalen;
create policy salarisschalen_write on public.salarisschalen for all
  using (exists (select 1 from public.admin_users a where a.user_id = auth.uid() and a.role = 'super_admin'))
  with check (exists (select 1 from public.admin_users a where a.user_id = auth.uid() and a.role = 'super_admin'));
