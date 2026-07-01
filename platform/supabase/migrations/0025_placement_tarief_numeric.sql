-- Tarieven mogen decimalen bevatten (bv. inkooptarief € 44,98 uit de
-- salaristredes-tabel). De kolommen waren integer, waardoor opslaan met een
-- decimaal bedrag faalde ("invalid input syntax for type integer").
alter table public.placements alter column uurtarief type numeric using uurtarief::numeric;
alter table public.placements alter column kostprijs type numeric using kostprijs::numeric;
