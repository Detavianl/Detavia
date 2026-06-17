-- ============================================================
-- Facturen: automatisch een conceptfactuur bij een gewonnen deal.
-- Klaar om later via Resend te versturen (status verzonden/betaald).
-- ============================================================
create table if not exists public.invoices (
  id            uuid primary key default gen_random_uuid(),
  nummer        text unique not null,
  deal_id       uuid references public.deals(id) on delete set null,
  company_id    uuid references public.companies(id) on delete set null,
  bedrijf_naam  text not null default '',          -- snapshot van de opdrachtgever
  bedrijf_email text,                              -- ontvanger (voor Resend)
  omschrijving  text not null default '',
  bedrag        int  not null default 0,            -- excl. btw, hele euro's
  btw_pct       int  not null default 21,
  status        text not null default 'concept' check (status in ('concept','verzonden','betaald')),
  factuurdatum  date not null default current_date,
  vervaldatum   date,
  verzonden_at  timestamptz,
  created_at    timestamptz not null default now()
);
alter table public.invoices enable row level security;
create policy invoices_admin_all on public.invoices for all using (public.is_admin()) with check (public.is_admin());
create index if not exists invoices_status_idx on public.invoices(status, created_at desc);
create index if not exists invoices_deal_idx on public.invoices(deal_id);
