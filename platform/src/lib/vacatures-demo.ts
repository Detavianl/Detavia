export const VAKGEBIEDEN: Record<string, string> = {
  wmo: "Wmo",
  jeugd: "Jeugd",
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
  taken?: string;
  eisen?: string[];
  opdrachtgever?: string;
  startdatum?: string;
  duur?: string;
};

export const DEMO_VACATURES: Vacature[] = [
  { id: "sociaal-loket-1stroom", titel: "Medewerker Sociaal loket", vakgebied: "wmo", plaats: "Duiven", uren: [28, 36], salaris: [3000, 4000], type: "Detachering", top: true, datum: "2026-06-21",
    omschrijving: "Als medewerker Sociaal loket ben jij het eerste aanspreekpunt voor inwoners met vragen op het gebied van het sociaal domein. Je helpt mensen snel en persoonlijk verder.",
    taken: "Als medewerker Sociaal loket ben jij het eerste aanspreekpunt voor burgers, bedrijven en andere instellingen die bellen of langskomen met vragen, klachten of problemen. In de meeste gevallen ben jij degene die de klant meteen kan helpen met zijn of haar vraag op het gebied van het sociaal domein. In het team werk je iedere ochtend aan de telefoon. In de middag werk je aan binnengekomen e-mails of andere achtergrondwerkzaamheden. Daarnaast kun je worden ingezet voor het behandelen van aanvragen leerlingenvervoer.",
    eisen: [
      "Een afgeronde opleiding richting Pedagogiek, Social Work of vergelijkbaar",
      "In het bezit van een geldige SKJ-registratie",
      "Aantoonbare werkervaring met Suite voor het Sociaal Domein",
      "Aantoonbare werkervaring met ZorgNed en JKC",
      "Beschikbaar per uiterlijk 21 juli 2026 voor 28 tot 36 uur per week en bereid om ochtenden te werken",
      "Minimaal 1 jaar werkervaring in het sociaal domein als kcc-medewerker bij een gemeente of gemeentelijke regeling",
    ],
    opdrachtgever: "Gemeenschappelijke regeling 1Stroom (Gelderland)",
    startdatum: "21 juli 2026",
    duur: "tot 20 januari 2027, verlenging mogelijk" },
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

export const euro = (n: number) => "€ " + n.toLocaleString("nl-NL");
export const fmtSalaris = (s: [number, number]) => `${euro(s[0])} - ${euro(s[1])} p/m`;
