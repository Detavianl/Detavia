"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireClient } from "@/lib/client-context";
import { isDemo } from "@/lib/demo";

export async function approveHoursAsClient(id: string) {
  const c = await requireClient();
  if (isDemo()) return;
  const supabase = await createClient();
  // RLS borgt dat dit alleen uren van het eigen bedrijf zijn
  await supabase.from("hours").update({ status: "goedgekeurd", goedgekeurd_at: new Date().toISOString() }).eq("id", id);
  void c;
  revalidatePath("/opdrachtgever");
}

export async function rejectHoursAsClient(id: string) {
  await requireClient();
  if (isDemo()) return;
  const supabase = await createClient();
  await supabase.from("hours").update({ status: "afgekeurd" }).eq("id", id);
  revalidatePath("/opdrachtgever");
}
