import { createClient } from "@/lib/supabase/server";
import { DEFAULT_CONFIG, type MargeConfig } from "@/lib/marge-calc";

export { berekenMarge, euro2, DEFAULT_CONFIG } from "@/lib/marge-calc";
export type { MargeConfig } from "@/lib/marge-calc";

// Bedrijfsbrede marge-instellingen (serverside ophalen).
export async function loadMargeConfig(): Promise<MargeConfig> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("marge_config").select("*").eq("id", 1).single();
    if (!data) return DEFAULT_CONFIG;
    return {
      ziekteverzuim_pct: Number(data.ziekteverzuim_pct),
      administratie_pct: Number(data.administratie_pct),
      juridisch_pct: Number(data.juridisch_pct),
      verzekeringen_pct: Number(data.verzekeringen_pct),
      nettowinst_pct: Number(data.nettowinst_pct),
    };
  } catch {
    return DEFAULT_CONFIG;
  }
}
