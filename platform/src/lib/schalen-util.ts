// Pure helpers voor de salaristredes-tabel (client- en serverveilig).

export type Trede = {
  trede: number;
  maandsalaris: number | null;
  vakantiegeld: number | null;
  eindejaarsuitkering: number | null;
  totaal_bruto: number | null;
  werkgeverslasten: number | null;
  totale_kosten: number | null;
  inkooptarief_uur: number | null;
};

export const euroMaand = (n: number) =>
  "€ " + n.toLocaleString("nl-NL", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export const euroUur = (n: number) =>
  "€ " + n.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Oplopende trede-nummers.
export function tredeOpties(tredes: Trede[]): number[] {
  return tredes.map((t) => t.trede).sort((a, b) => a - b);
}

// De volledige rij voor een trede (of null).
export function tredeInfo(tredes: Trede[], trede: number | string): Trede | null {
  const t = Number(trede);
  if (!Number.isFinite(t)) return null;
  return tredes.find((x) => x.trede === t) ?? null;
}

// De vaste kolommen van de salaristabel (voor de beheerpagina en het plakken).
export const TREDE_KOLOMMEN: { key: keyof Trede; label: string; int?: boolean }[] = [
  { key: "trede", label: "Trede", int: true },
  { key: "maandsalaris", label: "Maandsalaris bruto (€)" },
  { key: "vakantiegeld", label: "Vakantiegeld (€/mnd)" },
  { key: "eindejaarsuitkering", label: "Eindejaarsuitkering (€/mnd)" },
  { key: "totaal_bruto", label: "Totaal bruto incl. toeslagen (€)" },
  { key: "werkgeverslasten", label: "Werkgeverslasten (€/mnd)" },
  { key: "totale_kosten", label: "Totale kosten p/m (€)" },
  { key: "inkooptarief_uur", label: "Inkooptarief per uur (€)" },
];
