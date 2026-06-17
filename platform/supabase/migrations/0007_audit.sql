-- ============================================================
-- Wijzigingslog (audit trail): wat, wanneer en door wie.
-- Activiteiten/notities hebben al created_by + created_at (zie 0003/0005).
-- ============================================================
create table if not exists public.audit_log (
  id         uuid primary key default gen_random_uuid(),
  entity     text not null,          -- 'candidate' | 'company' | 'deal' | 'vacature' | 'blog' | 'contact'
  entity_id  uuid,
  actie      text not null,          -- 'aangemaakt' | 'gewijzigd' | 'verwijderd' | 'fase gewijzigd'
  details    text not null default '',
  user_id    uuid references auth.users(id) on delete set null,
  user_naam  text not null default '',
  created_at timestamptz not null default now()
);
alter table public.audit_log enable row level security;
create policy audit_read   on public.audit_log for select using (public.is_admin());
create policy audit_insert on public.audit_log for insert with check (public.is_admin());
create index if not exists audit_entity_idx on public.audit_log(entity, entity_id, created_at desc);
create index if not exists audit_recent_idx on public.audit_log(created_at desc);
