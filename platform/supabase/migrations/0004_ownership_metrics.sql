-- ============================================================
-- Eigenaarschap + opvolging op kandidaat, en doorlooptijd-meting in de funnel
-- ============================================================

-- ---------- volgende actie / reminder op de kandidaat ----------
alter table public.candidates
  add column if not exists volgende_actie        text,
  add column if not exists volgende_actie_datum  date;

create index if not exists candidates_actie_idx on public.candidates(volgende_actie_datum);

-- ---------- tijdstip van laatste stage-wijziging (voor 'dagen in fase') ----------
alter table public.applications
  add column if not exists stage_changed_at timestamptz not null default now();

-- houd stage_changed_at bij wanneer de stage verandert
create or replace function public.touch_stage_changed()
returns trigger language plpgsql as $$
begin
  if new.stage is distinct from old.stage then
    new.stage_changed_at = now();
  end if;
  return new;
end; $$;

drop trigger if exists applications_stage_touch on public.applications;
create trigger applications_stage_touch before update on public.applications
  for each row execute function public.touch_stage_changed();
