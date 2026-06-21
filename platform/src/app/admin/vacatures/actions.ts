"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-context";
import { slugify } from "@/lib/blog";
import { isDemo } from "@/lib/demo";
import { parseJobsXml } from "@/lib/xml-import";
import sanitizeHtml from "sanitize-html";

const schoonHtml = (html: string) =>
  sanitizeHtml(html, {
    allowedTags: ["p", "br", "strong", "b", "em", "i", "ul", "ol", "li", "h3", "h4"],
    allowedAttributes: {},
  });

export async function saveVacature(formData: FormData) {
  await requireAdmin();
  if (isDemo()) redirect("/admin/vacatures");
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "").trim();
  const titel = String(formData.get("titel") ?? "").trim();
  if (!titel) throw new Error("Titel is verplicht");

  const num = (k: string) => {
    const v = formData.get(k);
    return v === null || v === "" ? null : Number(v);
  };
  // eisen: een regel per eis in de textarea -> array
  const eisen = String(formData.get("eisen") ?? "")
    .split("\n")
    .map((r) => r.trim())
    .filter(Boolean);

  const fields = {
    titel,
    vakgebied: String(formData.get("vakgebied") ?? "wmo"),
    plaats: String(formData.get("plaats") ?? "").trim(),
    uren_min: num("uren_min") ?? 32,
    uren_max: num("uren_max") ?? 36,
    salaris_min: num("salaris_min"),
    salaris_max: num("salaris_max"),
    type: String(formData.get("type") ?? "Detachering"),
    top: formData.get("top") === "on",
    omschrijving: String(formData.get("omschrijving") ?? "").trim(),
    status: String(formData.get("status") ?? "open"),
    company_id: String(formData.get("company_id") ?? "") || null,
    salaris_periode: String(formData.get("salaris_periode") ?? "maand"),
    inactief_op: String(formData.get("inactief_op") ?? "").trim() || null,
    taken: String(formData.get("taken") ?? "").trim(),
    eisen,
    opdrachtgever: String(formData.get("opdrachtgever") ?? "").trim(),
    startdatum: String(formData.get("startdatum") ?? "").trim(),
    duur: String(formData.get("duur") ?? "").trim(),
  };

  if (id) {
    const { error } = await supabase.from("vacatures").update(fields).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const slug = `${slugify(titel)}-${Math.random().toString(36).slice(2, 6)}`;
    const { error } = await supabase.from("vacatures").insert({ ...fields, slug });
    if (error) throw new Error(error.message);
  }
  revalidatePath("/admin/vacatures");
  revalidatePath("/vacatures");
  redirect("/admin/vacatures");
}

export async function deleteVacature(id: string) {
  await requireAdmin();
  if (isDemo()) return;
  const supabase = await createClient();
  const { error } = await supabase.from("vacatures").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/vacatures");
  revalidatePath("/vacatures");
}

// Dupliceer een vacature naar een nieuwe concept-vacature (gesloten).
export async function cloneVacature(id: string) {
  await requireAdmin();
  if (isDemo()) redirect("/admin/vacatures");
  const supabase = await createClient();
  const { data: orig } = await supabase.from("vacatures").select("*").eq("id", id).single();
  if (!orig) throw new Error("Vacature niet gevonden");
  const { id: _id, slug: _slug, created_at: _ca, ...rest } = orig as Record<string, unknown>;
  const titel = `${orig.titel} (kopie)`;
  const slug = `${slugify(titel)}-${Math.random().toString(36).slice(2, 6)}`;
  const { data, error } = await supabase
    .from("vacatures")
    .insert({ ...rest, titel, slug, status: "gesloten", top: false, bron: "", extern_id: "", inactief_op: null })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/admin/vacatures");
  redirect(`/admin/vacatures/${data.id}`);
}

// Zet een vacature direct op inactief (gesloten).
export async function deactivateVacature(id: string) {
  await requireAdmin();
  if (isDemo()) redirect("/admin/vacatures");
  const supabase = await createClient();
  const { error } = await supabase.from("vacatures").update({ status: "gesloten" }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/vacatures");
  revalidatePath("/vacatures");
  redirect("/admin/vacatures");
}

// Importeer vacatures uit een externe XML-feed (Indeed-stijl) of geplakte XML.
export async function importVacaturesFeed(formData: FormData) {
  await requireAdmin();
  if (isDemo()) redirect("/admin/vacatures/import?demo=1");

  const feedUrl = String(formData.get("feed_url") ?? "").trim();
  let xml = String(formData.get("xml") ?? "").trim();
  if (feedUrl) {
    try {
      const res = await fetch(feedUrl, { headers: { "User-Agent": "DetaVia-import/1.0" }, cache: "no-store" });
      xml = await res.text();
    } catch {
      redirect("/admin/vacatures/import?fout=ophalen");
    }
  }
  if (!xml) redirect("/admin/vacatures/import?fout=leeg");

  const alleenSociaal = formData.get("alleen_sociaal") === "on";
  const alle = parseJobsXml(xml);
  const jobs = alleenSociaal ? alle.filter((j) => j.isSociaal) : alle;
  const overgeslagen = alle.length - jobs.length;
  if (jobs.length === 0) redirect(`/admin/vacatures/import?gevonden=${alle.length}&toegevoegd=0&overgeslagen=${overgeslagen}`);

  const supabase = await createClient();
  const rows = jobs.map((j) => ({
    titel: j.titel,
    slug: `${slugify(j.titel)}-${(j.referentie || Math.random().toString(36).slice(2, 7)).toString().replace(/[^a-z0-9]/gi, "").slice(0, 8).toLowerCase()}`,
    vakgebied: j.vakgebied || "wmo",
    plaats: j.plaats,
    uren_min: j.uren_min,
    uren_max: j.uren_max,
    salaris_min: j.salaris_min,
    salaris_max: j.salaris_max,
    type: j.type,
    top: false,
    status: "open",
    omschrijving: j.omschrijving,
    taken: schoonHtml(j.taken),
    eisen: j.eisen,
    opdrachtgever: j.opdrachtgever,
    startdatum: "",
    duur: "",
  }));

  // upsert op slug, dubbele overslaan
  const { data, error } = await supabase
    .from("vacatures")
    .upsert(rows, { onConflict: "slug", ignoreDuplicates: true })
    .select("id");
  if (error) redirect(`/admin/vacatures/import?fout=${encodeURIComponent(error.message)}`);

  revalidatePath("/admin/vacatures");
  revalidatePath("/vacatures");
  redirect(`/admin/vacatures/import?gevonden=${alle.length}&toegevoegd=${data?.length ?? 0}&overgeslagen=${overgeslagen}`);
}
