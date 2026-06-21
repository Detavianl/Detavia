-- Generieke notities-tabel: werkt voor elke entiteit (plaatsing, factuur,
-- vacature, ...). Kandidaten/bedrijven houden hun eigen activiteiten-tabellen.
create table if not exists public.notes (
  id          uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id   uuid not null,
  body        text not null,
  author_id   uuid references auth.users(id) on delete set null,
  author_naam text not null default '',
  created_at  timestamptz not null default now()
);

create index if not exists notes_entity_idx on public.notes(entity_type, entity_id, created_at desc);

alter table public.notes enable row level security;

drop policy if exists notes_admin_all on public.notes;
create policy notes_admin_all on public.notes for all
  using (public.is_admin()) with check (public.is_admin());
