-- DetaVia-fee per plaatsing (percentage van de marge dat DetaVia houdt).
-- De recruiter (eigenaar van de kandidaat) krijgt de rest van de marge per uur.
-- Default 31%, later per plaatsing aanpasbaar.
alter table public.placements
  add column if not exists detavia_fee_pct numeric(5,2) not null default 31;
