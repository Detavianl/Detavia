-- ============================================================
-- Eigenaar & opvolging ook op bedrijven (companies.eigenaar bestaat al, 0005).
-- ============================================================
alter table public.companies
  add column if not exists volgende_actie        text,
  add column if not exists volgende_actie_datum  date;

create index if not exists companies_actie_idx on public.companies(volgende_actie_datum);
