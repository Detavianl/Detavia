-- ============================================================
-- Kandidaat-uitbreiding (CRM-stijl) voor hoger segment + verbeterde funnel
-- ============================================================

-- ---------- rijker kandidaatprofiel ----------
alter table public.candidates
  add column if not exists niveau            text check (niveau in ('medior','senior','lead','interim','executive')),
  add column if not exists huidige_functie   text,
  add column if not exists huidige_werkgever text,
  add column if not exists beschikbaar_per   date,
  add column if not exists uren_beschikbaar  int,
  add column if not exists tarief_min        int,   -- uurtarief (€)
  add column if not exists tarief_max        int,
  add column if not exists salaris_indicatie text,
  add column if not exists opleidingsniveau  text,
  add column if not exists regio             text,
  add column if not exists talen             text,
  add column if not exists rijbewijs         boolean not null default false,
  add column if not exists expertise         text[] not null default '{}',
  add column if not exists rating            int not null default 0 check (rating between 0 and 5),
  add column if not exists status            text not null default 'actief'
                                               check (status in ('talentpool','actief','bemiddeld','niet_beschikbaar')),
  add column if not exists eigenaar          uuid references auth.users(id) on delete set null,
  add column if not exists laatste_contact   date,
  add column if not exists avg_toestemming   boolean not null default false,
  add column if not exists bewaren_tot       date;

create index if not exists candidates_status_idx    on public.candidates(status);
create index if not exists candidates_eigenaar_idx  on public.candidates(eigenaar);

-- ---------- activiteiten-tijdlijn (contactmomenten) ----------
create table if not exists public.candidate_activities (
  id           uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  type         text not null default 'notitie'
                 check (type in ('notitie','telefoon','email','gesprek','voorstel','statuswijziging')),
  inhoud       text not null,
  created_by   uuid references auth.users(id) on delete set null,
  created_at   timestamptz not null default now()
);
alter table public.candidate_activities enable row level security;
create policy activities_admin_all on public.candidate_activities
  for all using (public.is_admin()) with check (public.is_admin());
create index if not exists activities_candidate_idx on public.candidate_activities(candidate_id, created_at desc);

-- ---------- verbeterde funnel-stages ----------
alter table public.applications drop constraint if exists applications_stage_check;
alter table public.applications
  add constraint applications_stage_check
  check (stage in ('nieuw','kwalificatie','kennismaking','voorgesteld','aanbieding','geplaatst','afgewezen','talentpool'));

-- reden bij afwijzing (optioneel)
alter table public.applications
  add column if not exists afwijs_reden text;
