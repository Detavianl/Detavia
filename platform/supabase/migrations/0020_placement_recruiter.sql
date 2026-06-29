-- Recruiter expliciet op de plaatsing (default = eigenaar van de kandidaat),
-- zodat Verdiensten afrekent op de plaatsing, ongeacht wie het formulier invult.
alter table public.placements add column if not exists recruiter_id uuid;
update public.placements p
  set recruiter_id = c.eigenaar
  from public.candidates c
  where p.candidate_id = c.id and p.recruiter_id is null;
