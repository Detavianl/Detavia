// Scraper voor Flextender-inhuuropdrachten. Werkt serverside met gewone HTTP
// requests (geen browser): lijst via hun WordPress-AJAX, details per opdracht.
// Filtert op het sociaal domein. Let op: leunt op de structuur van flextender.nl.

const BASE = "https://www.flextender.nl";
const UA = { "User-Agent": "Mozilla/5.0 (compatible; DetaViaSync/1.0)" };

function stripTags(s: string) {
  return s.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&euro;/g, "€").replace(/\s+/g, " ").trim();
}

// Sociaal-domein detectie op basis van titel/tekst. "" = buiten sociaal domein.
export function vakgebiedVan(text: string): string {
  const t = text.toLowerCase();
  if (/jeugd|gezins|jeugdzorg|skj|gezinscoach|gezinsmanager/.test(t)) return "jeugd";
  if (/participatie|klantmanager|re-?integratie|arbeidsparticipatie|werkconsulent/.test(t)) return "participatie";
  if (/schuld|budgetco|bewindvoer/.test(t)) return "schuld";
  if (/inkomensconsulent|bijstand|terugvordering|consulent inkomen|wwb|p-wet/.test(t)) return "inkomen";
  if (/beleids(adviseur|medewerker).*(sociaal|wmo|jeugd|zorg|participatie)/.test(t)) return "beleid";
  if (/wmo|maatschappelijke ondersteuning|sociaal domein|sociaal loket|zorgconsulent|consulent (wmo|zorg)|toegangsmedewerker/.test(t)) return "wmo";
  return "";
}

export type FlexOpdracht = {
  aanvraagnr: string;
  titel: string;
  vakgebied: string;
  plaats: string;
  opdrachtgever: string;
  omschrijving: string;
  taken: string;
  eisen: string[];
  uren_min: number;
  uren_max: number;
  startdatum: string;
  duur: string;
  url: string;
};

async function getWidgetConfig(): Promise<string | null> {
  const res = await fetch(`${BASE}/opdrachten/`, { headers: UA, cache: "no-store" });
  const html = await res.text();
  const m = html.match(/kbs_flx_widget_config"\s+value="([A-Za-z0-9+/=]+)"/);
  return m ? m[1] : null;
}

// Lijst met opdrachten (aanvraagnr + titel + regio) via de AJAX-call.
export async function fetchLijst(): Promise<{ aanvraagnr: string; titel: string; regio: string }[]> {
  const config = await getWidgetConfig();
  if (!config) return [];
  const fd = new FormData();
  fd.set("action", "kbs_flx_searchjobs");
  fd.set("kbs_flx_widget_config", config);
  fd.set("kbs_flx_joblsrc_freetext", "");
  fd.set("_charset_", "UTF-8");
  const res = await fetch(`${BASE}/wp-admin/admin-ajax.php`, { method: "POST", headers: UA, body: fd, cache: "no-store" });
  const json = (await res.json()) as { resultHtml?: string };
  const html = json.resultHtml ?? "";
  const blokken = html.split('<div class="css-foundjob').slice(1);
  const out: { aanvraagnr: string; titel: string; regio: string }[] = [];
  for (const b of blokken) {
    const nr = b.match(/aanvraagnr=(\d+)/)?.[1];
    const titel = b.match(/class="css-jobtitle"[^>]*>([^<]+)/)?.[1]?.trim();
    if (!nr || !titel) continue;
    const regio = b.match(/Regio<\/div>\s*<div class="css-value"[^>]*>([^<]+)/)?.[1]?.trim() ?? "";
    out.push({ aanvraagnr: nr, titel, regio });
  }
  return out;
}

function parseUren(s: string): [number, number] {
  const nums = (s.match(/\d{1,2}/g) ?? []).map(Number).filter((n) => n > 0 && n <= 40);
  if (nums.length >= 2) return [Math.min(...nums), Math.max(...nums)];
  if (nums.length === 1) return [nums[0], nums[0]];
  return [32, 36];
}

// Detailgegevens van een opdracht.
export async function fetchDetail(aanvraagnr: string, titel: string): Promise<FlexOpdracht | null> {
  const url = `${BASE}/opdracht?aanvraagnr=${aanvraagnr}`;
  const res = await fetch(url, { headers: UA, cache: "no-store" });
  if (!res.ok) return null;
  const h = await res.text();

  const pair = (label: string) =>
    h.match(new RegExp(`css-caption"[^>]*>\\s*${label}\\s*</div>\\s*<div class="css-value"[^>]*>(.*?)</div>`, "is"))?.[1] ?? "";
  const uren = stripTags(pair("Uren per week"));
  const [umin, umax] = parseUren(uren);
  const start = stripTags(pair("Start"));
  const duur = stripTags(pair("Duur"));
  const regio = stripTags(pair("Regio"));

  // Opdrachtomschrijving: tussen "Opdracht" en "Vereisten"
  const oi = h.search(/>\s*Opdracht\s*</i);
  const vi = h.search(/Vereisten\s*\/?\s*knock|Vereisten\s*</i);
  let taken = "";
  if (oi >= 0) {
    const seg = h.slice(oi, vi > oi ? vi : oi + 4000);
    taken = stripTags(seg).replace(/^Opdracht\s*/i, "").trim();
  }

  // Eisen: genummerde <br>-lijst na "Vereisten"
  const eisen: string[] = [];
  if (vi >= 0) {
    const seg = stripTags(h.slice(vi, vi + 2500));
    for (const part of seg.split(/(?=\b\d{1,2}\.\s)/)) {
      const m = part.match(/^\d{1,2}\.\s*(.+?)(?:;|$)/);
      if (m) {
        const eis = m[1].replace(/,?\s*benoem duidelijk in cv\.?/i, "").trim();
        if (eis.length > 4) eisen.push(eis);
      }
    }
  }

  const vakgebied = vakgebiedVan(`${titel} ${taken}`);
  return {
    aanvraagnr,
    titel,
    vakgebied,
    plaats: regio,
    opdrachtgever: "",
    omschrijving: taken.slice(0, 240),
    taken,
    eisen: eisen.slice(0, 10),
    uren_min: umin,
    uren_max: umax,
    startdatum: start,
    duur,
    url,
  };
}

// Haal alle sociaal-domein opdrachten op (lijst filteren op titel, dan details).
export async function fetchSociaalDomein(max = 40): Promise<FlexOpdracht[]> {
  const lijst = await fetchLijst();
  const kandidaten = lijst.filter((o) => vakgebiedVan(`${o.titel} ${o.regio}`) !== "").slice(0, max);
  const out: FlexOpdracht[] = [];
  for (const k of kandidaten) {
    const d = await fetchDetail(k.aanvraagnr, k.titel);
    if (d && d.vakgebied) out.push(d);
  }
  return out;
}
