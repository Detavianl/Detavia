-- ============================================================
-- CRM (commerciële kant — opdrachtgevers): Accounts, Contacten, Deals, Activiteiten
-- Vergelijkbaar met ZOHO CRM, toegespitst op detachering sociaal domein.
-- ============================================================

-- ---------- bedrijven / accounts (opdrachtgevers) ----------
create table if not exists public.companies (
  id         uuid primary key default gen_random_uuid(),
  naam       text not null,
  type       text not null default 'gemeente' check (type in ('gemeente','organisatie','overig')),
  plaats     text,
  website    text,
  branche    text,
  status     text not null default 'prospect' check (status in ('prospect','klant','inactief')),
  eigenaar   uuid references auth.users(id) on delete set null,
  notitie    text not null default '',
  created_at timestamptz not null default now()
);
alter table public.companies enable row level security;
create policy companies_admin_all on public.companies for all using (public.is_admin()) with check (public.is_admin());

-- ---------- contactpersonen ----------
create table if not exists public.contacts (
  id         uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete set null,
  naam       text not null,
  functie    text,
  email      text,
  telefoon   text,
  linkedin   text,
  created_at timestamptz not null default now()
);
alter table public.contacts enable row level security;
create policy contacts_admin_all on public.contacts for all using (public.is_admin()) with check (public.is_admin());

-- ---------- deals / opportunities (opdrachten-aanvragen) ----------
create table if not exists public.deals (
  id                 uuid primary key default gen_random_uuid(),
  company_id         uuid references public.companies(id) on delete set null,
  contact_id         uuid references public.contacts(id) on delete set null,
  titel              text not null,
  vakgebied          text check (vakgebied in ('wmo','jeugd','participatie','schuld','inkomen','beleid')),
  waarde             int,                         -- geschatte opdrachtwaarde (€)
  stage              text not null default 'lead'
                       check (stage in ('lead','gekwalificeerd','voorstel','onderhandeling','gewonnen','verloren')),
  kans               int not null default 20 check (kans between 0 and 100),
  verwachte_sluiting date,
  eigenaar           uuid references auth.users(id) on delete set null,
  notitie            text not null default '',
  created_at         timestamptz not null default now(),
  stage_changed_at   timestamptz not null default now()
);
alter table public.deals enable row level security;
create policy deals_admin_all on public.deals for all using (public.is_admin()) with check (public.is_admin());
create index if not exists deals_stage_idx on public.deals(stage);

drop trigger if exists deals_stage_touch on public.deals;
create trigger deals_stage_touch before update on public.deals
  for each row execute function public.touch_stage_changed();

-- ---------- CRM-activiteiten / taken ----------
create table if not exists public.crm_activities (
  id         uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete cascade,
  contact_id uuid references public.contacts(id) on delete set null,
  deal_id    uuid references public.deals(id) on delete set null,
  type       text not null default 'taak' check (type in ('taak','telefoon','email','afspraak','notitie')),
  onderwerp  text not null,
  datum      date,
  gedaan     boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.crm_activities enable row level security;
create policy crm_activities_admin_all on public.crm_activities for all using (public.is_admin()) with check (public.is_admin());
