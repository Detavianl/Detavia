"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-context";

export async function markGelezen(id: string, gelezen: boolean) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("contact_messages").update({ gelezen }).eq("id", id);
  revalidatePath("/admin/berichten");
}
