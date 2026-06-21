import { createClient } from "@/lib/supabase/server";
import { isDemo } from "@/lib/demo";
import { DEMO_VACATURES, type Vacature } from "@/lib/vacatures-demo";

type Row = {
  id: string; titel: string; slug: string | null; vakgebied: string; plaats: string;
  uren_min: number; uren_max: number; salaris_min: number | null; salaris_max: number | null;
  type: string; top: boolean; created_at: string | null; omschrijving: string;
  taken?: string; eisen?: string[]; opdrachtgever?: string; startdatum?: string; duur?: string;
};

export function mapVacatureRow(v: Row): Vacature {
  return {
    id: v.id,
    slug: v.slug || v.id,
    titel: v.titel,
    vakgebied: v.vakgebied,
    plaats: v.plaats,
    uren: [v.uren_min, v.uren_max],
    salaris: [v.salaris_min ?? 0, v.salaris_max ?? 0],
    type: v.type,
    top: v.top,
    datum: (v.created_at ?? "").slice(0, 10),
    omschrijving: v.omschrijving,
    taken: v.taken || undefined,
    eisen: v.eisen && v.eisen.length ? v.eisen : undefined,
    opdrachtgever: v.opdrachtgever || undefined,
    startdatum: v.startdatum || undefined,
    duur: v.duur || undefined,
  };
}

// Open vacatures. In demo-modus de voorbeelden, anders uitsluitend de database.
export async function loadVacatures(): Promise<Vacature[]> {
  if (isDemo()) return DEMO_VACATURES;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("vacatures")
      .select("*")
      .eq("status", "open")
      .order("created_at", { ascending: false });
    return (data ?? []).map(mapVacatureRow);
  } catch {
    return [];
  }
}
