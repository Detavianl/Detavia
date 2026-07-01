"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/admin-context";
import { isDemo } from "@/lib/demo";

export type TredeRij = {
  trede: number;
  maandsalaris: number | null;
  vakantiegeld: number | null;
  eindejaarsuitkering: number | null;
  totaal_bruto: number | null;
  werkgeverslasten: number | null;
  totale_kosten: number | null;
  inkooptarief_uur: number | null;
};

// Vervangt de volledige salaristredes-tabel. Alleen super-admins.
export async function saveTredes(rijen: TredeRij[]) {
  await requireRole("super_admin");
  if (isDemo()) return;
  const supabase = await createClient();

  // Ontdubbel op trede en houd alleen geldige tredes.
  const uniek = new Map<number, TredeRij>();
  for (const r of rijen) {
    const trede = Number(r.trede);
    if (!Number.isFinite(trede)) continue;
    const g = (v: number | null) => (v == null || !Number.isFinite(Number(v)) ? null : Number(v));
    uniek.set(trede, {
      trede,
      maandsalaris: g(r.maandsalaris),
      vakantiegeld: g(r.vakantiegeld),
      eindejaarsuitkering: g(r.eindejaarsuitkering),
      totaal_bruto: g(r.totaal_bruto),
      werkgeverslasten: g(r.werkgeverslasten),
      totale_kosten: g(r.totale_kosten),
      inkooptarief_uur: g(r.inkooptarief_uur),
    });
  }

  const del = await supabase.from("salaristredes").delete().not("trede", "is", null);
  if (del.error) throw new Error(del.error.message);

  const rows = [...uniek.values()];
  if (rows.length) {
    const ins = await supabase.from("salaristredes").insert(rows.map((r) => ({ ...r, updated_at: new Date().toISOString() })));
    if (ins.error) throw new Error(ins.error.message);
  }
  revalidatePath("/admin/instellingen/schalen");
  revalidatePath("/admin/plaatsingen/nieuw");
  revalidatePath("/admin/ats");
}
