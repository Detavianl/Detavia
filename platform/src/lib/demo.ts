import type { AtsCard } from "@/lib/ats";

// Demo-modus actief zolang Supabase niet gekoppeld is (of expliciet via env).
export function isDemo(): boolean {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !key || key === "replace-me" || process.env.DETAVIA_DEMO === "1";
}

export const DEMO_ADMIN = {
  user_id: "demo-user",
  naam: "Demo-beheerder",
  role: "super_admin" as const,
  email: "demo@detavia.nl",
};

export const DEMO_CANDIDATES = [
  { id: "c1", naam: "Sanne de Vries", email: "sanne@example.nl", telefoon: "06-11111111", woonplaats: "Almere", vakgebied: "wmo", linkedin: "https://linkedin.com/in/demo", bron: "formulier", notitie: "Sterke gesprekstechniek.", created_at: "2026-06-12" },
  { id: "c2", naam: "Mehmet Yıldız", email: "mehmet@example.nl", telefoon: "06-22222222", woonplaats: "Utrecht", vakgebied: "jeugd", linkedin: "", bron: "formulier", notitie: "", created_at: "2026-06-11" },
  { id: "c3", naam: "Lotte Bakker", email: "lotte@example.nl", telefoon: "06-33333333", woonplaats: "Den Haag", vakgebied: "participatie", linkedin: "", bron: "handmatig", notitie: "Beschikbaar per 1 sept.", created_at: "2026-06-10" },
  { id: "c4", naam: "Youssef El Amrani", email: "youssef@example.nl", telefoon: "06-44444444", woonplaats: "Zwolle", vakgebied: "inkomen", linkedin: "", bron: "formulier", notitie: "", created_at: "2026-06-09" },
  { id: "c5", naam: "Eva Jansen", email: "eva@example.nl", telefoon: "06-55555555", woonplaats: "Tilburg", vakgebied: "schuld", linkedin: "", bron: "handmatig", notitie: "Ervaren budgetcoach.", created_at: "2026-06-06" },
  { id: "c6", naam: "Daan Visser", email: "daan@example.nl", telefoon: "06-66666666", woonplaats: "Amersfoort", vakgebied: "beleid", linkedin: "", bron: "formulier", notitie: "", created_at: "2026-06-05" },
];

export const DEMO_APPLICATIONS: AtsCard[] = [
  { id: "a1", stage: "nieuw", positie: 0, notitie: "", candidate: { id: "c1", naam: "Sanne de Vries", vakgebied: "wmo", woonplaats: "Almere" }, vacature: { titel: "Wmo-consulent" } },
  { id: "a2", stage: "nieuw", positie: 1, notitie: "", candidate: { id: "c2", naam: "Mehmet Yıldız", vakgebied: "jeugd", woonplaats: "Utrecht" }, vacature: { titel: "Jeugdconsulent" } },
  { id: "a3", stage: "screening", positie: 0, notitie: "", candidate: { id: "c4", naam: "Youssef El Amrani", vakgebied: "inkomen", woonplaats: "Zwolle" }, vacature: { titel: "Inkomensconsulent" } },
  { id: "a4", stage: "gesprek", positie: 0, notitie: "", candidate: { id: "c3", naam: "Lotte Bakker", vakgebied: "participatie", woonplaats: "Den Haag" }, vacature: { titel: "Klantmanager Participatie" } },
  { id: "a5", stage: "voorgesteld", positie: 0, notitie: "", candidate: { id: "c5", naam: "Eva Jansen", vakgebied: "schuld", woonplaats: "Tilburg" }, vacature: { titel: "Budgetcoach" } },
  { id: "a6", stage: "geplaatst", positie: 0, notitie: "", candidate: { id: "c6", naam: "Daan Visser", vakgebied: "beleid", woonplaats: "Amersfoort" }, vacature: { titel: "Adviseur Sociaal Domein" } },
];

export const DEMO_POSTS = [
  { id: "p1", titel: "Zo begeleidt Sanne inwoners naar zelfstandigheid", slug: "sanne-wmo", categorie: "Ervaringsverhaal", status: "gepubliceerd", excerpt: "Een dag uit het leven van een Wmo-consulent.", content_html: "<p>Voorbeeldartikel.</p>", updated_at: "2026-06-12" },
  { id: "p2", titel: "5 trends in het sociaal domein voor 2026", slug: "trends-2026", categorie: "Kennis & trends", status: "gepubliceerd", excerpt: "Wat verandert er in het vak?", content_html: "<p>Voorbeeldartikel.</p>", updated_at: "2026-06-08" },
  { id: "p3", titel: "Achter de schermen bij DetaVia", slug: "achter-de-schermen", categorie: "Achter de schermen", status: "concept", excerpt: "Hoe wij matchen.", content_html: "<p>Concept.</p>", updated_at: "2026-06-04" },
];

export const DEMO_VACATURES_ADMIN = [
  { id: "v1", titel: "Wmo-consulent", vakgebied: "wmo", plaats: "Almere", status: "open", top: true, uren_min: 32, uren_max: 36, salaris_min: 3300, salaris_max: 4600, type: "Detachering", omschrijving: "", created_at: "2026-06-12" },
  { id: "v2", titel: "Jeugdconsulent", vakgebied: "jeugd", plaats: "Amsterdam", status: "open", top: true, uren_min: 28, uren_max: 36, salaris_min: 3300, salaris_max: 4600, type: "Detachering", omschrijving: "", created_at: "2026-06-11" },
  { id: "v3", titel: "Budgetcoach", vakgebied: "schuld", plaats: "Tilburg", status: "gesloten", top: false, uren_min: 16, uren_max: 24, salaris_min: 2700, salaris_max: 3700, type: "Detachering", omschrijving: "", created_at: "2026-05-30" },
];

export const DEMO_MESSAGES = [
  { id: "m1", naam: "Gemeente Almere", email: "hr@almere.nl", telefoon: "036-1234567", soort: "opdrachtgever", bericht: "We zoeken twee Wmo-consulenten voor Q3.", gelezen: false, created_at: "2026-06-13" },
  { id: "m2", naam: "Pieter Smit", email: "pieter@example.nl", telefoon: "", soort: "professional", bericht: "Graag een kennismakingsgesprek.", gelezen: true, created_at: "2026-06-10" },
];

export const DEMO_TEAM = [
  { user_id: "demo-user", naam: "Demo-beheerder", role: "super_admin", created_at: "2026-01-01" },
  { user_id: "u2", naam: "Recruiter Noord", role: "recruiter", created_at: "2026-02-01" },
];
