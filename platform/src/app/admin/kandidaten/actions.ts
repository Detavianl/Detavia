"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-context";
import { isDemo } from "@/lib/demo";
import { addDemoCandidate, addDemoDocument } from "@/lib/demo-store";
import { logAudit } from "@/lib/audit";

export async function createCandidate(formData: FormData) {
  const admin = await requireAdmin();
  const naam = String(formData.get("naam") ?? "").trim();
  if (!naam) throw new Error("Naam is verplicht");

  const numOrNull = (k: string) => {
    const v = str(formData, k);
    return v === "" ? null : Number(v);
  };
  const expertise = str(formData, "expertise").split(",").map((s) => s.trim()).filter(Boolean);

  // alle velden uit het formulier, één keer
  const fields = {
    naam,
    email: str(formData, "email"),
    telefoon: str(formData, "telefoon"),
    woonplaats: str(formData, "woonplaats"),
    vakgebied: str(formData, "vakgebied") || null,
    linkedin: str(formData, "linkedin"),
    notitie: str(formData, "notitie") ?? "",
    bron: "handmatig",
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
  };

  // DEMO: bewaar in het geheugen zodat alles terugkomt in talentpool/detail/ATS
  if (isDemo()) {
    const id = "new-" + Math.random().toString(36).slice(2, 9);
    addDemoCandidate({ id, ...fields, rating: 0, laatste_contact: null, created_at: today() });
    redirect(`/admin/kandidaten/${id}`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from("candidates")
    .insert({ ...fields, created_by: admin.user_id })
    .select("id").single();
  if (error) throw new Error(error.message);
  await logAudit(admin, "candidate", data.id, "Toegevoegd aan talentpool", naam);

  // direct een ATS-kaart aanmaken in 'nieuw'
  await supabase.from("applications").insert({ candidate_id: data.id, stage: "nieuw" });
  revalidatePath("/admin/kandidaten");
  revalidatePath("/admin/ats");
  redirect(`/admin/kandidaten/${data.id}`);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

export async function updateCandidateNote(id: string, notitie: string) {
  const admin = await requireAdmin();
  if (isDemo()) return;
  const supabase = await createClient();
  const { error } = await supabase.from("candidates").update({ notitie }).eq("id", id);
  if (error) throw new Error(error.message);
  await logAudit(admin, "candidate", id, "gewijzigd", "notitie");
  revalidatePath(`/admin/kandidaten/${id}`);
}

export async function updateFollowup(id: string, eigenaar: string, actie: string, datum: string) {
  const admin = await requireAdmin();
  if (isDemo()) return;
  const supabase = await createClient();
  await supabase.from("candidates").update({
    eigenaar: eigenaar || null,
    volgende_actie: actie || null,
    volgende_actie_datum: datum || null,
  }).eq("id", id);
  await logAudit(admin, "candidate", id, "gewijzigd", "opvolging");
  revalidatePath(`/admin/kandidaten/${id}`);
  revalidatePath("/admin/kandidaten");
}

/** Voegt een document (cv en meer) toe aan een kandidaat. */
export async function uploadDocument(candidateId: string, formData: FormData) {
  const admin = await requireAdmin();
  const soort = String(formData.get("soort") ?? "cv");
  const file = formData.get("bestand");
  if (!(file instanceof File) || file.size === 0) return;

  if (isDemo()) {
    addDemoDocument(candidateId, {
      id: "doc-" + Math.random().toString(36).slice(2, 8),
      filename: file.name, soort, uploaded_at: new Date().toISOString().slice(0, 10),
    });
    revalidatePath(`/admin/kandidaten/${candidateId}`);
    return;
  }

  const supabase = await createClient();
  const ext = file.name.split(".").pop() ?? "pdf";
  const path = `${candidateId}/${Date.now()}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());
  const up = await supabase.storage.from("cvs").upload(path, buf, { contentType: file.type || "application/octet-stream" });
  if (up.error) throw new Error(up.error.message);
  await supabase.from("cvs").insert({ candidate_id: candidateId, storage_path: path, filename: file.name, soort });
  await logAudit(admin, "candidate", candidateId, "Document toegevoegd", file.name);
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
