"use server";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { isDemo } from "@/lib/demo";

// Publieke instroom loopt via de service-role client (RLS staat publieke writes niet toe).
// We valideren minimaal en houden het simpel; geen jobboard.

export async function submitSollicitatie(formData: FormData) {
  const naam = String(formData.get("naam") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  if (!naam || !email) throw new Error("Naam en e-mail zijn verplicht");
  if (isDemo()) redirect("/bedankt");

  const supabase = createAdminClient();

  const { data: cand, error } = await supabase.from("candidates").insert({
    naam, email,
    telefoon: String(formData.get("telefoon") ?? "").trim(),
    woonplaats: String(formData.get("woonplaats") ?? "").trim(),
    vakgebied: String(formData.get("vakgebied") ?? "") || null,
    notitie: vacatureNotitie(formData),
    bron: "formulier",
  }).select("id").single();
  if (error) throw new Error(error.message);

  // cv-upload (optioneel)
  const cv = formData.get("cv");
  if (cv && cv instanceof File && cv.size > 0) {
    const ext = cv.name.split(".").pop() ?? "pdf";
    const path = `${cand.id}/${Date.now()}.${ext}`;
    const buf = Buffer.from(await cv.arrayBuffer());
    const up = await supabase.storage.from("cvs").upload(path, buf, { contentType: cv.type || "application/octet-stream" });
    if (!up.error) {
      await supabase.from("cvs").insert({ candidate_id: cand.id, storage_path: path, filename: cv.name });
    }
  }

  // ATS-kaart in 'nieuw'
  const vacature_id = String(formData.get("vacature_id") ?? "") || null;
  await supabase.from("applications").insert({ candidate_id: cand.id, vacature_id, stage: "nieuw" });

  // wijzigingslog: levenscyclus-gebeurtenis "Gesolliciteerd"
  await supabase.from("audit_log").insert({
    entity: "candidate", entity_id: cand.id, actie: "Gesolliciteerd",
    details: vacatureNotitie(formData).replace(/^Sollicitatie op: /, ""), user_naam: "Sollicitatieformulier",
  });

  redirect("/bedankt");
}

export async function submitContact(formData: FormData) {
  const naam = String(formData.get("naam") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  if (!naam || !email) throw new Error("Naam en e-mail zijn verplicht");
  if (isDemo()) redirect("/bedankt");
  const organisatie = String(formData.get("organisatie") ?? "").trim();
  const terugbellen = formData.get("terugbellen") ? "[Bel mij terug] " : "";
  const orgPrefix = organisatie ? `[${organisatie}] ` : "";
  const supabase = createAdminClient();
  await supabase.from("contact_messages").insert({
    naam, email,
    telefoon: String(formData.get("telefoon") ?? "").trim(),
    soort: String(formData.get("soort") ?? "professional"),
    bericht: `${terugbellen}${orgPrefix}${String(formData.get("bericht") ?? "").trim()}`,
  });
  redirect("/bedankt");
}

function vacatureNotitie(formData: FormData) {
  const titel = String(formData.get("vacature_titel") ?? "").trim();
  return titel ? `Sollicitatie op: ${titel}` : "";
}
