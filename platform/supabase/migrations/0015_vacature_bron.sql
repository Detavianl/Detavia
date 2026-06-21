-- Bron + externe id voor automatische synchronisatie (bv. Flextender).
alter table public.vacatures
  add column if not exists bron      text not null default '',
  add column if not exists extern_id text not null default '';

create index if not exists vacatures_bron_extern_idx on public.vacatures(bron, extern_id);
