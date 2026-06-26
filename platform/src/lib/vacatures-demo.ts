export const VAKGEBIEDEN: Record<string, string> = {
  wmo: "Leerplicht",
  jeugd: "Werk en inkomen",
  participatie: "Participatie",
  schuld: "Schuldhulpverlening",
  inkomen: "Inkomen",
  beleid: "Beleid & Advies",
};

export type Vacature = {
  id: string;
  titel: string;
  vakgebied: keyof typeof VAKGEBIEDEN | string;
  plaats: string;
  uren: [number, number];
  salaris: [number, number];
  type: string;
  top: boolean;
  datum: string;
  omschrijving: string;
  // Optionele, rijke velden voor de detailpagina (per vacature)
  slug?: string;
  taken?: string;
  eisen?: string[];
  opdrachtgever?: string;
  startdatum?: string;
  duur?: string;
  salaris_periode?: string; // 'uur' | 'week' | '4weken' | 'maand'
  inactief_op?: string | null;
};

// Alleen gebruikt als voorbeeld in demo-modus (zonder Supabase). Op de live site
// worden uitsluitend echte vacatures uit de database getoond.
export const DEMO_VACATURES: Vacature[] = [
  { id: "1", titel: "Wmo-consulent", vakgebied: "wmo", plaats: "Almere", uren: [32, 36], salaris: [3300, 4600], type: "Detachering", top: true, datum: "2026-06-12", omschrijving: "Je voert keukentafelgesprekken en organiseert passende ondersteuning, zodat inwoners zo zelfstandig mogelijk blijven." },
  { id: "2", titel: "Wmo-consulent complexe casuïstiek", vakgebied: "wmo", plaats: "Utrecht", uren: [36, 40], salaris: [3700, 5300], type: "Detachering", top: false, datum: "2026-06-08", omschrijving: "Voor de zwaardere casuïstiek zoek je samen met inwoner en netwerk naar een duurzame oplossing." },
  { id: "3", titel: "Jeugdconsulent", vakgebied: "jeugd", plaats: "Amsterdam", uren: [28, 36], salaris: [3300, 4600], type: "Detachering", top: true, datum: "2026-06-11", omschrijving: "Je begeleidt gezinnen naar passende jeugdhulp en houdt regie op het ondersteuningsplan." },
  { id: "4", titel: "Gezinscoach", vakgebied: "jeugd", plaats: "Rotterdam", uren: [24, 32], salaris: [3000, 4000], type: "Detachering", top: false, datum: "2026-06-03", omschrijving: "Als gezinscoach werk je outreachend en versterk je de eigen kracht van het gezin." },
  { id: "5", titel: "Klantmanager Participatie", vakgebied: "participatie", plaats: "Den Haag", uren: [32, 40], salaris: [3300, 4600], type: "Detachering", top: true, datum: "2026-06-10", omschrijving: "Je begeleidt inwoners naar werk en meedoen, met aandacht voor wat iemand wél kan." },
  { id: "6", titel: "Klantmanager Werk & Inkomen", vakgebied: "participatie", plaats: "Eindhoven", uren: [36, 40], salaris: [3300, 4600], type: "ZZP", top: false, datum: "2026-05-28", omschrijving: "Een brede caseload op het snijvlak van werk, inkomen en participatie." },
  { id: "7", titel: "Schuldhulpverlener", vakgebied: "schuld", plaats: "Groningen", uren: [24, 36], salaris: [3000, 4000], type: "Detachering", top: false, datum: "2026-06-06", omschrijving: "Je brengt financiële rust en grip terug en stelt samen een haalbaar plan op." },
  { id: "8", titel: "Budgetcoach", vakgebied: "schuld", plaats: "Tilburg", uren: [16, 24], salaris: [2700, 3700], type: "Detachering", top: false, datum: "2026-05-30", omschrijving: "Je coacht inwoners naar financiële zelfredzaamheid en voorkomt nieuwe schulden." },
  { id: "9", titel: "Inkomensconsulent", vakgebied: "inkomen", plaats: "Zwolle", uren: [32, 36], salaris: [3000, 4000], type: "Detachering", top: true, datum: "2026-06-09", omschrijving: "Je beoordeelt aanvragen rechtmatig en menselijk, met oog voor de mens achter de aanvraag." },
  { id: "10", titel: "Medewerker Terugvordering", vakgebied: "inkomen", plaats: "Breda", uren: [32, 40], salaris: [3000, 4000], type: "Detachering", top: false, datum: "2026-05-26", omschrijving: "Je handelt terugvorderingen en verhaal zorgvuldig en oplossingsgericht af." },
  { id: "11", titel: "Adviseur Sociaal Domein", vakgebied: "beleid", plaats: "Amersfoort", uren: [32, 40], salaris: [4000, 5800], type: "Detachering", top: true, datum: "2026-06-07", omschrijving: "Je vertaalt ontwikkelingen naar beleid en adviseert het management van uitvoering tot strategie." },
  { id: "12", titel: "Beleidsmedewerker Wmo & Jeugd", vakgebied: "beleid", plaats: "Nijmegen", uren: [28, 36], salaris: [3700, 5300], type: "Detachering", top: false, datum: "2026-05-22", omschrijving: "Je ontwikkelt en evalueert beleid op het brede sociaal domein." },
];

export const euro = (n: number) =>
  "€ " + n.toLocaleString("nl-NL", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });

export const PERIODE_LABEL: Record<string, string> = {
  uur: "per uur",
  week: "per week",
  "4weken": "per 4 weken",
  maand: "per maand",
};

// Nette uren-weergave: "28 uur" of "28-36 uur".
export const urenLabel = (u: [number, number]) => (u[0] === u[1] ? `${u[0]} uur` : `${u[0]}-${u[1]} uur`);

// Salaris met de juiste periode, of "Tarief in overleg" als er geen bedrag is.
export const salarisLabel = (s: [number, number], periode = "maand") =>
  s[0] > 0 ? `${euro(s[0])} - ${euro(s[1])} ${PERIODE_LABEL[periode] ?? "per maand"}` : "Tarief in overleg";

export const fmtSalaris = (s: [number, number]) => salarisLabel(s, "maand");
