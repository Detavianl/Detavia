import type { AtsCard } from "@/lib/ats";

// Demo-modus actief zolang Supabase niet gekoppeld is. Puur key-gestuurd:
// zodra NEXT_PUBLIC_SUPABASE_ANON_KEY in productie staat, kan demo nooit aan.
export function isDemo(): boolean {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !key || key === "replace-me";
}

export const DEMO_ADMIN = {
  user_id: "demo-user",
  naam: "Demo-beheerder",
  role: "super_admin" as const,
  email: "demo@detavia.nl",
};

export const DEMO_CANDIDATES = [
  { id: "c1", naam: "Sanne de Vries", email: "sanne@example.nl", telefoon: "06-11111111", woonplaats: "Almere", vakgebied: "wmo", linkedin: "https://linkedin.com/in/demo", bron: "formulier", notitie: "Sterke gesprekstechniek.", created_at: "2026-06-12",
    status: "actief", niveau: "senior", huidige_functie: "Senior Wmo-consulent", huidige_werkgever: "Gemeente Lelystad", beschikbaar_per: "2026-09-01", uren_beschikbaar: 32, tarief_min: 85, tarief_max: 95, salaris_indicatie: null, opleidingsniveau: "HBO Social Work", regio: "Flevoland / Gooi", talen: "Nederlands, Engels", rijbewijs: true, expertise: ["Wmo", "Keukentafelgesprekken", "Complexe casuïstiek"], rating: 4, laatste_contact: "2026-06-14", eigenaar: "demo-user", volgende_actie: "Terugbellen over interim-opdracht Almere", volgende_actie_datum: "2026-06-18" },
  { id: "c2", naam: "Mehmet Yıldız", email: "mehmet@example.nl", telefoon: "06-22222222", woonplaats: "Utrecht", vakgebied: "jeugd", linkedin: "", bron: "formulier", notitie: "", created_at: "2026-06-11",
    status: "actief", niveau: "medior", huidige_functie: "Jeugdconsulent", huidige_werkgever: "Gemeente Utrecht", beschikbaar_per: "2026-08-01", uren_beschikbaar: 36, tarief_min: 70, tarief_max: 80, salaris_indicatie: null, opleidingsniveau: "HBO Pedagogiek", regio: "Midden-Nederland", talen: "Nederlands, Turks", rijbewijs: true, expertise: ["Jeugdwet", "Gezinsbegeleiding"], rating: 3, laatste_contact: "2026-06-13" },
  { id: "c3", naam: "Lotte Bakker", email: "lotte@example.nl", telefoon: "06-33333333", woonplaats: "Den Haag", vakgebied: "participatie", linkedin: "", bron: "handmatig", notitie: "Beschikbaar per 1 sept.", created_at: "2026-06-10",
    status: "actief", niveau: "senior", huidige_functie: "Klantmanager Participatie", huidige_werkgever: "Gemeente Den Haag", beschikbaar_per: "2026-09-01", uren_beschikbaar: 32, tarief_min: 80, tarief_max: 90, salaris_indicatie: null, opleidingsniveau: "WO Bestuurskunde", regio: "Randstad", talen: "Nederlands, Engels", rijbewijs: true, expertise: ["Participatiewet", "Re-integratie", "Caseload-management"], rating: 5, laatste_contact: "2026-06-15", eigenaar: "demo-user", volgende_actie: "Referenties navragen", volgende_actie_datum: "2026-06-15" },
  { id: "c4", naam: "Youssef El Amrani", email: "youssef@example.nl", telefoon: "06-44444444", woonplaats: "Zwolle", vakgebied: "inkomen", linkedin: "", bron: "formulier", notitie: "", created_at: "2026-06-09",
    status: "actief", niveau: "medior", huidige_functie: "Inkomensconsulent", huidige_werkgever: "Gemeente Zwolle", beschikbaar_per: "2026-07-15", uren_beschikbaar: 36, tarief_min: 68, tarief_max: 78, salaris_indicatie: null, opleidingsniveau: "HBO SJD", regio: "Overijssel", talen: "Nederlands, Arabisch", rijbewijs: true, expertise: ["Bijstand", "Rechtmatigheid"], rating: 3, laatste_contact: "2026-06-12", eigenaar: "demo-user", volgende_actie: "Voorstellen aan Gemeente Zwolle", volgende_actie_datum: "2026-06-17" },
  { id: "c5", naam: "Eva Jansen", email: "eva@example.nl", telefoon: "06-55555555", woonplaats: "Tilburg", vakgebied: "schuld", linkedin: "", bron: "handmatig", notitie: "Ervaren budgetcoach.", created_at: "2026-06-06",
    status: "talentpool", niveau: "lead", huidige_functie: "Teamleider Schuldhulp", huidige_werkgever: "Kredietbank", beschikbaar_per: "2027-01-01", uren_beschikbaar: 24, tarief_min: 95, tarief_max: 110, salaris_indicatie: null, opleidingsniveau: "HBO + leergang schuldhulp", regio: "Noord-Brabant", talen: "Nederlands", rijbewijs: true, expertise: ["Schuldhulpverlening", "Budgetcoaching", "Teamleiding"], rating: 4, laatste_contact: "2026-05-30" },
  { id: "c6", naam: "Daan Visser", email: "daan@example.nl", telefoon: "06-66666666", woonplaats: "Amersfoort", vakgebied: "beleid", linkedin: "", bron: "formulier", notitie: "", created_at: "2026-06-05",
    status: "bemiddeld", niveau: "interim", huidige_functie: "Adviseur Sociaal Domein", huidige_werkgever: "Zelfstandig", beschikbaar_per: "2026-06-01", uren_beschikbaar: 32, tarief_min: 100, tarief_max: 120, salaris_indicatie: null, opleidingsniveau: "WO Bestuurskunde", regio: "Landelijk", talen: "Nederlands, Engels, Duits", rijbewijs: true, expertise: ["Beleidsadvies", "Transformatie sociaal domein", "Programmamanagement"], rating: 5, laatste_contact: "2026-06-07" },
];

