-- ============================================================
-- Uren-portaal: plaatsingen (detachering) + dag-urenregistratie.
-- Professionals loggen zelf in en zien alleen hun eigen gegevens.
-- ============================================================

-- ---------- professional-login koppelen aan een kandidaat ----------
alter table public.candidates
  add column if not exists professional_user_id uuid references auth.users(id) on delete set null;
create index if not exists candidates_prof_idx on public.candidates(professional_user_id);

-- is de huidige (ingelogde) user de professional achter deze kandidaat?
create or replace function public.is_professional_of(cand uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.candidates where id = cand and professional_user_id = auth.uid());
$$;

-- kandidaat mag z'n eigen profiel/cv lezen en bijwerken
create policy candidates_self_read on public.candidates
  for select using (professional_user_id = auth.uid());
create policy candidates_self_update on public.candidates
  for update using (professional_user_id = auth.uid()) with check (professional_user_id = auth.uid());
create policy cvs_self on public.cvs
  for all using (public.is_professional_of(candidate_id)) with check (public.is_professional_of(candidate_id));

-- ---------- plaatsingen (detachering bij een opdrachtgever) ----------
create table if not exists public.placements (
  id           uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  company_id   uuid references public.companies(id) on delete set null,
  vacature_id  uuid references public.vacatures(id) on delete set null,
  functie      text not null default '',
  uurtarief    int  not null default 0,   -- naar opdrachtgever (€/u)
  kostprijs    int  not null default 0,   -- inkoop / uurloon (€/u)  -> marge = uurtarief - kostprijs
  start_datum  date,
  eind_datum   date,
  status       text not null default 'actief' check (status in ('actief','afgerond')),
  created_at   timestamptz not null default now()
);
alter table public.placements enable row level security;
create policy placements_admin_all on public.placements
  for all using (public.is_admin()) with check (public.is_admin());
-- professional ziet alleen zijn eigen plaatsingen (niet kostprijs/marge in de UI)
create policy placements_self_read on public.placements
  for select using (public.is_professional_of(candidate_id));
create index if not exists placements_candidate_idx on public.placements(candidate_id);

-- ---------- dag-urenregistratie ----------
create table if not exists public.hours (
  id            uuid primary key default gen_random_uuid(),
  placement_id  uuid not null references public.placements(id) on delete cascade,
  datum         date not null,
  uren          numeric(5,2) not null default 0,
  omschrijving  text not null default '',
  status        text not null default 'ingediend' check (status in ('ingediend','goedgekeurd','afgekeurd')),
  goedgekeurd_door uuid references auth.users(id) on delete set null,
  goedgekeurd_at   timestamptz,
  created_at    timestamptz not null default now()
);
alter table public.hours enable row level security;

-- professional achter de plaatsing van deze urenregel?
create or replace function public.is_professional_of_placement(pl uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.placements p join public.candidates c on c.id = p.candidate_id
    where p.id = pl and c.professional_user_id = auth.uid()
  );
$$;

create policy hours_admin_all on public.hours
  for all using (public.is_admin()) with check (public.is_admin());
-- professional mag eigen uren zien en toevoegen
create policy hours_self_read on public.hours
  for select using (public.is_professional_of_placement(placement_id));
create policy hours_self_insert on public.hours
  for insert with check (public.is_professional_of_placement(placement_id));
-- en aanpassen/verwijderen zolang nog niet goedgekeurd
create policy hours_self_update on public.hours
  for update using (public.is_professional_of_placement(placement_id) and status = 'ingediend')
  with check (public.is_professional_of_placement(placement_id));
create policy hours_self_delete on public.hours
  for delete using (public.is_professional_of_placement(placement_id) and status = 'ingediend');

create index if not exists hours_placement_idx on public.hours(placement_id, datum);
create index if not exists hours_status_idx on public.hours(status);
