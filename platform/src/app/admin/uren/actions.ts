"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-context";
import { isDemo } from "@/lib/demo";

export async function approveHours(id: string) {
  const admin = await requireAdmin();
  if (isDemo()) return;
  const supabase = await createClient();
  await supabase.from("hours").update({ status: "goedgekeurd", goedgekeurd_door: admin.user_id, goedgekeurd_at: new Date().toISOString() }).eq("id", id);
  revalidatePath("/admin/uren");
}

export async function rejectHours(id: string) {
  await requireAdmin();
  if (isDemo()) return;
  const supabase = await createClient();
  await supabase.from("hours").update({ status: "afgekeurd" }).eq("id", id);
  revalidatePath("/admin/uren");
}
