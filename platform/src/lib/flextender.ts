import { createClient } from "@/lib/supabase/server";

// Officiële Flextender-API (gratis, geen key). Bevat alle open inhuuropdrachten.
const API_URL = "https://api.flextender.nl/v1/getjobs";
const VAKGEBIED = "Sociaal domein"; // alleen dit vakgebied tonen

export type Opdracht = {
  avnummer: number;
  opdracht: string;
  omschrijving: string; // HTML (bij weergave sanitizen)
  opdrachtgever: string | null;
  opleiding: string | null;
  regio: string | null;
  sluiting_inschrijving: string | null;
  urenperweek: string | null;
  aanvang: string | null;
  duur: string | null;
  aantal_professionals: string | null;
  verlengingsoptie: string | null;
  kvk: string | null;
  vakgebieden: string[] | null;
};

type RawJob = {
  avnummer: number; opdracht?: string; omschrijving?: string; opdrachtgever?: string; opleiding?: string;
  regio?: string; sluiting_inschrijving?: string; urenperweek?: string | number; aanvang?: string;
  duur?: string; aantal_professionals?: string | number; verlengingsoptie?: string; kvk?: string | number;
  vakgebieden?: string[];
};

// Haalt de opdrachten uit de Flextender-API, gefilterd op sociaal domein en op
// nog-niet-gesloten inschrijvingen. Vorm sluit aan op de databasetabel.
export async function fetchFlextenderRows(): Promise<Opdracht[]> {
  const res = await fetch(API_URL, { headers: { Accept: "application/json" }, cache: "no-store", signal: AbortSignal.timeout(25000) });
  if (!res.ok) throw new Error(`Flextender API ${res.status}`);
  const json = (await res.json()) as { resultaat?: RawJob[] };
  const jobs = json.resultaat ?? [];
  const nu = Date.now();
  const s = (v: unknown) => (v == null ? null : String(v).trim() || null);
  return jobs
    .filter((j) => Array.isArray(j.vakgebieden) && j.vakgebieden.includes(VAKGEBIED))
    .filter((j) => {
      const t = j.sluiting_inschrijving ? Date.parse(j.sluiting_inschrijving) : NaN;
      return Number.isNaN(t) || t >= nu; // verlopen inschrijvingen weglaten
    })
    .map((j) => ({
      avnummer: j.avnummer,
      opdracht: (j.opdracht ?? "").trim(),
      omschrijving: j.omschrijving ?? "",
      opdrachtgever: s(j.opdrachtgever),
      opleiding: s(j.opleiding),
      regio: s(j.regio),
      sluiting_inschrijving: s(j.sluiting_inschrijving),
      urenperweek: s(j.urenperweek),
      aanvang: s(j.aanvang),
      duur: s(j.duur),
      aantal_professionals: s(j.aantal_professionals),
      verlengingsoptie: s(j.verlengingsoptie),
      kvk: s(j.kvk),
      vakgebieden: j.vakgebieden ?? null,
    }));
}

// Alle actuele opdrachten uit de database (voor de publieke pagina's).
export async function loadOpdrachten(): Promise<Opdracht[]> {
  try {
    const supabase = await createClient();
    const nu = new Date().toISOString();
    const { data } = await supabase
      .from("flextender_opdrachten")
      .select("*")
      .or(`sluiting_inschrijving.is.null,sluiting_inschrijving.gte.${nu}`)
      .order("sluiting_inschrijving", { ascending: true });
    return (data ?? []) as Opdracht[];
  } catch {
    return [];
  }
}

export async function loadOpdracht(avnummer: string | number): Promise<Opdracht | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("flextender_opdrachten").select("*").eq("avnummer", Number(avnummer)).single();
    return (data as Opdracht) ?? null;
  } catch {
    return null;
  }
}

// Kort label voor de sluitingsdatum (bijv. "13 jul 2026").
export function sluitingLabel(iso: string | null): string {
  if (!iso) return "In overleg";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "In overleg";
  return d.toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" });
}
