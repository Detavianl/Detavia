-- Salaris-periode + automatische inactief-datum voor vacatures.
-- Salarisbedragen naar numeric zodat uurtarieven met centen kloppen (bv. 62,50).
alter table public.vacatures
  alter column salaris_min type numeric(10,2) using salaris_min::numeric,
  alter column salaris_max type numeric(10,2) using salaris_max::numeric;

alter table public.vacatures
  add column if not exists salaris_periode text not null default 'maand'
    check (salaris_periode in ('uur','week','4weken','maand')),
  add column if not exists inactief_op date;
