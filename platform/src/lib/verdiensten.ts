// Verdeling van de marge per uur tussen DetaVia en de recruiter.
// DetaVia houdt een vaste fee (percentage van de marge), de recruiter krijgt de rest.
export function verdeelMarge(uurtarief: number | null, kostprijs: number | null, feePct: number | null) {
  const tarief = Number(uurtarief ?? 0);
  const kost = Number(kostprijs ?? 0);
  const pct = Number(feePct ?? 31);
  const marge = Math.max(0, tarief - kost);
  const detavia = Math.round(marge * (pct / 100) * 100) / 100;
  const recruiter = Math.round((marge - detavia) * 100) / 100;
  return { marge, detavia, recruiter, pct, kost, tarief };
}

export const euro2 = (n: number) =>
  "€ " + n.toLocaleString("nl-NL", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
