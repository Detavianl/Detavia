"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-context";
import { isDemo } from "@/lib/demo";

const s = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const n = (fd: FormData, k: string) => { const v = s(fd, k); return v === "" ? 0 : Number(v); };

export async function createPlacement(formData: FormData) {
  await requireAdmin();
  if (isDemo()) redirect("/admin/plaatsingen");
  const supabase = await createClient();
  const candidateId = s(formData, "candidate_id");

  // Recruiter: expliciet gekozen veld, anders de eigenaar van de kandidaat.
  let recruiterId = s(formData, "recruiter_id") || null;
  if (!recruiterId && candidateId) {
    const { data: cand } = await supabase.from("candidates").select("eigenaar").eq("id", candidateId).single();
    recruiterId = cand?.eigenaar ?? null;
  }

  const numOrNull = (k: string) => (s(formData, k) === "" ? null : Number(s(formData, k)));
  const { error } = await supabase.from("placements").insert({
    candidate_id: candidateId,
    company_id: s(formData, "company_id") || null,
    functie: s(formData, "functie"),
    uurtarief: n(formData, "uurtarief"),
    kostprijs: n(formData, "kostprijs"),
    recruiter_id: recruiterId,
    start_datum: s(formData, "start_datum") || null,
    eind_datum: s(formData, "eind_datum") || null,
    uren_per_week: numOrNull("uren_per_week"),
    trede: numOrNull("trede"),
    trede_maandsalaris: numOrNull("trede_maandsalaris"),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/plaatsingen");
  redirect("/admin/plaatsingen");
}
