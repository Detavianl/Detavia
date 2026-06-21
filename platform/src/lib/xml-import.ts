// Lichtgewicht parser voor job-XML-feeds (Indeed-stijl <job> ... </job>).
// Geen externe library nodig; werkt met de meest voorkomende veldnamen.

function stripCdata(s: string) {
  return s.replace(/<!\[CDATA\[/g, "").replace(/\]\]>/g, "").trim();
}
function tag(block: string, ...names: string[]): string {
  for (const name of names) {
    const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"));
    if (m) return stripCdata(m[1]);
  }
  return "";
}
function stripHtml(s: string) {
  return s.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
}

export type ParsedJob = {
  titel: string;
  plaats: string;
  opdrachtgever: string;
  omschrijving: string;   // korte intro (plat)
  taken: string;          // volledige beschrijving (HTML behouden)
  eisen: string[];        // uit bullet-lijst, indien herkend
  type: string;
  vakgebied: string;      // "" als niet binnen sociaal domein
  isSociaal: boolean;
  salaris_min: number | null;
  salaris_max: number | null;
  uren_min: number;
  uren_max: number;
  url: string;
  referentie: string;
};

// Sociaal-domein herkenning. Leeg = valt buiten het sociaal domein.
function vakgebiedVan(text: string): string {
  const t = text.toLowerCase();
  if (/jeugd|gezins|jeugdzorg|skj|gezinscoach/.test(t)) return "jeugd";
  if (/participatie|klantmanager|re-?integratie|werk\s*&?\s*inkomen|arbeidsre/.test(t)) return "participatie";
  if (/schuld|budgetco|bewindvoer/.test(t)) return "schuld";
  if (/inkomensconsulent|bijstand|uitkering|terugvordering|handhav(er|ing).*sociaal/.test(t)) return "inkomen";
  if (/beleids(adviseur|medewerker).*(sociaal|wmo|jeugd|zorg)|projectleider sociaal/.test(t)) return "beleid";
  if (/wmo|maatschappelijke ondersteuning|sociaal domein|sociaal loket|zorgconsulent|consulent (wmo|zorg)/.test(t)) return "wmo";
  return "";
}

function parseUren(s: string): [number, number] {
  const nums = (s.match(/\d{1,2}/g) ?? []).map(Number).filter((n) => n > 0 && n <= 40);
  if (nums.length >= 2) return [Math.min(nums[0], nums[1]), Math.max(nums[0], nums[1])];
  if (nums.length === 1) return [nums[0], nums[0]];
  return [32, 36];
}
function parseSalaris(s: string): [number | null, number | null] {
  const nums = (s.replace(/\./g, "").match(/\d{3,6}/g) ?? []).map(Number).filter((n) => n >= 1000 && n <= 12000);
  if (nums.length >= 2) return [Math.min(nums[0], nums[1]), Math.max(nums[0], nums[1])];
  if (nums.length === 1) return [nums[0], nums[0]];
  return [null, null];
}

// Probeer een eisen-lijst te vinden: de <ul> die volgt op een eisen-achtige kop.
function extractEisen(html: string): string[] {
  const lower = html.toLowerCase();
  const triggers = ["wat vraag", "wat vragen wij", "functie-eis", "functie eis", "jij hebt", "jij beschikt", "wat neem je mee", "wij vragen", "jouw profiel", "wat breng je mee"];
  let idx = -1;
  for (const tr of triggers) {
    const i = lower.indexOf(tr);
    if (i >= 0 && (idx === -1 || i < idx)) idx = i;
  }
  const zoekIn = idx >= 0 ? html.slice(idx) : "";
  const ulMatch = zoekIn.match(/<ul[^>]*>([\s\S]*?)<\/ul>/i);
  if (!ulMatch) return [];
  return (ulMatch[1].match(/<li[^>]*>([\s\S]*?)<\/li>/gi) ?? [])
    .map((li) => stripHtml(li))
    .filter((s) => s.length > 2)
    .slice(0, 12);
}

export function parseJobsXml(xml: string): ParsedJob[] {
  const blocks = xml.match(/<job\b[\s\S]*?<\/job>/gi) ?? [];
  const jobs: ParsedJob[] = [];
  for (const b of blocks) {
    const titel = tag(b, "title", "titel", "functie");
    if (!titel) continue;
    const descHtml = tag(b, "description", "omschrijving", "content");
    const categorie = tag(b, "category", "vakgebied", "categorie");
    const [umin, umax] = parseUren(tag(b, "hoursperweek", "hours", "uren"));
    const [smin, smax] = parseSalaris(tag(b, "salary", "salaris"));
    const vakgebied = vakgebiedVan(`${categorie} ${titel} ${descHtml}`);
    const eersteAlinea = (descHtml.match(/<p[^>]*>([\s\S]*?)<\/p>/i)?.[1]) ?? descHtml;
    jobs.push({
      titel,
      plaats: tag(b, "city", "plaats", "location"),
      opdrachtgever: tag(b, "company", "opdrachtgever", "bedrijf"),
      omschrijving: stripHtml(eersteAlinea).slice(0, 280),
      taken: descHtml,
      eisen: extractEisen(descHtml),
      type: tag(b, "jobtype", "type", "dienstverband") || "Detachering",
      vakgebied,
      isSociaal: vakgebied !== "",
      salaris_min: smin,
      salaris_max: smax,
      uren_min: umin,
      uren_max: umax,
      url: tag(b, "url", "link"),
      referentie: tag(b, "referencenumber", "reference", "id", "aanvraagnr"),
    });
  }
  return jobs;
}
