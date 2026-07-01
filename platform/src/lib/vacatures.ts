import { createClient } from "@/lib/supabase/server";
import { isDemo } from "@/lib/demo";
import { DEMO_VACATURES, type Vacature } from "@/lib/vacatures-demo";
import { loadOpdrachtenAlsVacatures } from "@/lib/flextender";

type Row = {
  id: string; titel: string; slug: string | null; vakgebied: string; plaats: string;
  uren_min: number; uren_max: number; salaris_min: number | string | null; salaris_max: number | string | null;
  type: string; top: boolean; created_at: string | null; omschrijving: string;
  taken?: string; eisen?: string[]; opdrachtgever?: string; startdatum?: string; duur?: string;
  salaris_periode?: string; inactief_op?: string | null;
};

const num = (v: number | string | null) => (v == null ? 0 : Number(v));

export function mapVacatureRow(v: Row): Vacature {
  return {
    id: v.id,
    slug: v.slug || v.id,
    titel: v.titel,
    vakgebied: v.vakgebied,
    plaats: v.plaats,
    uren: [v.uren_min, v.uren_max],
    salaris: [num(v.salaris_min), num(v.salaris_max)],
    salaris_periode: v.salaris_periode || "maand",
    type: v.type,
    top: v.top,
    datum: (v.created_at ?? "").slice(0, 10),
    omschrijving: v.omschrijving,
    taken: v.taken || undefined,
    eisen: v.eisen && v.eisen.length ? v.eisen : undefined,
    opdrachtgever: v.opdrachtgever || undefined,
    startdatum: v.startdatum || undefined,
    duur: v.duur || undefined,
    inactief_op: v.inactief_op ?? null,
  };
}

// Open vacatures. In demo-modus de voorbeelden, anders uitsluitend de database.
// Vacatures met een verstreken inactief-datum worden automatisch verborgen.
export async function loadVacatures(): Promise<Vacature[]> {
  if (isDemo()) return DEMO_VACATURES;
  try {
    const supabase = await createClient();
    const vandaag = new Date().toISOString().slice(0, 10);
    const { data } = await supabase
      .from("vacatures")
      .select("*")
      .eq("status", "open")
      .or(`inactief_op.is.null,inactief_op.gte.${vandaag}`)
      .order("created_at", { ascending: false });
    const eigen = (data ?? []).map(mapVacatureRow);
    // Flextender-inhuuropdrachten (sociaal domein) meenemen als vacatures.
    let flex: Vacature[] = [];
    try { flex = await loadOpdrachtenAlsVacatures(); } catch { flex = []; }
    return [...eigen, ...flex];
  } catch {
    return [];
  }
}
