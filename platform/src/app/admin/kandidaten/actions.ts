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
  const naam = naamUitDelen(formData);
  if (!naam) throw new Error("Naam is verplicht");

  const numOrNull = (k: string) => {
    const v = str(formData, k);
    return v === "" ? null : Number(v);
  };
  const expertise = str(formData, "expertise").split(",").map((s) => s.trim()).filter(Boolean);
  const eersteNotitie = str(formData, "notitie").trim();

  // Eigenaar: standaard de aanmaker; alleen een super-admin mag een andere
  // eigenaar (of "niemand") kiezen via het formulier.
  let eigenaar: string | null = admin.user_id;
  if (admin.role === "super_admin") eigenaar = str(formData, "eigenaar") || null;

  // alle velden uit het formulier, één keer
  const fields = {
    naam,
    eigenaar,
    email: str(formData, "email"),
    telefoon: telefoonUitDelen(formData),
    woonplaats: str(formData, "woonplaats"),
    postcode: str(formData, "postcode"),
    huisnummer: str(formData, "huisnummer"),
    straat: str(formData, "straat"),
    vakgebied: str(formData, "vakgebied") || null,
    linkedin: str(formData, "linkedin"),
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
  // eventuele eerste notitie als echte notitie vastleggen (nieuwe notities-systeem)
  if (eersteNotitie) {
    await supabase.from("candidate_activities").insert({ candidate_id: data.id, type: "notitie", inhoud: eersteNotitie, created_by: admin.user_id });
  }
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
  // Alleen een super-admin mag de eigenaar wijzigen; anderen passen enkel de
  // volgende actie/datum aan en laten de eigenaar ongemoeid.
  const upd: Record<string, unknown> = {
    volgende_actie: actie || null,
    volgende_actie_datum: datum || null,
  };
  if (admin.role === "super_admin") upd.eigenaar = eigenaar || null;
  await supabase.from("candidates").update(upd).eq("id", id);
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
    // bewaar als data-URL zodat het bestand ook te openen is in de demo
    const buf = Buffer.from(await file.arrayBuffer());
    const url = `data:${file.type || "application/octet-stream"};base64,${buf.toString("base64")}`;
    addDemoDocument(candidateId, {
      id: "doc-" + Math.random().toString(36).slice(2, 8),
      filename: file.name, soort, uploaded_at: new Date().toISOString().slice(0, 10), url,
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

// Stelt de volledige naam samen uit de losse velden (voornaam, tussenvoegsel,
// achternaam), net als het sollicitatieformulier. Valt terug op een eventueel
// los "naam"-veld voor achterwaartse compatibiliteit.
function naamUitDelen(fd: FormData) {
  const delen = [str(fd, "voornaam"), str(fd, "tussenvoegsel"), str(fd, "achternaam")].filter(Boolean);
  return delen.length ? delen.join(" ") : str(fd, "naam");
}

// Stelt het telefoonnummer samen uit landcode + nummer. Valt terug op een los
// "telefoon"-veld voor achterwaartse compatibiliteit.
function telefoonUitDelen(fd: FormData) {
  const nummer = str(fd, "tel_nummer");
  if (!nummer) return str(fd, "telefoon");
  const code = str(fd, "tel_landcode") || "+31";
  return `${code} ${nummer}`;
}

// Zoekt straat + woonplaats op bij een postcode + huisnummer via de PDOK
// Locatieserver (officiële, gratis BAG-adressenservice van de overheid).
export async function zoekAdres(postcode: string, huisnummer: string): Promise<{ straat: string; woonplaats: string } | null> {
  await requireAdmin();
  const pc = (postcode || "").replace(/\s+/g, "").toUpperCase();
  const hn = (huisnummer || "").trim();
  if (!/^\d{4}[A-Z]{2}$/.test(pc) || !hn) return null;
  try {
    const url = `https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${encodeURIComponent(`${pc} ${hn}`)}&fq=type:adres&rows=1`;
    const r = await fetch(url, { headers: { Accept: "application/json" } });
    if (!r.ok) return null;
    const j = await r.json();
    const doc = j?.response?.docs?.[0];
    if (!doc) return null;
    return { straat: doc.straatnaam ?? "", woonplaats: doc.woonplaatsnaam ?? "" };
  } catch {
    return null;
  }
}

// Bewerk een bestaande kandidaat.
export async function updateCandidate(formData: FormData) {
  const admin = await requireAdmin();
  const id = str(formData, "id");
  const naam = naamUitDelen(formData);
  if (!id || !naam) throw new Error("Naam is verplicht");
  if (isDemo()) redirect(`/admin/kandidaten/${id}`);

  const numOrNull = (k: string) => { const v = str(formData, k); return v === "" ? null : Number(v); };
  const fields = {
    naam,
    email: str(formData, "email"),
    telefoon: telefoonUitDelen(formData),
    woonplaats: str(formData, "woonplaats"),
    postcode: str(formData, "postcode"),
    huisnummer: str(formData, "huisnummer"),
    straat: str(formData, "straat"),
    vakgebied: str(formData, "vakgebied") || null,
    linkedin: str(formData, "linkedin"),
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
    expertise: str(formData, "expertise").split(",").map((s) => s.trim()).filter(Boolean),
  };
  const supabase = await createClient();
  // Eigenaar alleen door een super-admin laten wijzigen; anders ongemoeid laten.
  const upd: Record<string, unknown> = { ...fields };
  if (admin.role === "super_admin") upd.eigenaar = str(formData, "eigenaar") || null;
  const { error } = await supabase.from("candidates").update(upd).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/kandidaten/${id}`);
  revalidatePath("/admin/kandidaten");
  redirect(`/admin/kandidaten/${id}`);
}

// Verwijder een kandidaat (incl. gekoppelde rijen).
export async function deleteCandidate(id: string) {
  await requireAdmin();
  if (isDemo()) redirect("/admin/kandidaten");
  const supabase = await createClient();
  await supabase.from("candidate_activities").delete().eq("candidate_id", id);
  await supabase.from("applications").delete().eq("candidate_id", id);
  await supabase.from("cvs").delete().eq("candidate_id", id);
  const { error } = await supabase.from("candidates").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/kandidaten");
  redirect("/admin/kandidaten");
}
