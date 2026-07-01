"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-context";
import { isDemo } from "@/lib/demo";
import { logAudit } from "@/lib/audit";
import { CAND_EVENT, type StageKey } from "@/lib/ats";

export async function moveApplication(id: string, stage: StageKey) {
  const admin = await requireAdmin();
  if (isDemo()) return; // demo: verplaatsing blijft alleen in beeld, niet opgeslagen
  const supabase = await createClient();
  const { data, error } = await supabase.from("applications").update({ stage }).eq("id", id).select("candidate_id").single();
  if (error) throw new Error(error.message);
  // levenscyclus-gebeurtenis in de wijzigingslog van de kandidaat
  if (data?.candidate_id) await logAudit(admin, "candidate", data.candidate_id, CAND_EVENT[stage] ?? stage);
  revalidatePath("/admin/ats");
}

export type PlaatsVanuitAtsInput = {
  applicationId: string;
  candidate_id: string;
  company_id: string;
  functie: string;
  uurtarief: string;
  kostprijs: string;
  recruiter_id: string;
  start_datum: string;
  eind_datum: string;
  uren_per_week: string;
  trede: string;
  trede_maandsalaris: string;
};

// Maakt in één keer een plaatsing aan én verplaatst de sollicitatie naar
// "Geplaatst". Voorkomt dubbel werk vanuit het ATS-bord (geen redirect).
export async function plaatsVanuitAts(input: PlaatsVanuitAtsInput) {
  const admin = await requireAdmin();
  if (isDemo()) return; // demo: niets opslaan, kaart verplaatst alleen in beeld
  const supabase = await createClient();

  // Recruiter: expliciet gekozen, anders de eigenaar van de kandidaat.
  let recruiterId = input.recruiter_id?.trim() || null;
  if (!recruiterId && input.candidate_id) {
    const { data: cand } = await supabase.from("candidates").select("eigenaar").eq("id", input.candidate_id).single();
    recruiterId = cand?.eigenaar ?? null;
  }
  const num = (v: string) => { const t = (v ?? "").trim(); return t === "" ? 0 : Number(t); };
  const numN = (v: string) => { const t = (v ?? "").trim(); return t === "" ? null : Number(t); };

  const { error: pErr } = await supabase.from("placements").insert({
    candidate_id: input.candidate_id,
    company_id: input.company_id?.trim() || null,
    functie: (input.functie ?? "").trim(),
    uurtarief: num(input.uurtarief),
    kostprijs: num(input.kostprijs),
    recruiter_id: recruiterId,
    start_datum: input.start_datum?.trim() || null,
    eind_datum: input.eind_datum?.trim() || null,
    uren_per_week: numN(input.uren_per_week),
    trede: numN(input.trede),
    trede_maandsalaris: numN(input.trede_maandsalaris),
  });
  if (pErr) throw new Error(pErr.message);

  const { data, error: aErr } = await supabase.from("applications").update({ stage: "geplaatst" }).eq("id", input.applicationId).select("candidate_id").single();
  if (aErr) throw new Error(aErr.message);
  if (data?.candidate_id) await logAudit(admin, "candidate", data.candidate_id, CAND_EVENT["geplaatst"] ?? "geplaatst");

  revalidatePath("/admin/ats");
  revalidatePath("/admin/plaatsingen");
}

export async function setApplicationNote(id: string, notitie: string) {
  await requireAdmin();
  if (isDemo()) return;
  const supabase = await createClient();
  const { error } = await supabase.from("applications").update({ notitie }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/ats");
}
