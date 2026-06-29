export const STAGES = [
  { key: "nieuw", label: "Nieuw" },
  { key: "kwalificatie", label: "Kwalificatie" },
  { key: "kennismaking", label: "Kennismaking" },
  { key: "voorgesteld", label: "Voorgesteld" },
  { key: "aanbieding", label: "Aanbieding" },
  { key: "geplaatst", label: "Geplaatst" },
  { key: "afgewezen", label: "Afgewezen" },
  { key: "talentpool", label: "Talentpool" },
] as const;

// Mensvriendelijke levenscyclus-gebeurtenis per ATS-fase, voor de wijzigingslog van de kandidaat.
export const CAND_EVENT: Record<string, string> = {
  nieuw: "Nieuwe sollicitatie",
  kwalificatie: "In kwalificatie",
  kennismaking: "Kennismaking",
  voorgesteld: "Voorgesteld aan opdrachtgever",
  aanbieding: "Aanbod gedaan",
  geplaatst: "Geplaatst",
  afgewezen: "Afgewezen",
  talentpool: "Naar talentpool",
};

export const KANDIDAAT_STATUS: Record<string, string> = {
  talentpool: "Talentpool",
  actief: "Actief",
  bemiddeld: "Bemiddeld",
  niet_beschikbaar: "Niet beschikbaar",
};

export const NIVEAUS = ["medior", "senior", "lead", "interim", "executive"];

export type CandidateFull = {
  id: string; naam: string; email: string | null; telefoon: string | null;
  woonplaats: string | null; vakgebied: string | null; linkedin: string | null;
  bron: string; notitie: string; status: string; niveau: string | null;
  huidige_functie: string | null; huidige_werkgever: string | null;
  beschikbaar_per: string | null; uren_beschikbaar: number | null;
  tarief_min: number | null; tarief_max: number | null; salaris_indicatie: string | null;
  opleidingsniveau: string | null; regio: string | null; talen: string | null;
  rijbewijs: boolean; expertise: string[]; rating: number;
  laatste_contact: string | null; created_at: string;
};

export type StageKey = (typeof STAGES)[number]["key"];

export const VAKGEBIEDEN: Record<string, string> = {
  wmo: "Leerplicht", jeugd: "Werk", participatie: "Participatie",
  schuld: "Schuldhulpverlening", inkomen: "Inkomen", beleid: "Inburgering",
};

export type AtsCard = {
  id: string;
  stage: StageKey;
  positie: number;
  notitie: string;
  candidate: { id: string; naam: string; vakgebied: string | null; woonplaats: string | null } | null;
  vacature: { titel: string } | null;
};
