-- ============================================================
-- Rijke vacaturevelden voor de detailpagina (per vacature in te vullen
-- via het beheer): wat ga je doen, eisen, opdrachtgever, start en duur.
-- ============================================================
alter table public.vacatures
  add column if not exists taken         text   not null default '',
  add column if not exists eisen         text[] not null default '{}',
  add column if not exists opdrachtgever text   not null default '',
  add column if not exists startdatum    text   not null default '',
  add column if not exists duur          text   not null default '';
