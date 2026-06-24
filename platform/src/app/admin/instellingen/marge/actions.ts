"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/admin-context";
import { isDemo } from "@/lib/demo";

export async function saveMargeConfig(formData: FormData) {
  await requireRole("super_admin");
  if (isDemo()) redirect("/admin/instellingen/marge");
  const num = (k: string) => {
    const v = Number(String(formData.get(k) ?? "").replace(",", "."));
    return Number.isFinite(v) && v >= 0 ? v : 0;
  };
  const supabase = await createClient();
  const { error } = await supabase.from("marge_config").update({
    ziekteverzuim_pct: num("ziekteverzuim_pct"),
    administratie_pct: num("administratie_pct"),
    juridisch_pct: num("juridisch_pct"),
    verzekeringen_pct: num("verzekeringen_pct"),
    nettowinst_pct: num("nettowinst_pct"),
    updated_at: new Date().toISOString(),
  }).eq("id", 1);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/instellingen/marge");
  revalidatePath("/admin/verdiensten");
  redirect("/admin/instellingen/marge?ok=1");
}
