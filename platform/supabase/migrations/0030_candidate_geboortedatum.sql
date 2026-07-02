-- Geboortedatum op kandidaten.
alter table public.candidates add column if not exists geboortedatum date;
