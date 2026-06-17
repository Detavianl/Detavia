export const STAGES = [
  { key: "nieuw", label: "Nieuw" },
  { key: "screening", label: "Screening" },
  { key: "gesprek", label: "Gesprek" },
  { key: "voorgesteld", label: "Voorgesteld" },
  { key: "geplaatst", label: "Geplaatst" },
  { key: "afgewezen", label: "Afgewezen" },
] as const;

export type StageKey = (typeof STAGES)[number]["key"];

export const VAKGEBIEDEN: Record<string, string> = {
  wmo: "Wmo", jeugd: "Jeugd", participatie: "Participatie",
  schuld: "Schuldhulpverlening", inkomen: "Inkomen", beleid: "Beleid & Advies",
};

export type AtsCard = {
  id: string;
  stage: StageKey;
  positie: number;
  notitie: string;
  candidate: { id: string; naam: string; vakgebied: string | null; woonplaats: string | null } | null;
  vacature: { titel: string } | null;
};
