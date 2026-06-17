"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-context";
import { isDemo } from "@/lib/demo";
import type { DealStage } from "@/lib/crm";

const s = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const n = (fd: FormData, k: string) => { const v = s(fd, k); return v === "" ? null : Number(v); };

export async function moveDeal(id: string, stage: DealStage) {
  await requireAdmin();
  if (isDemo()) return;
  const supabase = await createClient();
  const { error } = await supabase.from("deals").update({ stage }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/crm/deals");
}

export async function createCompany(formData: FormData) {
  await requireAdmin();
  if (isDemo()) redirect("/admin/crm/bedrijven");
  const supabase = await createClient();
  const { error } = await supabase.from("companies").insert({
    naam: s(formData, "naam"), type: s(formData, "type") || "gemeente",
    plaats: s(formData, "plaats"), website: s(formData, "website"),
    branche: s(formData, "branche"), status: s(formData, "status") || "prospect",
    notitie: s(formData, "notitie"),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/crm/bedrijven");
  redirect("/admin/crm/bedrijven");
}

export async function createContact(formData: FormData) {
  await requireAdmin();
  if (isDemo()) redirect("/admin/crm/contacten");
  const supabase = await createClient();
  const { error } = await supabase.from("contacts").insert({
    company_id: s(formData, "company_id") || null, naam: s(formData, "naam"),
    functie: s(formData, "functie"), email: s(formData, "email"),
    telefoon: s(formData, "telefoon"), linkedin: s(formData, "linkedin"),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/crm/contacten");
  redirect("/admin/crm/contacten");
}

export async function createDeal(formData: FormData) {
  await requireAdmin();
  if (isDemo()) redirect("/admin/crm/deals");
  const supabase = await createClient();
  const { error } = await supabase.from("deals").insert({
    titel: s(formData, "titel"), company_id: s(formData, "company_id") || null,
    vakgebied: s(formData, "vakgebied") || null, waarde: n(formData, "waarde"),
    stage: s(formData, "stage") || "lead", kans: n(formData, "kans") ?? 20,
    verwachte_sluiting: s(formData, "verwachte_sluiting") || null, notitie: s(formData, "notitie"),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/crm/deals");
  redirect("/admin/crm/deals");
}
