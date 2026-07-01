import { createClient } from "@/lib/supabase/server";
import type { Trede } from "@/lib/schalen-util";

export type { Trede } from "@/lib/schalen-util";

// Alle salaristredes serverside ophalen. Valt terug op een lege lijst als de
// tabel (nog) niet bestaat, zodat pagina's niet breken.
export async function loadTredes(): Promise<Trede[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("salaristredes")
      .select("trede, maandsalaris, vakantiegeld, eindejaarsuitkering, totaal_bruto, werkgeverslasten, totale_kosten, inkooptarief_uur")
      .order("trede", { ascending: true });
    const num = (v: unknown) => (v == null ? null : Number(v));
    return (data ?? []).map((r) => ({
      trede: Number(r.trede),
      maandsalaris: num(r.maandsalaris),
      vakantiegeld: num(r.vakantiegeld),
      eindejaarsuitkering: num(r.eindejaarsuitkering),
      totaal_bruto: num(r.totaal_bruto),
      werkgeverslasten: num(r.werkgeverslasten),
      totale_kosten: num(r.totale_kosten),
      inkooptarief_uur: num(r.inkooptarief_uur),
    }));
  } catch {
    return [];
  }
}
