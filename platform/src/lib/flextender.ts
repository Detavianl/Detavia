import { createClient } from "@/lib/supabase/server";
import sanitizeHtml from "sanitize-html";
import { slugify } from "@/lib/blog";
import type { Vacature } from "@/lib/vacatures-demo";

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

function stripTags(s: string) {
  return s.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
}

// "28 tot 32" / "36" / "16-24" -> [min, max].
function parseUren(s: string | null): [number, number] {
  const nums = (String(s ?? "").match(/\d{1,2}/g) ?? []).map(Number).filter((n) => n > 0 && n <= 40);
  if (nums.length >= 2) return [Math.min(...nums), Math.max(...nums)];
  if (nums.length === 1) return [nums[0], nums[0]];
  return [32, 36];
}

// Best-effort indeling in DetaVia-vakgebieden op basis van de titel.
function vakgebiedVan(titel: string): string {
  const t = titel.toLowerCase();
  if (/leerplicht|rmc|kwalificatieplicht/.test(t)) return "wmo";
  if (/inburger|statushouder|nieuwkomer|asiel/.test(t)) return "beleid";
  if (/schuld|budget|bewind|financ/.test(t)) return "schuld";
  if (/inkomen|bijstand|uitkering|terugvordering|debiteuren|p-?wet/.test(t)) return "inkomen";
  if (/re-?integratie|werkcoach|jobcoach|arbeidsmarkt|arbeidsparticipatie|werkconsulent/.test(t)) return "jeugd";
  return "participatie";
}

// Splitst de Flextender-omschrijving in secties op basis van de <strong>-koppen.
function sectiesVan(html: string): { key: string; label: string; html: string }[] {
  const parts = html.split(/<strong>/i).slice(1);
  const out: { key: string; label: string; html: string }[] = [];
  for (const p of parts) {
    const m = p.match(/^([\s\S]*?)<\/strong>([\s\S]*)$/i);
    if (!m) continue;
    const label = stripTags(m[1]).trim();
    const key = label.toLowerCase().replace(/[^a-z]/g, "");
    out.push({ key, label, html: m[2] });
  }
  return out;
}

const SCHOON: sanitizeHtml.IOptions = {
  allowedTags: ["p", "br", "ul", "ol", "li", "strong", "em", "b", "i"],
  allowedAttributes: {},
};

// Zet vrije-tekst met <br>/nummering om naar losse eisen-regels.
function eisenVan(html: string): string[] {
  const tekst = html.replace(/<\/(p|li|div)>/gi, "\n").replace(/<br\s*\/?>/gi, "\n");
  return stripTags(tekst)
    .split(/\n+/)
    .map((r) => r.replace(/^\s*\d{1,2}[.)]\s*/, "").replace(/[;.]\s*$/, "").trim())
    .filter((r) => r.length > 4 && r.length < 300)
    .slice(0, 12);
}

// Zet een Flextender-opdracht om naar een gewone Vacature, zodat die overal
// identiek aan onze eigen vacatures wordt getoond (kaart, detailpagina, URL).
// De lange tender-boilerplate wordt weggelaten: alleen de kandidaat-relevante
// delen (organisatie, opdracht, competenties, werkdagen, vereisten).
export function opdrachtNaarVacature(o: Opdracht): Vacature {
  const secties = sectiesVan(o.omschrijving ?? "");
  const vind = (...zoek: string[]) => secties.find((s) => zoek.some((z) => s.key.includes(z)));

  const organisatie = vind("organisatie");
  const opdracht = secties.find((s) => s.key === "opdracht") ?? vind("opdracht", "werkzaamheden");
  const competenties = vind("competenties");
  const werkdagen = vind("werkdagen");
  const vereisten = vind("vereisten", "knockout", "functieeisen", "minimumeisen");

  // Body ("Wat ga je doen?"): opdracht + eventueel competenties/werkdagen.
  const delen: string[] = [];
  if (opdracht) delen.push(opdracht.html);
  if (competenties) delen.push(`<h4>Competenties</h4>${competenties.html}`);
  if (werkdagen) delen.push(`<h4>Werkdagen</h4>${werkdagen.html}`);
  const takenRaw = delen.join("") || o.omschrijving || "";
  const taken = sanitizeHtml(takenRaw, SCHOON);

  // Intro ("Over deze opdracht"): korte organisatietekst of begin van de opdracht.
  const introBron = organisatie?.html || opdracht?.html || o.omschrijving || "";
  const intro = stripTags(introBron).slice(0, 300).replace(/\s+\S*$/, "") + "…";

  const eisen = vereisten ? eisenVan(vereisten.html) : [];

  return {
    id: `fl-${o.avnummer}`,
    slug: slugify(`${o.opdracht}-${o.regio ?? ""}`) || `opdracht-${o.avnummer}`,
    titel: o.opdracht,
    vakgebied: vakgebiedVan(o.opdracht),
    plaats: o.regio ?? "In overleg",
    uren: parseUren(o.urenperweek),
    salaris: [0, 0],
    salaris_periode: "maand",
    type: "Detachering",
    top: false,
    datum: "",
    omschrijving: intro.length > 2 ? intro : o.opdracht,
    taken: taken || undefined,
    eisen: eisen.length ? eisen : undefined,
    opdrachtgever: o.opdrachtgever ?? undefined,
    startdatum: o.aanvang ?? undefined,
    duur: o.duur ?? undefined,
    inactief_op: o.sluiting_inschrijving,
  };
}

// Flextender-opdrachten als Vacature-lijst (voor samenvoegen met eigen vacatures).
export async function loadOpdrachtenAlsVacatures(): Promise<Vacature[]> {
  const opdrachten = await loadOpdrachten();
  return opdrachten.map(opdrachtNaarVacature);
}
