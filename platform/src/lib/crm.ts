export const DEAL_STAGES = [
  { key: "lead", label: "Lead" },
  { key: "gekwalificeerd", label: "Gekwalificeerd" },
  { key: "voorstel", label: "Voorstel" },
  { key: "onderhandeling", label: "Onderhandeling" },
  { key: "gewonnen", label: "Gewonnen" },
  { key: "verloren", label: "Verloren" },
] as const;

export type DealStage = (typeof DEAL_STAGES)[number]["key"];

// Mensvriendelijke "klant-gebeurtenis" per dealfase, voor de wijzigingslog van het bedrijf.
export const DEAL_EVENT: Record<string, string> = {
  lead: "Nieuwe lead",
  gekwalificeerd: "Gekwalificeerd",
  voorstel: "Aanbod gedaan",
  onderhandeling: "In onderhandeling",
  gewonnen: "Gewonnen (opdracht)",
  verloren: "Verloren",
};

export const COMPANY_TYPE: Record<string, string> = {
  gemeente: "Gemeente",
  organisatie: "Organisatie",
  overig: "Overig",
};

export const COMPANY_STATUS: Record<string, string> = {
  prospect: "Prospect",
  klant: "Klant",
  inactief: "Inactief",
};

export const VAKGEBIEDEN: Record<string, string> = {
  wmo: "Leerplicht", jeugd: "Werk", participatie: "Participatie",
  schuld: "Schuldhulpverlening", inkomen: "Inkomen", beleid: "Inburgering",
};

export const euro = (n: number | null | undefined) =>
  n == null ? "—" : "€ " + n.toLocaleString("nl-NL");

export type DealCard = {
  id: string;
  stage: DealStage;
  titel: string;
  waarde: number | null;
  kans: number;
  vakgebied: string | null;
  company: { naam: string } | null;
};
