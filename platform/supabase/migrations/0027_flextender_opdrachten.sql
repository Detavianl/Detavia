-- Externe inhuuropdrachten uit de Flextender-API (alleen sociaal domein).
-- Publiek leesbaar; wordt periodiek ververst via de service-role (sync-route).
create table if not exists public.flextender_opdrachten (
  avnummer              bigint primary key,
  opdracht              text,
  omschrijving          text,       -- HTML (wordt bij weergave gesanitized)
  opdrachtgever         text,
  opleiding             text,
  regio                 text,
  sluiting_inschrijving timestamptz,
  urenperweek           text,
  aanvang               text,
  duur                  text,
  aantal_professionals  text,
  verlengingsoptie      text,
  kvk                   text,
  vakgebieden           text[],
  synced_at             timestamptz not null default now()
);

alter table public.flextender_opdrachten enable row level security;
drop policy if exists flextender_select on public.flextender_opdrachten;
create policy flextender_select on public.flextender_opdrachten for select using (true);

create index if not exists flextender_sluiting_idx on public.flextender_opdrachten (sluiting_inschrijving);
