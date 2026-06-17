import { maakNummer, vervaldatumVan, BTW_PCT } from "@/lib/invoice";

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
