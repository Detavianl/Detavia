"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-context";
import { isDemo } from "@/lib/demo";

export async function createCandidate(formData: FormData) {
  const admin = await requireAdmin();
  if (isDemo()) redirect("/admin/kandidaten"); // demo: niet opgeslagen
  const supabase = await createClient();
  const naam = String(formData.get("naam") ?? "").trim();
  if (!naam) throw new Error("Naam is verplicht");
  const numOrNull = (k: string) => {
    const v = str(formData, k);
    return v === "" ? null : Number(v);
  };
  const expertise = str(formData, "expertise").split(",").map((s) => s.trim()).filter(Boolean);

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
    status: str(formData, "status") || "actief",
    niveau: str(formData, "niveau") || null,
    huidige_functie: str(formData, "huidige_functie"),
    huidige_werkgever: str(formData, "huidige_werkgever"),
    beschikbaar_per: str(formData, "beschikbaar_per") || null,
    uren_beschikbaar: numOrNull("uren_beschikbaar"),
    tarief_min: numOrNull("tarief_min"),
    tarief_max: numOrNull("tarief_max"),
    opleidingsniveau: str(formData, "opleidingsniveau"),
    regio: str(formData, "regio"),
    talen: str(formData, "talen"),
    rijbewijs: formData.get("rijbewijs") === "on",
    expertise,
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
  if (isDemo()) return;
  const supabase = await createClient();
  const { error } = await supabase.from("candidates").update({ notitie }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/kandidaten/${id}`);
}

export async function addActivity(candidateId: string, type: string, inhoud: string) {
  const admin = await requireAdmin();
  if (!inhoud.trim()) return;
  if (isDemo()) return;
  const supabase = await createClient();
  await supabase.from("candidate_activities").insert({ candidate_id: candidateId, type, inhoud, created_by: admin.user_id });
  await supabase.from("candidates").update({ laatste_contact: new Date().toISOString().slice(0, 10) }).eq("id", candidateId);
  revalidatePath(`/admin/kandidaten/${candidateId}`);
}

/** Tijdelijke (signed) download-URL voor een cv in de privé-bucket. */
export async function cvSignedUrl(storage_path: string): Promise<string | null> {
  await requireAdmin();
  if (isDemo()) return null;
  const supabase = await createClient();
  const { data } = await supabase.storage.from("cvs").createSignedUrl(storage_path, 60 * 10);
  return data?.signedUrl ?? null;
}

function str(fd: FormData, key: string) {
  const v = fd.get(key);
  return v == null ? "" : String(v).trim();
}
