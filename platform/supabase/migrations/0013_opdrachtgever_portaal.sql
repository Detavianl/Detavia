-- ============================================================
-- Opdrachtgever-portaal: een contactpersoon van een bedrijf logt in en
-- keurt de uren goed van de professionals die bij hen geplaatst zijn.
-- ============================================================
alter table public.contacts
  add column if not exists portaal_user_id uuid references auth.users(id) on delete set null;
create index if not exists contacts_portaal_idx on public.contacts(portaal_user_id);

-- bedrijf van de ingelogde opdrachtgever
create or replace function public.client_company()
returns uuid language sql stable security definer set search_path = public as $$
  select company_id from public.contacts where portaal_user_id = auth.uid() limit 1;
$$;

create or replace function public.is_client_of_placement(pl uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.placements p where p.id = pl and p.company_id = public.client_company());
$$;

-- contact mag z'n eigen rij lezen
create policy contacts_self_read on public.contacts
  for select using (portaal_user_id = auth.uid());

-- opdrachtgever ziet de plaatsingen bij zijn eigen bedrijf
create policy placements_client_read on public.placements
  for select using (company_id = public.client_company());

-- opdrachtgever ziet de uren van die plaatsingen en mag ze goed-/afkeuren
create policy hours_client_read on public.hours
  for select using (public.is_client_of_placement(placement_id));
create policy hours_client_update on public.hours
  for update using (public.is_client_of_placement(placement_id) and status = 'ingediend')
  with check (public.is_client_of_placement(placement_id));
