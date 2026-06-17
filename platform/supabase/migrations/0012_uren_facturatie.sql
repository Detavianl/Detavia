-- ============================================================
-- Facturatie uit goedgekeurde uren: koppel uren aan een factuur
-- (voorkomt dubbel factureren) en factuur aan een plaatsing.
-- ============================================================
alter table public.hours
  add column if not exists invoice_id uuid references public.invoices(id) on delete set null;
create index if not exists hours_invoice_idx on public.hours(invoice_id);

alter table public.invoices
  add column if not exists placement_id uuid references public.placements(id) on delete set null,
  add column if not exists aantal_uren numeric(7,2);