export const DEMO_APPLICATIONS: AtsCard[] = [
  { id: "a1", stage: "nieuw", positie: 0, notitie: "", candidate: { id: "c1", naam: "Sanne de Vries", vakgebied: "wmo", woonplaats: "Almere" }, vacature: { titel: "Wmo-consulent" } },
  { id: "a2", stage: "nieuw", positie: 1, notitie: "", candidate: { id: "c2", naam: "Mehmet Yıldız", vakgebied: "jeugd", woonplaats: "Utrecht" }, vacature: { titel: "Jeugdconsulent" } },
  { id: "a3", stage: "kwalificatie", positie: 0, notitie: "", candidate: { id: "c4", naam: "Youssef El Amrani", vakgebied: "inkomen", woonplaats: "Zwolle" }, vacature: { titel: "Inkomensconsulent" } },
  { id: "a4", stage: "kennismaking", positie: 0, notitie: "", candidate: { id: "c3", naam: "Lotte Bakker", vakgebied: "participatie", woonplaats: "Den Haag" }, vacature: { titel: "Klantmanager Participatie" } },
  { id: "a5", stage: "voorgesteld", positie: 0, notitie: "", candidate: { id: "c5", naam: "Eva Jansen", vakgebied: "schuld", woonplaats: "Tilburg" }, vacature: { titel: "Budgetcoach" } },
  { id: "a7", stage: "aanbieding", positie: 0, notitie: "", candidate: { id: "c3", naam: "Lotte Bakker", vakgebied: "participatie", woonplaats: "Den Haag" }, vacature: { titel: "Adviseur Sociaal Domein" } },
  { id: "a6", stage: "geplaatst", positie: 0, notitie: "", candidate: { id: "c6", naam: "Daan Visser", vakgebied: "beleid", woonplaats: "Amersfoort" }, vacature: { titel: "Adviseur Sociaal Domein" } },
];

// ===== Drie losse soorten, voor kandidaten (c..) én bedrijven (co..) =====

