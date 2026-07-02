"use server";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { isDemo } from "@/lib/demo";
import { sendMail } from "@/lib/email";
import { renderTemplate } from "@/lib/mail-templates";

// Publieke instroom loopt via de service-role client (RLS staat publieke writes niet toe).
// We valideren minimaal en houden het simpel; geen jobboard.

export async function submitSollicitatie(formData: FormData) {
  const g = (k: string) => String(formData.get(k) ?? "").trim();
  const naam = [g("voornaam"), g("tussenvoegsel"), g("achternaam")].filter(Boolean).join(" ").trim() || g("naam");
  const email = g("email");
  if (!naam || !email) throw new Error("Naam en e-mail zijn verplicht");
  const cvBestand = formData.get("cv");
  if (!(cvBestand instanceof File) || cvBestand.size === 0) throw new Error("Cv is verplicht");
  if (isDemo()) redirect("/bedankt");

  const supabase = createAdminClient();

  // "Hoe heb je ons gevonden?" -> gestructureerd in kolom gevonden_via (voor rapportage).
  // Bij "Anders" bewaren we de vrije toelichting in de notitie.
  const via = g("gevonden_via");
  const andersDetail = via === "Anders" ? g("gevonden_anders") : "";
  const notitie = [vacatureNotitie(formData), andersDetail ? `Gevonden via (anders): ${andersDetail}` : ""].filter(Boolean).join(" · ");

  const { data: cand, error } = await supabase.from("candidates").insert({
    naam, email,
    telefoon: g("telefoon"),
    woonplaats: g("woonplaats"),
    vakgebied: g("vakgebied") || null,
    gevonden_via: via || null,
    notitie,
    bron: "formulier",
  }).select("id").single();
  if (error) throw new Error(error.message);

  // cv-upload (verplicht; hierboven al gevalideerd)
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

  // Vacature ophalen (slug of UUID) voor ATS-koppeling + bevestigingsmail.
  const vacRef = String(formData.get("vacature_id") ?? "").trim();
  let vacature_id: string | null = null;
  let vacatureTitel = g("vacature_titel");
  let recruiterId: string | null = null;
  if (vacRef) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(vacRef);
    const { data: vac } = await supabase.from("vacatures").select("id, titel, recruiter_id").eq(isUuid ? "id" : "slug", vacRef).maybeSingle();
    if (vac) { vacature_id = vac.id; vacatureTitel = vac.titel || vacatureTitel; recruiterId = vac.recruiter_id; }
  }
  await supabase.from("applications").insert({ candidate_id: cand.id, vacature_id, stage: "nieuw" });

  // wijzigingslog: levenscyclus-gebeurtenis "Gesolliciteerd"
  await supabase.from("audit_log").insert({
    entity: "candidate", entity_id: cand.id, actie: "Gesolliciteerd",
    details: vacatureNotitie(formData).replace(/^Sollicitatie op: /, ""), user_naam: "Sollicitatieformulier",
  });

  // Bevestigingsmail naar de sollicitant (mag de sollicitatie niet blokkeren).
  try {
    let recruiterNaam = "Team DetaVia";
    if (recruiterId) {
      const { data: r } = await supabase.from("admin_users").select("naam").eq("user_id", recruiterId).maybeSingle();
      if (r?.naam) recruiterNaam = r.naam;
    }
    const mail = renderTemplate("sollicitatie-bevestiging", {
      voornaam: g("voornaam") || naam.split(" ")[0] || "daar",
      vacature: vacatureTitel || "een functie in het sociaal domein",
      recruiter: recruiterNaam,
    });
    if (mail) await sendMail({ to: email, subject: mail.onderwerp, html: mail.html });
  } catch { /* stil falen: mail is niet kritiek */ }

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
