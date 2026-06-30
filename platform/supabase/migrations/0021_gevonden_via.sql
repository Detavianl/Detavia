-- Kanaal "Hoe heb je ons gevonden?" als gestructureerd veld (voor rapportage/dashboard).
alter table public.candidates add column if not exists gevonden_via text;
