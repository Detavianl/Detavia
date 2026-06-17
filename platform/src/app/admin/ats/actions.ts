"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-context";
import { isDemo } from "@/lib/demo";
import type { StageKey } from "@/lib/ats";

export async function moveApplication(id: string, stage: StageKey) {
  await requireAdmin();
  if (isDemo()) return; // demo: verplaatsing blijft alleen in beeld, niet opgeslagen
  const supabase = await createClient();
  const { error } = await supabase.from("applications").update({ stage }).eq("id", id);
  if (error) throw new Error(error.message);
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
