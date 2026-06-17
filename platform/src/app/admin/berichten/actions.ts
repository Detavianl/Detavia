"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-context";
import { isDemo } from "@/lib/demo";

export async function markGelezen(id: string, gelezen: boolean) {
  await requireAdmin();
  if (isDemo()) return;
  const supabase = await createClient();
  await supabase.from("contact_messages").update({ gelezen }).eq("id", id);
  revalidatePath("/admin/berichten");
}