// 1) WIJZIGINGSLOG (automatisch herkende gebeurtenissen)
export const DEMO_AUDIT: Record<string, { actie: string; details?: string; user_naam: string; created_at: string }[]> = {
  c1: [
    { actie: "Voorgesteld aan opdrachtgever", details: "Gemeente Almere", user_naam: "Demo-beheerder", created_at: "2026-06-15 14:20" },
    { actie: "Kennismaking", user_naam: "Recruiter Noord", created_at: "2026-06-13 10:05" },
    { actie: "Gesolliciteerd", details: "Wmo-consulent", user_naam: "Sollicitatieformulier", created_at: "2026-06-12 16:40" },
  ],
  c3: [
    { actie: "Aanbod gedaan", details: "Adviseur Sociaal Domein", user_naam: "Demo-beheerder", created_at: "2026-06-15 09:30" },
    { actie: "Voorgesteld aan opdrachtgever", user_naam: "Demo-beheerder", created_at: "2026-06-11 13:00" },
  ],
  co1: [
    { actie: "Gewonnen (opdracht)", details: "Inkomensconsulent", user_naam: "Demo-beheerder", created_at: "2026-06-15 16:10" },
    { actie: "Aanbod gedaan", details: "2 Wmo-consulenten Q3", user_naam: "Recruiter Noord", created_at: "2026-06-10 11:25" },
    { actie: "aangemaakt", details: "Gemeente Almere", user_naam: "Demo-beheerder", created_at: "2026-03-01 10:00" },
  ],
};

// 2) CONTACTMOMENTEN (los, met wie + tekst)
export const DEMO_CONTACT_MOMENTS: Record<string, { type: string; tekst: string; met?: string; created_at: string; gebruiker?: string }[]> = {
  c1: [
    { type: "telefoon", tekst: "Eerste telefonisch contact, enthousiast over interim-opdrachten.", created_at: "2026-06-14", gebruiker: "Demo-beheerder" },
    { type: "gesprek", tekst: "Kennismakingsgesprek gevoerd, sterke indruk.", created_at: "2026-06-13", gebruiker: "Recruiter Noord" },
  ],
  co1: [
    { type: "afspraak", tekst: "Kwartaaloverleg gevoerd over capaciteit Q3.", met: "Karin Bos", created_at: "2026-06-14", gebruiker: "Demo-beheerder" },
    { type: "telefoon", tekst: "Behoefte aan 2 Wmo-consulenten besproken.", met: "Karin Bos", created_at: "2026-06-10", gebruiker: "Recruiter Noord" },
  ],
};

// 3) NOTITIES (snelle losse aantekeningen, eigen balkje + wie)
export const DEMO_NOTES: Record<string, { tekst: string; created_at: string; gebruiker?: string }[]> = {
  c1: [
    { tekst: "Belt liever na 17:00 uur.", created_at: "2026-06-14", gebruiker: "Demo-beheerder" },
    { tekst: "Cv ontvangen via website, past goed op Wmo.", created_at: "2026-06-12", gebruiker: "Demo-beheerder" },
  ],
  co1: [
    { tekst: "Vaste opdrachtgever, korte lijnen.", created_at: "2026-05-02", gebruiker: "Demo-beheerder" },
  ],
};

export const DEMO_POSTS = [
  { id: "p1", titel: "Zo begeleidt Sanne inwoners naar zelfstandigheid", slug: "sanne-wmo", categorie: "Ervaringsverhaal", status: "gepubliceerd", excerpt: "Een dag uit het leven van een Wmo-consulent.", content_html: "<p>Voorbeeldartikel.</p>", updated_at: "2026-06-12" },
  { id: "p2", titel: "5 trends in het sociaal domein voor 2026", slug: "trends-2026", categorie: "Kennis & trends", status: "gepubliceerd", excerpt: "Wat verandert er in het vak?", content_html: "<p>Voorbeeldartikel.</p>", updated_at: "2026-06-08" },
  { id: "p3", titel: "Achter de schermen bij DetaVia", slug: "achter-de-schermen", categorie: "Achter de schermen", status: "concept", excerpt: "Hoe wij matchen.", content_html: "<p>Concept.</p>", updated_at: "2026-06-04" },
];

