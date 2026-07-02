import { createClient } from "@/lib/supabase/server";
import sanitizeHtml from "sanitize-html";
import Anthropic from "@anthropic-ai/sdk";
import { slugify } from "@/lib/blog";
import type { Vacature } from "@/lib/vacatures-demo";

export type AiStructuur = { intro: string; taken: string[]; eisen: string[]; vakgebied?: string };

// DetaVia-vakgebieden: label (wat Claude kiest) -> interne sleutel.
const VAKGEBIED_LABELS: Record<string, string> = {
  Leerplicht: "wmo",
  Werk: "jeugd",
  Participatie: "participatie",
  Schuldhulpverlening: "schuld",
  Inkomen: "inkomen",
  Inburgering: "beleid",
};

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
  ai_json?: AiStructuur | null;
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

// Eenvoudige, stabiele hash van de bron-omschrijving (djb2) om te bepalen of de
// AI opnieuw moet draaien.
export function hashVan(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(16);
}

// Zet de ruwe tender-omschrijving via Claude Haiku om naar een schone,
// gestructureerde DetaVia-vacature (intro + taken + eisen). null bij fout/geen key.
export async function structureerViaAI(titel: string, omschrijving: string): Promise<AiStructuur | null> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key || !omschrijving || omschrijving.length < 40) return null;
  const SYSTEM = `Je bent de vacature-redacteur van DetaVia, detacheringspartner in het sociaal domein. Je krijgt de ruwe, rommelige en ambtelijke opdrachttekst van een overheids-inhuur (tender). Jouw taak: HERSCHRIJF dit naar een aantrekkelijke, wervende vacaturetekst in de DetaVia tone of voice (empathisch, positief, toegankelijk, mensgericht, professioneel maar laagdrempelig). Neem de brontekst NIET letterlijk over: haal de kern eruit, schrap ambtelijk jargon en tender-taal, en maak er prettig leesbare, bondige tekst van.

Lever je output ALTIJD via het tool structureer_vacature:
- intro: 1 a 2 korte, wervende zinnen over de kern van de functie, gericht tot de lezer met "je". Geen opsomming, geen organisatiegeschiedenis, geen herhaling van de taken.
- taken: 4 tot 8 concrete werkzaamheden als korte, HERSCHREVEN bullets (werkwoord voorop, geen puntkomma's of nummering). Laat dit NIET leeg als de brontekst werkzaamheden bevat, ook niet bij advies- of beleidsfuncties.
- eisen: de functie-eisen / must-haves als korte, HERSCHREVEN bullets. Laat dit NIET leeg als de brontekst eisen of vereisten bevat.
- vakgebied: kies het best passende DetaVia-vakgebied uit exact deze lijst:
  * "Leerplicht" = leerplicht, RMC, kwalificatieplicht, schoolverzuim jongeren.
  * "Werk" = toeleiding naar werk, arbeidsmarkt, re-integratie, jobcoaching, werkconsulent, arbeidsparticipatie.
  * "Participatie" = brede uitvoering sociaal domein: Wmo, Jeugd, welzijn, klantmanager/consulent sociaal domein, zorg en ondersteuning (kies dit als het niet duidelijk in een andere categorie past).
  * "Schuldhulpverlening" = schulden, budgetbeheer, bewindvoering, financiële hulpverlening.
  * "Inkomen" = bijstand, uitkeringen, inkomensconsulent, terugvordering, debiteuren, rechtmatigheid.
  * "Inburgering" = inburgering, statushouders, nieuwkomers, asiel, Wet inburgering.

Negeer en verwerk NIET: uitvoeringsvoorwaarde/Wet DBA-teksten, gunningscriteria en puntenwegingen, fee van Flextender, cv-eisen over de inschrijving, planning/reactietermijn en overige tender- of inschrijfprocedures. Schrijf Nederlands. Gebruik NOOIT em-dashes (gebruik komma's of gewone streepjes). Geen holle marketingtaal. Als taken of eisen echt ontbreken, geef een lege lijst.`;
  const TOOL: Anthropic.Tool = {
    name: "structureer_vacature",
    description: "Levert de gestructureerde vacaturetekst.",
    input_schema: {
      type: "object",
      properties: {
        intro: { type: "string", description: "2-3 zinnen; wat ga je doen." },
        taken: { type: "array", items: { type: "string" }, description: "Concrete taken als bullets." },
        eisen: { type: "array", items: { type: "string" }, description: "Functie-eisen / must-haves als bullets." },
        vakgebied: { type: "string", enum: ["Leerplicht", "Werk", "Participatie", "Schuldhulpverlening", "Inkomen", "Inburgering"], description: "Best passende DetaVia-vakgebied." },
      },
      required: ["intro", "taken", "eisen", "vakgebied"],
    },
  };
  try {
    const client = new Anthropic({ apiKey: key });
    const model = process.env.DETAVIA_AI_MODEL_FLEX || "claude-haiku-4-5";
    const res = await client.messages.create({
      model,
      max_tokens: 2000,
      system: SYSTEM,
      tools: [TOOL],
      tool_choice: { type: "tool", name: "structureer_vacature" },
      messages: [{ role: "user", content: `Functietitel: ${titel}\n\nRuwe opdrachttekst (met regel-/bulletstructuur):\n${platTekst(omschrijving).slice(0, 9000)}` }],
    });
    const tu = res.content.find((b) => b.type === "tool_use");
    if (!tu || tu.type !== "tool_use") return null;
    const a = tu.input as Partial<AiStructuur>;
    if (typeof a.intro !== "string") return null;
    return {
      intro: a.intro.trim(),
      taken: Array.isArray(a.taken) ? a.taken.map((s) => String(s).trim()).filter(Boolean).slice(0, 15) : [],
      eisen: Array.isArray(a.eisen) ? a.eisen.map((s) => String(s).trim()).filter(Boolean).slice(0, 15) : [],
      vakgebied: typeof a.vakgebied === "string" ? (VAKGEBIED_LABELS[a.vakgebied] ?? undefined) : undefined,
    };
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

// Platte tekst met behoud van regel-/bulletstructuur (voor de AI-input).
function platTekst(html: string): string {
  let t = html
    .replace(/<li[^>]*>/gi, "\n- ")
    .replace(/<\/(p|li|div|h[1-6]|tr|ul|ol)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
  return t.split("\n").map((l) => l.replace(/[ \t]+/g, " ").trim()).filter(Boolean).join("\n");
}

// "28 tot 32" / "36" / "16-24" -> [min, max].
function parseUren(s: string | null): [number, number] {
  const nums = (String(s ?? "").match(/\d{1,2}/g) ?? []).map(Number).filter((n) => n > 0 && n <= 40);
  if (nums.length >= 2) return [Math.min(...nums), Math.max(...nums)];
  if (nums.length === 1) return [nums[0], nums[0]];
  return [32, 36];
}

// Haalt een maximum uurtarief uit de omschrijving (tenders noemen vaak
// "uurtarief maximaal € 105,- exclusief btw"). null als er niets bruikbaars staat.
export function maxTariefVan(html: string): number | null {
  const t = stripTags(html);
  const segmenten = t.match(/[^.]*\b(?:uur)?tarief\b[^.]*/gi) ?? [];
  for (const seg of segmenten) {
    if (!/maxim|max\.?/i.test(seg)) continue; // alleen echte maximumtarieven
    const m = seg.match(/€\s?(\d{2,3})(?:[.,]\d{2}|,-)?/);
    if (m) {
      const n = Number(m[1]);
      if (n >= 40 && n <= 250) return n; // realistisch uurtarief-bereik
    }
  }
  return null;
}

// Haalt de functieschaal uit de omschrijving ("ingedeeld in functieschaal 9",
// ook "6/7"). null als er geen geldige schaal (1-18) staat.
export function functieschaalVan(html: string): string | null {
  const t = stripTags(html);
  const m = t.match(/functieschaal\s*:?\s*([0-9]{1,2}(?:\s*\/\s*[0-9]{1,2})?)\b/i);
  if (!m) return null;
  const s = m[1].replace(/\s+/g, "");
  const eerste = Number(s.split("/")[0]);
  return eerste >= 1 && eerste <= 18 ? s : null;
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
    // Lege/opmaak-koppen (bv. <strong><br></strong>) horen bij de vorige sectie.
    if (!key) {
      if (out.length) out[out.length - 1].html += m[2];
      continue;
    }
    out.push({ key, label, html: m[2] });
  }
  return out;
}

const SCHOON: sanitizeHtml.IOptions = {
  allowedTags: ["p", "br", "ul", "ol", "li", "strong", "em", "b", "i", "h3", "h4"],
  allowedAttributes: {},
};

// Ruwe HTML -> losse tekstregels (bullets uit <li> en •-tekens blijven behouden).
function naarRegels(html: string): string[] {
  const t = html
    .replace(/<li[^>]*>/gi, "\n• ")
    .replace(/<\/(p|li|div|h[1-6]|tr)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n");
  return stripTags(t).split(/\n+/).map((s) => s.trim()).filter(Boolean);
}

// Zet een sectie om naar nette <p>'s en <ul><li>-lijsten (geen losse • of geplakte tekst).
function schoonBlok(html: string): string {
  let out = "", inLijst = false;
  for (const regel of naarRegels(html)) {
    const isBullet = /^[•\-*•▪–·]\s+/.test(regel) || /^\d{1,2}[.)]\s/.test(regel);
    const tekst = regel.replace(/^[•\-*•▪–·]\s*/, "").replace(/^\d{1,2}[.)]\s*/, "").replace(/;\s*$/, "").trim();
    if (tekst.length < 2) continue;
    if (isBullet) { if (!inLijst) { out += "<ul>"; inLijst = true; } out += `<li>${tekst}</li>`; }
    else { if (inLijst) { out += "</ul>"; inLijst = false; } out += `<p>${tekst}</p>`; }
  }
  if (inLijst) out += "</ul>";
  return out;
}

