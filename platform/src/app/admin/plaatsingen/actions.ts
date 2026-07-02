"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-context";
import { isDemo } from "@/lib/demo";

const s = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const n = (fd: FormData, k: string) => { const v = s(fd, k); return v === "" ? 0 : Number(v); };

// Een bestaande plaatsing wijzigen.
export async function updatePlacement(formData: FormData) {
  const admin = await requireAdmin();
  const id = s(formData, "id");
  if (!id) throw new Error("Ontbrekende id");
  if (isDemo()) redirect(`/admin/plaatsingen/${id}`);
  const supabase = await createClient();

  const { data: cur } = await supabase.from("placements").select("recruiter_id, candidate:candidates(eigenaar)").eq("id", id).single();
  const curRec = cur?.recruiter_id ?? (cur?.candidate as { eigenaar?: string } | null)?.eigenaar ?? null;
  // Recruiters mogen alleen hun eigen plaatsing wijzigen.
  if ((admin.role === "recruiter" || admin.role === "jr_recruiter") && curRec !== admin.user_id) redirect("/geen-toegang");

  const numOrNull = (k: string) => (s(formData, k) === "" ? null : Number(s(formData, k)));
  const upd: Record<string, unknown> = {
    functie: s(formData, "functie"),
    company_id: s(formData, "company_id") || null,
    start_datum: s(formData, "start_datum") || null,
    eind_datum: s(formData, "eind_datum") || null,
    uren_per_week: numOrNull("uren_per_week"),
  };
  // Tarieven (marge) niet voor jr. recruiter.
  if (admin.role !== "jr_recruiter") { upd.uurtarief = numOrNull("uurtarief"); upd.kostprijs = numOrNull("kostprijs"); }
  // Recruiter alleen door super-admin te wijzigen.
  if (admin.role === "super_admin") upd.recruiter_id = s(formData, "recruiter_id") || null;

  const { error } = await supabase.from("placements").update(upd).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/plaatsingen/${id}`);
  revalidatePath("/admin/plaatsingen");
  redirect(`/admin/plaatsingen/${id}`);
}

export async function createPlacement(formData: FormData) {
  const admin = await requireAdmin();
  if (isDemo()) redirect("/admin/plaatsingen");
  const supabase = await createClient();
  const candidateId = s(formData, "candidate_id");

  // Recruiter = de aanmaker; alleen een super-admin mag een andere kiezen.
  let recruiterId: string | null = admin.user_id;
  if (admin.role === "super_admin") recruiterId = s(formData, "recruiter_id") || null;

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
