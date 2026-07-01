-- Adresvelden op kandidaten. Postcode + huisnummer worden ingevuld; straat en
-- woonplaats haalt het systeem op via de PDOK Locatieserver.
alter table public.candidates add column if not exists postcode text;
alter table public.candidates add column if not exists huisnummer text;
alter table public.candidates add column if not exists straat text;
