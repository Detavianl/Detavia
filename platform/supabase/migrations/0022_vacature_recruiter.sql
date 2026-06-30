-- Recruiter gekoppeld aan een vacature (voor o.a. afzender bevestigingsmail).
alter table public.vacatures add column if not exists recruiter_id uuid;
