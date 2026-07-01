"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/admin-context";
import { isDemo } from "@/lib/demo";

export type SchaalRij = { schaal: number; trede: number; bruto_maand: number | null };

// Vervangt de volledige schalen-matrix. Alleen super-admins.
export async function saveSchalen(rijen: SchaalRij[]) {
  await requireRole("super_admin");
  if (isDemo()) return;
  const supabase = await createClient();

  // Ontdubbel op (schaal, trede) en houd alleen geldige combinaties.
  const uniek = new Map<string, SchaalRij>();
  for (const r of rijen) {
    const schaal = Number(r.schaal), trede = Number(r.trede);
    if (!Number.isFinite(schaal) || !Number.isFinite(trede) || schaal <= 0 || trede <= 0) continue;
    const bruto = r.bruto_maand == null || r.bruto_maand === ("" as unknown) ? null : Number(r.bruto_maand);
    uniek.set(`${schaal}-${trede}`, { schaal, trede, bruto_maand: Number.isFinite(bruto as number) ? bruto : null });
  }

  // Alles vervangen: eerst leegmaken, dan opnieuw invoeren.
  const del = await supabase.from("salarisschalen").delete().not("id", "is", null);
  if (del.error) throw new Error(del.error.message);

  const rows = [...uniek.values()];
  if (rows.length) {
    const ins = await supabase.from("salarisschalen").insert(rows.map((r) => ({ ...r, updated_at: new Date().toISOString() })));
    if (ins.error) throw new Error(ins.error.message);
  }
  revalidatePath("/admin/instellingen/schalen");
  revalidatePath("/admin/plaatsingen/nieuw");
  revalidatePath("/admin/ats");
}
