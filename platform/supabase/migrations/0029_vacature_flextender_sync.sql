-- Flextender-opdrachten worden als echte vacatures gesynct. Handmatige
-- wijzigingen mogen niet worden overschreven; daarom een vlag. Plus functieschaal.
alter table public.vacatures add column if not exists handmatig_bewerkt boolean not null default false;
alter table public.vacatures add column if not exists schaal text;
