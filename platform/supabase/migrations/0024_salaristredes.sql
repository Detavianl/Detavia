-- Herzien model: één salaristabel op basis van trede (geen aparte schalen).
-- Alle kostenkolommen worden volledig ingevuld (uit Excel). Het inkooptarief/uur
-- vult het inkooptarief van een plaatsing; het bruto maandsalaris wordt als
-- momentopname bij de plaatsing bewaard.

alter table public.placements drop column if exists schaal;
alter table public.placements drop column if exists schaal_bruto;
alter table public.placements add column if not exists trede_maandsalaris numeric;

drop table if exists public.salarisschalen;

create table if not exists public.salaristredes (
  trede               int primary key,
  maandsalaris        numeric,
  vakantiegeld        numeric,
  eindejaarsuitkering numeric,
  totaal_bruto        numeric,
  werkgeverslasten    numeric,
  totale_kosten       numeric,
  inkooptarief_uur    numeric,
  updated_at          timestamptz not null default now()
);

insert into public.salaristredes
  (trede, maandsalaris, vakantiegeld, eindejaarsuitkering, totaal_bruto, werkgeverslasten, totale_kosten, inkooptarief_uur) values
  (0, 3524, 282, 238, 4044, 1306, 5350, 34.29),
  (1, 3661, 293, 247, 4201, 1357, 5558, 35.63),
  (2, 3799, 304, 256, 4359, 1408, 5767, 36.97),
  (3, 3936, 315, 266, 4517, 1459, 5975, 38.30),
  (4, 4073, 326, 275, 4674, 1510, 6183, 39.64),
  (5, 4210, 337, 284, 4831, 1560, 6391, 40.97),
  (6, 4348, 348, 293, 4989, 1612, 6601, 42.31),
  (7, 4485, 359, 303, 5147, 1662, 6809, 43.65),
  (8, 4622, 370, 312, 5304, 1713, 7017, 44.98),
  (9, 4759, 381, 321, 5461, 1764, 7225, 46.31),
  (10, 4896, 392, 330, 5618, 1815, 7433, 47.65),
  (11, 5033, 403, 340, 5775, 1865, 7641, 48.98)
on conflict (trede) do nothing;

alter table public.salaristredes enable row level security;

drop policy if exists salaristredes_select on public.salaristredes;
create policy salaristredes_select on public.salaristredes for select using (public.is_admin());

drop policy if exists salaristredes_write on public.salaristredes;
create policy salaristredes_write on public.salaristredes for all
  using (exists (select 1 from public.admin_users a where a.user_id = auth.uid() and a.role = 'super_admin'))
  with check (exists (select 1 from public.admin_users a where a.user_id = auth.uid() and a.role = 'super_admin'));