// Eerste paar zinnen als korte intro.
function eersteZinnen(plat: string, max = 3): string {
  const zinnen = plat.split(/(?<=[.!?])\s+/).filter(Boolean).slice(0, max).join(" ").trim();
  return zinnen.length > 6 ? zinnen : plat.slice(0, 300).trim();
}

// Zet vrije-tekst met <br>/nummering om naar losse eisen-regels.
function eisenVan(html: string): string[] {
  const tekst = html.replace(/<\/(p|li|div)>/gi, "\n").replace(/<br\s*\/?>/gi, "\n");
  return stripTags(tekst)
    .split(/\n+/)
    .map((r) =>
      r
        .replace(/^\s*\d{1,2}[.)]\s*/, "") // nummering weg
        .replace(/,?\s*benoem dit? duidelijk in (het )?cv\.?/i, "") // tender-frase weg
        .replace(/\s*\(\d+\s*punten\)/i, "") // "(10 punten)" weg
        .replace(/[;.]\s*$/, "")
        .trim(),
    )
    .filter((r) => r.length > 4 && r.length < 260)
    .slice(0, 10);
}

// Zet een Flextender-opdracht om naar een gewone Vacature, zodat die overal
// identiek aan onze eigen vacatures wordt getoond (kaart, detailpagina, URL).
// De lange tender-boilerplate wordt weggelaten: alleen de kandidaat-relevante
// delen (organisatie, opdracht, competenties, werkdagen, vereisten).
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function opdrachtNaarVacature(o: Opdracht): Vacature {
  // 1) Ruwe tekst per kop uitsplitsen = altijd beschikbare basis/terugval.
  const secties = sectiesVan(o.omschrijving ?? "");
  const vind = (...zoek: string[]) => secties.find((s) => zoek.some((z) => s.key.includes(z)));
  const organisatie = vind("organisatie");
  const opdracht = secties.find((s) => s.key === "opdracht") ?? vind("opdracht", "werkzaamheden");
  const competenties = vind("competenties");
  const werkdagen = vind("werkdagen");
  const vereisten = vind("vereisten", "knockout", "functieeisen", "minimumeisen");

  const opdrachtHtml = opdracht?.html ?? o.omschrijving ?? "";
  const markerRe = /belangrijkste taken|concreet omvat dit|takenpakket|je taken|de werkzaamheden|werkzaamheden\s*:|dit ga je doen/i;
  const idx = opdrachtHtml.search(markerRe);
  const introHtml = idx > 40 ? opdrachtHtml.slice(0, idx) : opdrachtHtml;
  const takenHtml = idx > 40 ? opdrachtHtml.slice(idx) : opdrachtHtml;

  const regexIntro = eersteZinnen(stripTags(organisatie?.html || introHtml));
  let regexTakenBlok = schoonBlok(takenHtml);
  if (competenties) regexTakenBlok += "<h4>Competenties</h4>" + schoonBlok(competenties.html);
  if (werkdagen) regexTakenBlok += "<h4>Werkdagen</h4>" + schoonBlok(werkdagen.html);
  const regexTaken = sanitizeHtml(regexTakenBlok, SCHOON) || undefined;
  const regexEisen = vereisten ? eisenVan(vereisten.html) : [];

  // 2) Door Claude gestructureerde versie waar aanwezig, anders de ruwe tekst.
  const ai = o.ai_json;
  const intro = ai?.intro && ai.intro.length > 4 ? ai.intro : regexIntro;
  const takenLijst = ai?.taken?.length ? ai.taken : undefined; // losse bullets voor eigen opmaak
  const aiTaken = ai?.taken?.length ? `<ul>${ai.taken.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : undefined;
  const taken = aiTaken ?? regexTaken; // "Wat ga je doen?" staat er altijd
  const eisen = ai?.eisen?.length ? ai.eisen : regexEisen.length ? regexEisen : undefined;

  return {
    id: `fl-${o.avnummer}`,
    slug: slugify(`${o.opdracht}-${o.regio ?? ""}`) || `opdracht-${o.avnummer}`,
    titel: o.opdracht,
    vakgebied: o.ai_json?.vakgebied || vakgebiedVan(o.opdracht),
    plaats: o.regio ?? "In overleg",
    uren: parseUren(o.urenperweek),
    salaris: (() => { const mx = maxTariefVan(o.omschrijving ?? ""); return mx ? [0, mx] : [0, 0]; })(),
    salaris_periode: "uur",
    type: "Detachering",
    top: false,
    datum: "",
    omschrijving: intro.length > 2 ? intro : o.opdracht,
    taken,
    takenLijst,
    eisen,
    opdrachtgever: o.opdrachtgever ?? undefined,
    startdatum: o.aanvang ?? undefined,
    duur: o.duur ?? undefined,
    schaal: functieschaalVan(o.omschrijving ?? "") ?? undefined,
    inactief_op: o.sluiting_inschrijving,
  };
}

// Flextender-opdrachten als Vacature-lijst (voor samenvoegen met eigen vacatures).
export async function loadOpdrachtenAlsVacatures(): Promise<Vacature[]> {
  const opdrachten = await loadOpdrachten();
  return opdrachten.map(opdrachtNaarVacature);
}
