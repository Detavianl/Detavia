"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-context";
import { isDemo } from "@/lib/demo";
import { logAudit } from "@/lib/audit";
import { createInvoiceForWonDeal } from "@/lib/invoice-create";
import { DEAL_EVENT, type DealStage } from "@/lib/crm";

const s = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const n = (fd: FormData, k: string) => { const v = s(fd, k); return v === "" ? null : Number(v); };

export async function moveDeal(id: string, stage: DealStage) {
  const admin = await requireAdmin();
  if (isDemo()) return;
  const supabase = await createClient();
  const { data, error } = await supabase.from("deals").update({ stage }).eq("id", id).select("company_id, titel").single();
  if (error) throw new Error(error.message);
  const event = DEAL_EVENT[stage] ?? stage;
  await logAudit(admin, "deal", id, "fase gewijzigd", event);
  // herkent automatisch de klant-gebeurtenis en plaatst die in de wijzigingslog van het bedrijf
  if (data?.company_id) await logAudit(admin, "company", data.company_id, event, data.titel ?? "");

  // Bij gewonnen: automatisch een conceptfactuur aanmaken
  if (stage === "gewonnen") {
    await createInvoiceForWonDeal(supabase, id);
    if (data?.company_id) await logAudit(admin, "company", data.company_id, "Factuur aangemaakt", data.titel ?? "");
    revalidatePath("/admin/facturen");
  }
  revalidatePath("/admin/crm/deals");
}

// Nodigt een contactpersoon uit voor het opdrachtgever-portaal (urengoedkeuring).
export async function inviteClient(contactId: string) {
  const admin = await requireAdmin();
  if (isDemo()) return;
  const supabase = await createClient();
  const { data: ct } = await supabase.from("contacts").select("email, naam, company_id").eq("id", contactId).single();
  if (!ct?.email) throw new Error("Contact heeft geen e-mailadres.");

  const { createAdminClient } = await import("@/lib/supabase/admin");
  const sb = createAdminClient();
  const { data, error } = await sb.auth.admin.inviteUserByEmail(ct.email);
  let userId = data?.user?.id;
  if (error || !userId) {
    const { data: list } = await sb.auth.admin.listUsers();
    userId = list?.users.find((u) => u.email?.toLowerCase() === ct.email.toLowerCase())?.id;
    if (!userId) throw new Error("Kon de opdrachtgever niet uitnodigen.");
  }
  await sb.from("contacts").update({ portaal_user_id: userId }).eq("id", contactId);
  if (ct.company_id) await logAudit(admin, "company", ct.company_id, "Opdrachtgever uitgenodigd", ct.naam ?? ct.email);
  revalidatePath(`/admin/crm/bedrijven/${ct.company_id}`);
}

export async function updateCompanyFollowup(id: string, eigenaar: string, actie: string, datum: string) {
  const admin = await requireAdmin();
  if (isDemo()) return;
  const supabase = await createClient();
  await supabase.from("companies").update({
    eigenaar: eigenaar || null,
    volgende_actie: actie || null,
    volgende_actie_datum: datum || null,
  }).eq("id", id);
  await logAudit(admin, "company", id, "gewijzigd", "opvolging");
  revalidatePath(`/admin/crm/bedrijven/${id}`);
}

export async function createCompany(formData: FormData) {
  const admin = await requireAdmin();
  if (isDemo()) redirect("/admin/crm/bedrijven");
  const supabase = await createClient();
  const { data, error } = await supabase.from("companies").insert({
    naam: s(formData, "naam"), type: s(formData, "type") || "gemeente",
    plaats: s(formData, "plaats"), website: s(formData, "website"),
    branche: s(formData, "branche"), status: s(formData, "status") || "prospect",
    notitie: s(formData, "notitie"),
  }).select("id").single();
  if (error) throw new Error(error.message);
  await logAudit(admin, "company", data.id, "aangemaakt", s(formData, "naam"));
  revalidatePath("/admin/crm/bedrijven");
  redirect("/admin/crm/bedrijven");
}

export async function createContact(formData: FormData) {
  const admin = await requireAdmin();
  if (isDemo()) redirect("/admin/crm/contacten");
  const supabase = await createClient();
  const { data, error } = await supabase.from("contacts").insert({
    company_id: s(formData, "company_id") || null, naam: s(formData, "naam"),
    functie: s(formData, "functie"), email: s(formData, "email"),
    telefoon: s(formData, "telefoon"), linkedin: s(formData, "linkedin"),
  }).select("id").single();
  if (error) throw new Error(error.message);
  await logAudit(admin, "contact", data.id, "aangemaakt", s(formData, "naam"));
  revalidatePath("/admin/crm/contacten");
  redirect("/admin/crm/contacten");
}

export async function createDeal(formData: FormData) {
  const admin = await requireAdmin();
  if (isDemo()) redirect("/admin/crm/deals");
  const supabase = await createClient();
  const { data, error } = await supabase.from("deals").insert({
    titel: s(formData, "titel"), company_id: s(formData, "company_id") || null,
    vakgebied: s(formData, "vakgebied") || null, waarde: n(formData, "waarde"),
    stage: s(formData, "stage") || "lead", kans: n(formData, "kans") ?? 20,
    verwachte_sluiting: s(formData, "verwachte_sluiting") || null, notitie: s(formData, "notitie"),
  }).select("id").single();
  if (error) throw new Error(error.message);
  await logAudit(admin, "deal", data.id, "aangemaakt", s(formData, "titel"));
  revalidatePath("/admin/crm/deals");
  redirect("/admin/crm/deals");
}

