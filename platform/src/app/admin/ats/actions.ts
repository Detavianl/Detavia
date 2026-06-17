"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-context";
import type { StageKey } from "@/lib/ats";

export async function moveApplication(id: string, stage: StageKey) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("applications").update({ stage }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/ats");
}

export async function setApplicationNote(id: string, notitie: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("applications").update({ notitie }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/ats");
}
