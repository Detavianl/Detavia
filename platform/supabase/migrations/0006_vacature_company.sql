-- ============================================================
-- Koppel vacatures aan een opdrachtgever (bedrijf), zodat ze op het
-- bedrijfsdetail getoond kunnen worden.
-- ============================================================
alter table public.vacatures
  add column if not exists company_id uuid references public.companies(id) on delete set null;

create index if not exists vacatures_company_idx on public.vacatures(company_id);