export const DEMO_VACATURES_ADMIN = [
  { id: "v1", titel: "Wmo-consulent", vakgebied: "wmo", plaats: "Almere", company_id: "co1", status: "open", top: true, uren_min: 32, uren_max: 36, salaris_min: 3300, salaris_max: 4600, type: "Detachering", omschrijving: "", created_at: "2026-06-12" },
  { id: "v4", titel: "Klantmanager Participatie", vakgebied: "participatie", plaats: "Almere", company_id: "co1", status: "open", top: false, uren_min: 32, uren_max: 40, salaris_min: 3300, salaris_max: 4600, type: "Detachering", omschrijving: "", created_at: "2026-06-09" },
  { id: "v2", titel: "Jeugdconsulent", vakgebied: "jeugd", plaats: "Utrecht", company_id: "co2", status: "open", top: true, uren_min: 28, uren_max: 36, salaris_min: 3300, salaris_max: 4600, type: "Detachering", omschrijving: "", created_at: "2026-06-11" },
  { id: "v5", titel: "Adviseur Sociaal Domein", vakgebied: "beleid", plaats: "Rotterdam", company_id: "co3", status: "open", top: false, uren_min: 32, uren_max: 40, salaris_min: 4000, salaris_max: 5800, type: "Detachering", omschrijving: "", created_at: "2026-06-02" },
  { id: "v3", titel: "Budgetcoach", vakgebied: "schuld", plaats: "Tilburg", company_id: null, status: "gesloten", top: false, uren_min: 16, uren_max: 24, salaris_min: 2700, salaris_max: 3700, type: "Detachering", omschrijving: "", created_at: "2026-05-30" },
];

export const DEMO_MESSAGES = [
  { id: "m1", naam: "Gemeente Almere", email: "hr@almere.nl", telefoon: "036-1234567", soort: "opdrachtgever", bericht: "We zoeken twee Wmo-consulenten voor Q3.", gelezen: false, created_at: "2026-06-13" },
  { id: "m2", naam: "Pieter Smit", email: "pieter@example.nl", telefoon: "", soort: "professional", bericht: "Graag een kennismakingsgesprek.", gelezen: true, created_at: "2026-06-10" },
];

export const DEMO_TEAM = [
  { user_id: "demo-user", naam: "Demo-beheerder", role: "super_admin", created_at: "2026-01-01" },
  { user_id: "u2", naam: "Recruiter Noord", role: "recruiter", created_at: "2026-02-01" },
];

// ---------- CRM demo-data ----------
import type { DealCard } from "@/lib/crm";

export const DEMO_COMPANIES = [
  { id: "co1", naam: "Gemeente Almere", type: "gemeente", plaats: "Almere", website: "https://almere.nl", branche: "Lokale overheid", status: "klant", notitie: "Vaste opdrachtgever Wmo & Jeugd.", created_at: "2026-03-01" },
  { id: "co2", naam: "Gemeente Utrecht", type: "gemeente", plaats: "Utrecht", website: "https://utrecht.nl", branche: "Lokale overheid", status: "klant", notitie: "", created_at: "2026-04-10" },
  { id: "co3", naam: "Werk & Inkomen Rijnmond", type: "organisatie", plaats: "Rotterdam", website: "", branche: "Sociaal domein", status: "prospect", notitie: "Eerste kennismaking gehad.", created_at: "2026-05-20" },
  { id: "co4", naam: "Gemeente Zwolle", type: "gemeente", plaats: "Zwolle", website: "https://zwolle.nl", branche: "Lokale overheid", status: "prospect", notitie: "", created_at: "2026-06-01" },
];

