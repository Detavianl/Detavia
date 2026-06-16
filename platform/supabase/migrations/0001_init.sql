-- ============================================================
-- DetaVia platform — initieel schema
-- Intern team (ATS + blog + cv's). Geen jobboard.
-- Auth via Supabase auth.users. Admin-rollen apart (à la Workster).
-- ============================================================

-- ---------- helper: is de huidige user een admin? ----------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid() and role = 'super_admin');
$$;

-- ---------- admin_users: intern team + rollen ----------
create table public.admin_users (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  naam       text not null default '',
  role       text not null default 'recruiter' check (role in ('super_admin','admin','recruiter')),
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;

-- iedere admin mag de teamlijst zien; alleen super_admin beheert
create policy admin_users_select on public.admin_users
  for select using (public.is_admin());
create policy admin_users_write on public.admin_users
  for all using (public.is_super_admin()) with check (public.is_super_admin());

-- ---------- vacatures (DB-gedreven, getoond op publieke site) ----------
create table public.vacatures (
  id          uuid primary key default gen_random_uuid(),
  titel       text not null,
  slug        text unique,
  vakgebied   text not null check (vakgebied in ('wmo','jeugd','participatie','schuld','inkomen','beleid')),
  plaats      text not null default '',
  uren_min    int  not null default 32,
  uren_max    int  not null default 36,
  salaris_min int,
  salaris_max int,
  type        text not null default 'Detachering',
  top         boolean not null default false,
  omschrijving text not null default '',
  status      text not null default 'open' check (status in ('open','gesloten')),
  created_at  timestamptz not null default now()
);
alter table public.vacatures enable row level security;
-- publiek: alleen open vacatures zichtbaar; admins alles
create policy vacatures_public_read on public.vacatures
  for select using (status = 'open' or public.is_admin());
create policy vacatures_admin_write on public.vacatures
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- candidates (de mens + contactgegevens) ----------
create table public.candidates (
  id          uuid primary key default gen_random_uuid(),
  naam        text not null,
  email       text,
  telefoon    text,
  woonplaats  text,
  vakgebied   text check (vakgebied in ('wmo','jeugd','participatie','schuld','inkomen','beleid')),
  linkedin    text,
  bron        text not null default 'handmatig' check (bron in ('formulier','handmatig')),
  notitie     text not null default '',
  created_at  timestamptz not null default now(),
  created_by  uuid references auth.users(id) on delete set null
);
alter table public.candidates enable row level security;
-- alleen intern team; publieke instroom loopt via service-role server action
create policy candidates_admin_all on public.candidates
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- cvs (bestand in Storage bucket 'cvs') ----------
create table public.cvs (
  id           uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  storage_path text not null,
  filename     text not null,
  uploaded_at  timestamptz not null default now()
);
alter table public.cvs enable row level security;
create policy cvs_admin_all on public.cvs
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- applications = ATS-kaarten (pijplijn) ----------
create table public.applications (
  id           uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  vacature_id  uuid references public.vacatures(id) on delete set null,
  stage        text not null default 'nieuw'
                 check (stage in ('nieuw','screening','gesprek','voorgesteld','geplaatst','afgewezen')),
  positie      int  not null default 0,   -- volgorde binnen een kolom
  notitie      text not null default '',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
alter table public.applications enable row level security;
create policy applications_admin_all on public.applications
  for all using (public.is_admin()) with check (public.is_admin());
create index applications_stage_idx on public.applications(stage, positie);

-- ---------- blog_posts (verhalen) ----------
create table public.blog_posts (
  id           uuid primary key default gen_random_uuid(),
  titel        text not null,
  slug         text unique not null,
  categorie    text not null default 'Verhaal',
  excerpt      text not null default '',
  content_html text not null default '',
  cover_path   text,
  status       text not null default 'concept' check (status in ('concept','gepubliceerd')),
  published_at timestamptz,
  author_id    uuid references auth.users(id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
alter table public.blog_posts enable row level security;
-- publiek: alleen gepubliceerd; admins alles
create policy blog_public_read on public.blog_posts
  for select using (status = 'gepubliceerd' or public.is_admin());
create policy blog_admin_write on public.blog_posts
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- contact_messages ----------
create table public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  naam       text not null,
  email      text not null,
  telefoon   text,
  soort      text not null default 'professional',
  bericht    text not null default '',
  gelezen    boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.contact_messages enable row level security;
create policy contact_admin_all on public.contact_messages
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- updated_at trigger ----------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
create trigger applications_touch before update on public.applications
  for each row execute function public.touch_updated_at();
create trigger blog_touch before update on public.blog_posts
  for each row execute function public.touch_updated_at();
