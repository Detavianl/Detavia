"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin-context";
import { isDemo } from "@/lib/demo";
import { createInvoiceFromHours } from "@/lib/invoice-create";
import { logAudit } from "@/lib/audit";

// Factuur opbouwen uit goedgekeurde, nog niet-gefactureerde uren van een plaatsing.
export async function factureerUren(placementId: string) {
  const admin = await requireAdmin();
  if (isDemo()) redirect("/admin/facturen");
  const supabase = await createClient();
  const uren = await createInvoiceFromHours(supabase, placementId);
  if (uren > 0) await logAudit(admin, "placement", placementId, "gefactureerd", `${uren} uur`);
  revalidatePath("/admin/facturen");
  revalidatePath(`/admin/plaatsingen/${placementId}`);
  redirect("/admin/facturen");
}

// Professional uitnodigen voor het urenportaal: maakt een login en koppelt die aan de kandidaat.
export async function inviteProfessional(candidateId: string) {
  const admin = await requireAdmin();
  if (isDemo()) return;
  const supabase = await createClient();
  const { data: cand } = await supabase.from("candidates").select("email, naam").eq("id", candidateId).single();
  if (!cand?.email) throw new Error("Kandidaat heeft geen e-mailadres.");

  const sb = createAdminClient();
  const { data, error } = await sb.auth.admin.inviteUserByEmail(cand.email);
  let userId = data?.user?.id;
  if (error || !userId) {
    const { data: list } = await sb.auth.admin.listUsers();
    userId = list?.users.find((u) => u.email?.toLowerCase() === cand.email.toLowerCase())?.id;
    if (!userId) throw new Error("Kon de professional niet uitnodigen.");
  }
  await sb.from("candidates").update({ professional_user_id: userId }).eq("id", candidateId);
  await logAudit(admin, "candidate", candidateId, "Uitgenodigd voor urenportaal", cand.email);
  revalidatePath(`/admin/plaatsingen/${candidateId}`);
}

const s = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const n = (fd: FormData, k: string) => { const v = s(fd, k); return v === "" ? 0 : Number(v); };

export async function createPlacement(formData: FormData) {
  await requireAdmin();
  if (isDemo()) redirect("/admin/plaatsingen");
  const supabase = await createClient();
  const { error } = await supabase.from("placements").insert({
    candidate_id: s(formData, "candidate_id"),
    company_id: s(formData, "company_id") || null,
    functie: s(formData, "functie"),
    uurtarief: n(formData, "uurtarief"),
    kostprijs: n(formData, "kostprijs"),
    start_datum: s(formData, "start_datum") || null,
    eind_datum: s(formData, "eind_datum") || null,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/plaatsingen");
  redirect("/admin/plaatsingen");
}
