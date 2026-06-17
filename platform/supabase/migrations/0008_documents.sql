-- ============================================================
-- Documenten bij een kandidaat: cv's en meer (motivatie, diploma, referentie...).
-- Hergebruikt de bestaande 'cvs'-tabel + bucket; voegt een soort toe.
-- ============================================================
alter table public.cvs
  add column if not exists soort text not null default 'cv'
    check (soort in ('cv','motivatie','diploma','referentie','id','overig'));
