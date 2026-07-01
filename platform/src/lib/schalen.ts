import { createClient } from "@/lib/supabase/server";
import type { Schaal } from "@/lib/schalen-util";

export type { Schaal } from "@/lib/schalen-util";

// Alle salarisschalen serverside ophalen. Valt terug op een lege lijst als de
// tabel (nog) niet bestaat, zodat pagina's niet breken.
export async function loadSchalen(): Promise<Schaal[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("salarisschalen")
      .select("schaal, trede, bruto_maand")
      .order("schaal", { ascending: true })
      .order("trede", { ascending: true });
    return (data ?? []).map((r) => ({
      schaal: Number(r.schaal),
      trede: Number(r.trede),
      bruto_maand: r.bruto_maand == null ? null : Number(r.bruto_maand),
    }));
  } catch {
    return [];
  }
}
