"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-context";
import { isDemo } from "@/lib/demo";
import { logAudit } from "@/lib/audit";
import type { StageKey } from "@/lib/ats";

export async function moveApplication(id: string, stage: StageKey) {
  const admin = await requireAdmin();
  if (isDemo()) return; // demo: verplaatsing blijft alleen in beeld, niet opgeslagen
  const supabase = await createClient();
  const { data, error } = await supabase.from("applications").update({ stage }).eq("id", id).select("candidate_id").single();
  if (error) throw new Error(error.message);
  if (data?.candidate_id) await logAudit(admin, "candidate", data.candidate_id, "fase gewijzigd", stage);
  revalidatePath("/admin/ats");
}

export async function setApplicationNote(id: string, notitie: string) {
  await requireAdmin();
  if (isDemo()) return;
  const supabase = await createClient();
  const { error } = await supabase.from("applications").update({ notitie }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/ats");
}
