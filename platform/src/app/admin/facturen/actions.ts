"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-context";
import { isDemo } from "@/lib/demo";
import { logAudit } from "@/lib/audit";

/**
 * Verstuurt de factuur. Nu een stub: zet de status op 'verzonden'.
 * HIER komt later Resend:
 *   1. const pdf = await buildInvoicePdf(inv)
 *   2. resend.emails.send({ to: inv.bedrijf_email, attachments: [{ filename, content: pdf }], ... })
 * Zodra de RESEND_API_KEY in de env staat, kan dit één blok worden.
 */
export async function sendInvoice(id: string) {
  const admin = await requireAdmin();
  if (isDemo()) return;
  const supabase = await createClient();
  const { data: inv } = await supabase.from("invoices").select("nummer, bedrijf_naam").eq("id", id).single();
  await supabase.from("invoices").update({ status: "verzonden", verzonden_at: new Date().toISOString() }).eq("id", id);
  // TODO Resend: e-mail met PDF-bijlage versturen naar bedrijf_email
  await logAudit(admin, "invoice", id, "verzonden", inv?.nummer ?? "");
  revalidatePath("/admin/facturen");
  revalidatePath(`/admin/facturen/${id}`);
}

export async function markInvoicePaid(id: string) {
  const admin = await requireAdmin();
  if (isDemo()) return;
  const supabase = await createClient();
  const { data: inv } = await supabase.from("invoices").select("nummer").eq("id", id).single();
  await supabase.from("invoices").update({ status: "betaald" }).eq("id", id);
  await logAudit(admin, "invoice", id, "betaald", inv?.nummer ?? "");
  revalidatePath("/admin/facturen");
  revalidatePath(`/admin/facturen/${id}`);
}
