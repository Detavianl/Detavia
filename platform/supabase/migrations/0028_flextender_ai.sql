-- Door Claude gestructureerde vacaturetekst (intro/taken/eisen) + hash van de
-- bron, zodat we alleen bij wijziging opnieuw door de AI halen.
alter table public.flextender_opdrachten add column if not exists ai_json jsonb;
alter table public.flextender_opdrachten add column if not exists bron_hash text;