export const DEMO_CONTACTS = [
  { id: "ct1", company_id: "co1", naam: "Karin Bos", functie: "Teammanager Wmo", email: "k.bos@almere.nl", telefoon: "036-1112233", linkedin: "" },
  { id: "ct2", company_id: "co1", naam: "Rik van Dijk", functie: "HR-adviseur", email: "r.vandijk@almere.nl", telefoon: "036-1112244", linkedin: "" },
  { id: "ct3", company_id: "co2", naam: "Fatima Haddad", functie: "Manager Sociaal Domein", email: "f.haddad@utrecht.nl", telefoon: "030-2223344", linkedin: "" },
  { id: "ct4", company_id: "co3", naam: "Peter Klein", functie: "Inkoop", email: "p.klein@wir.nl", telefoon: "010-3334455", linkedin: "" },
];

export const DEMO_DEALS: DealCard[] = [
  { id: "d1", stage: "lead", titel: "2 Wmo-consulenten Q3", waarde: 96000, kans: 20, vakgebied: "wmo", company: { naam: "Gemeente Almere" } },
  { id: "d2", stage: "gekwalificeerd", titel: "Jeugdconsulent interim", waarde: 78000, kans: 40, vakgebied: "jeugd", company: { naam: "Gemeente Utrecht" } },
  { id: "d3", stage: "voorstel", titel: "Adviseur Sociaal Domein", waarde: 120000, kans: 60, vakgebied: "beleid", company: { naam: "Werk & Inkomen Rijnmond" } },
  { id: "d4", stage: "onderhandeling", titel: "Klantmanager Participatie", waarde: 88000, kans: 75, vakgebied: "participatie", company: { naam: "Gemeente Utrecht" } },
  { id: "d5", stage: "gewonnen", titel: "Inkomensconsulent", waarde: 72000, kans: 100, vakgebied: "inkomen", company: { naam: "Gemeente Zwolle" } },
];

export const DEMO_DEALS_FULL: Record<string, { contact: string | null; verwachte_sluiting: string | null; notitie: string }> = {
  d1: { contact: "Karin Bos", verwachte_sluiting: "2026-07-15", notitie: "Wacht op formele aanvraag." },
  d3: { contact: "Peter Klein", verwachte_sluiting: "2026-07-01", notitie: "Voorstel verstuurd, follow-up nodig." },
};

// ---------- Facturen (demo) ----------
import type { Invoice } from "@/lib/invoice";
export const DEMO_INVOICES: Invoice[] = [
  { id: "inv1", nummer: "DETA-2026-0001", bedrijf_naam: "Gemeente Zwolle", bedrijf_email: "crediteuren@zwolle.nl", omschrijving: "Detachering: Inkomensconsulent (juni 2026)", bedrag: 7200, btw_pct: 21, status: "concept", factuurdatum: "2026-06-15", vervaldatum: "2026-06-29", created_at: "2026-06-15" },
  { id: "inv2", nummer: "DETA-2026-0002", bedrijf_naam: "Gemeente Almere", bedrijf_email: "crediteuren@almere.nl", omschrijving: "Detachering: Wmo-consulent (mei 2026)", bedrag: 8400, btw_pct: 21, status: "verzonden", factuurdatum: "2026-06-01", vervaldatum: "2026-06-15", created_at: "2026-06-01" },
];

// ---------- Uren-portaal (demo) ----------
// De demo-professional is Daan Visser (c6), geplaatst bij Gemeente Almere.
export const DEMO_PROFESSIONAL_ID = "c6";
export const DEMO_PLACEMENTS = [
  { id: "pl1", candidate_id: "c6", company_id: "co1", company_naam: "Gemeente Almere", functie: "Adviseur Sociaal Domein", uurtarief: 100, kostprijs: 75, start_datum: "2026-06-01", eind_datum: null, status: "actief" },
];
export const DEMO_HOURS = [
  { id: "h1", placement_id: "pl1", datum: "2026-06-15", uren: 8, omschrijving: "Beleidsadvies transformatie", status: "goedgekeurd" },
  { id: "h2", placement_id: "pl1", datum: "2026-06-16", uren: 8, omschrijving: "Overleg projectteam", status: "goedgekeurd" },
  { id: "h3", placement_id: "pl1", datum: "2026-06-17", uren: 6, omschrijving: "Rapportage", status: "ingediend" },
];
