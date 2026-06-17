import { maakNummer, vervaldatumVan, BTW_PCT } from "@/lib/invoice";

// Bouwt een conceptfactuur uit goedgekeurde, nog niet-gefactureerde uren van een plaatsing.
// Retourneert het aantal gefactureerde uren (0 = niets te factureren).
export async function createInvoiceFromHours(supabase: any, placementId: string): Promise<number> {
  const { data: pl } = await supabase
    .from("placements")
    .select("functie, uurtarief, company_id, company:companies(naam)")
    .eq("id", placementId).single();
  if (!pl) return 0;

  const { data: uren } = await supabase
    .from("hours")
    .select("id, datum, uren")
    .eq("placement_id", placementId).eq("status", "goedgekeurd").is("invoice_id", null);
  if (!uren || uren.length === 0) return 0;

  const totaalUren = uren.reduce((a: number, h: any) => a + Number(h.uren), 0);
  const data = [...uren].map((h: any) => h.datum).sort();
  const periode = data.length ? `${data[0]} t/m ${data[data.length - 1]}` : "";
  const bedrag = Math.round(totaalUren * (pl.uurtarief ?? 0));

  const { count } = await supabase.from("invoices").select("*", { count: "exact", head: true });
  const jaar = new Date().getFullYear();
  const factuurdatum = new Date().toISOString().slice(0, 10);

  const { data: inv } = await supabase.from("invoices").insert({
    nummer: maakNummer(jaar, (count ?? 0) + 1),
    placement_id: placementId,
    company_id: pl.company_id ?? null,
    bedrijf_naam: pl.company?.naam ?? "",
    omschrijving: `Detachering: ${pl.functie} — ${totaalUren} uur (${periode})`,
    aantal_uren: totaalUren,
    bedrag,
    btw_pct: BTW_PCT,
    status: "concept",
    factuurdatum,
    vervaldatum: vervaldatumVan(factuurdatum),
  }).select("id").single();

  if (inv?.id) {
    await supabase.from("hours").update({ invoice_id: inv.id }).in("id", uren.map((h: any) => h.id));
  }
  return totaalUren;
}

// Maakt automatisch een conceptfactuur bij een gewonnen deal (idempotent).
// Wordt server-side aangeroepen vanuit moveDeal; krijgt de server-supabase mee.
export async function createInvoiceForWonDeal(supabase: any, dealId: string) {
  const { data: existing } = await supabase.from("invoices").select("id").eq("deal_id", dealId).maybeSingle();
  if (existing) return; // al een factuur voor deze deal

  const { data: deal } = await supabase
    .from("deals")
    .select("titel, waarde, company_id, company:companies(naam)")
    .eq("id", dealId)
    .single();
  if (!deal) return;

  const { count } = await supabase.from("invoices").select("*", { count: "exact", head: true });
  const jaar = new Date().getFullYear();
  const factuurdatum = new Date().toISOString().slice(0, 10);

  await supabase.from("invoices").insert({
    nummer: maakNummer(jaar, (count ?? 0) + 1),
    deal_id: dealId,
    company_id: deal.company_id ?? null,
    bedrijf_naam: deal.company?.naam ?? "",
    omschrijving: `Detachering: ${deal.titel}`,
    bedrag: deal.waarde ?? 0,
    btw_pct: BTW_PCT,
    status: "concept",
    factuurdatum,
    vervaldatum: vervaldatumVan(factuurdatum),
  });
}
