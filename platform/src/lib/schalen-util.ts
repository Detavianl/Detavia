// Pure helpers voor salarisschalen (client- en serverveilig, geen server-imports).

export type Schaal = { schaal: number; trede: number; bruto_maand: number | null };

export const euroMaand = (n: number) =>
  "€ " + n.toLocaleString("nl-NL", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

// Bruto maandbedrag voor een schaal + trede (of null als onbekend).
export function brutoVoor(schalen: Schaal[], schaal: number | string, trede: number | string): number | null {
  const s = Number(schaal), t = Number(trede);
  if (!s || !t) return null;
  return schalen.find((x) => x.schaal === s && x.trede === t)?.bruto_maand ?? null;
}

// Oplopende, unieke schaalnummers.
export function schaalOpties(schalen: Schaal[]): number[] {
  return [...new Set(schalen.map((s) => s.schaal))].sort((a, b) => a - b);
}

// Oplopende tredes die bij een gekozen schaal horen.
export function tredeOpties(schalen: Schaal[], schaal: number | string): number[] {
  const s = Number(schaal);
  return schalen.filter((x) => x.schaal === s).map((x) => x.trede).sort((a, b) => a - b);
}
