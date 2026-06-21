// Lichtgewicht parser voor job-XML-feeds (Indeed-stijl <job> ... </job>).
// Geen externe library nodig; werkt met de meest voorkomende veldnamen.

const VAK_KEYS = ["wmo", "jeugd", "participatie", "schuld", "inkomen", "beleid"] as const;

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
  omschrijving: string;
  taken: string;
  type: string;
  vakgebied: string;
  salaris_min: number | null;
  salaris_max: number | null;
  uren_min: number;
  uren_max: number;
  url: string;
  referentie: string;
};

function guessVakgebied(text: string): string {
  const t = text.toLowerCase();
  if (/jeugd|gezins|skj/.test(t)) return "jeugd";
  if (/participatie|klantmanager|re-?integratie|werk\s*&?\s*inkomen/.test(t)) return "participatie";
  if (/schuld|budget/.test(t)) return "schuld";
  if (/inkomen|uitkering|terugvordering|bijstand/.test(t)) return "inkomen";
  if (/beleid|adviseur|projectleider/.test(t)) return "beleid";
  if (/wmo|maatschappelijke ondersteuning|consulent|loket/.test(t)) return "wmo";
  for (const k of VAK_KEYS) if (t.includes(k)) return k;
  return "wmo";
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

export function parseJobsXml(xml: string): ParsedJob[] {
  const blocks = xml.match(/<job\b[\s\S]*?<\/job>/gi) ?? [];
  const jobs: ParsedJob[] = [];
  for (const b of blocks) {
    const titel = tag(b, "title", "titel", "functie");
    if (!titel) continue;
    const descRaw = tag(b, "description", "omschrijving", "content");
    const categorie = tag(b, "category", "vakgebied", "categorie");
    const [umin, umax] = parseUren(tag(b, "hoursperweek", "uren", "hours"));
    const [smin, smax] = parseSalaris(tag(b, "salary", "salaris"));
    jobs.push({
      titel,
      plaats: tag(b, "city", "plaats", "location"),
      opdrachtgever: tag(b, "company", "opdrachtgever", "bedrijf"),
      omschrijving: stripHtml(descRaw).slice(0, 280),
      taken: stripHtml(descRaw),
      type: tag(b, "jobtype", "type", "dienstverband") || "Detachering",
      vakgebied: guessVakgebied(`${categorie} ${titel} ${descRaw}`),
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
