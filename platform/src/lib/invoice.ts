// Afzendergegevens van DetaVia (pas aan / vul aan met echte KvK/IBAN/BTW).
export const ISSUER = {
  naam: "DetaVia",
  adres: "Argonweg 72",
  postcode_plaats: "1362 AD Almere",
  email: "[ facturatie@detavia.nl ]",
  kvk: "[ KvK-nummer ]",
  btw: "[ BTW-nummer ]",
  iban: "[ IBAN ]",
  betaaltermijn_dagen: 14,
};

export const BTW_PCT = 21;

export const euro = (n: number) =>
  "€ " + (n ?? 0).toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export type Invoice = {
  id: string;
  nummer: string;
  bedrijf_naam: string;
  bedrijf_email?: string | null;
  omschrijving: string;
  bedrag: number;        // excl. btw
  btw_pct: number;
  status: "concept" | "verzonden" | "betaald";
  factuurdatum: string;
  vervaldatum?: string | null;
  created_at?: string;
};

export function totalen(inv: Pick<Invoice, "bedrag" | "btw_pct">) {
  const excl = inv.bedrag ?? 0;
  const btw = Math.round((excl * (inv.btw_pct ?? BTW_PCT)) / 100);
  return { excl, btw, incl: excl + btw };
}

export const STATUS_LABEL: Record<string, string> = {
  concept: "Concept",
  verzonden: "Verzonden",
  betaald: "Betaald",
};

// Factuurnummer: DETA-JAAR-VOLGNR (volgnr = aantal bestaande facturen + 1)
export function maakNummer(jaar: number, volgnr: number) {
  return `DETA-${jaar}-${String(volgnr).padStart(4, "0")}`;
}

export function vervaldatumVan(factuurdatum: string, dagen = ISSUER.betaaltermijn_dagen) {
  const d = new Date(factuurdatum + "T00:00:00");
  d.setDate(d.getDate() + dagen);
  return d.toISOString().slice(0, 10);
}
