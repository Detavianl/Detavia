"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-context";

export async function createCandidate(formData: FormData) {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const naam = String(formData.get("naam") ?? "").trim();
  if (!naam) throw new Error("Naam is verplicht");
  const { data, error } = await supabase.from("candidates").insert({
    naam,
    email: str(formData, "email"),
    telefoon: str(formData, "telefoon"),
    woonplaats: str(formData, "woonplaats"),
    vakgebied: str(formData, "vakgebied") || null,
    linkedin: str(formData, "linkedin"),
    notitie: str(formData, "notitie") ?? "",
    bron: "handmatig",
    created_by: admin.user_id,
  }).select("id").single();
  if (error) throw new Error(error.message);

  // direct een ATS-kaart aanmaken in 'nieuw'
  await supabase.from("applications").insert({ candidate_id: data.id, stage: "nieuw" });
  revalidatePath("/admin/kandidaten");
  revalidatePath("/admin/ats");
  redirect(`/admin/kandidaten/${data.id}`);
}

export async function updateCandidateNote(id: string, notitie: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("candidates").update({ notitie }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/kandidaten/${id}`);
}

/** Tijdelijke (signed) download-URL voor een cv in de privé-bucket. */
export async function cvSignedUrl(storage_path: string): Promise<string | null> {
  await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase.storage.from("cvs").createSignedUrl(storage_path, 60 * 10);
  return data?.signedUrl ?? null;
}

function str(fd: FormData, key: string) {
  const v = fd.get(key);
  return v == null ? "" : String(v).trim();
}
