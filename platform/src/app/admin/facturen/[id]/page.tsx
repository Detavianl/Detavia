import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { euro, totalen, STATUS_LABEL, ISSUER, type Invoice } from "@/lib/invoice";
import InvoiceActions from "@/components/InvoiceActions";
import { isDemo, DEMO_INVOICES } from "@/lib/demo";

export const dynamic = "force-dynamic";

export default async function FactuurDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const demo = isDemo();

  let inv: Invoice | null;
  if (demo) {
    inv = DEMO_INVOICES.find((x) => x.id === id) ?? null;
  } else {
    const supabase = await createClient();
    const { data } = await supabase.from("invoices").select("*").eq("id", id).single();
    inv = (data as Invoice) ?? null;
  }
  if (!inv) notFound();
  const t = totalen(inv);

  return (
    <div className="p-8">
      <Link href="/admin/facturen" className="text-sm font-semibold text-cobalt">← Facturen</Link>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="display text-3xl">{inv.nummer}</h1>
          <span className="rounded-full bg-yellow px-3 py-1 text-sm font-bold">{STATUS_LABEL[inv.status]}</span>
        </div>
        <InvoiceActions id={inv.id} status={inv.status} demo={demo} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Samenvatting */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Info label="Opdrachtgever" value={inv.bedrijf_naam} />
            <Info label="E-mail" value={inv.bedrijf_email ?? "—"} />
            <Info label="Factuurdatum" value={inv.factuurdatum} />
            <Info label="Vervaldatum" value={inv.vervaldatum ?? "—"} />
          </div>
          <table className="mt-6 w-full text-sm">
            <thead><tr className="border-b border-neutral-200 text-xs uppercase tracking-wide text-muted">
              <th className="py-2 text-left">Omschrijving</th><th className="py-2 text-right">Bedrag</th></tr></thead>
            <tbody>
              <tr className="border-b border-neutral-100"><td className="py-3">{inv.omschrijving}</td><td className="py-3 text-right">{euro(inv.bedrag)}</td></tr>
            </tbody>
          </table>
          <div className="ml-auto mt-4 grid w-64 gap-1 text-sm">
            <Row k="Subtotaal" v={euro(t.excl)} />
            <Row k={`Btw ${inv.btw_pct}%`} v={euro(t.btw)} />
            <div className="mt-1 border-t border-neutral-200 pt-2"><Row k="Totaal" v={euro(t.incl)} strong /></div>
          </div>
        </section>

        {/* Betaal + verzend */}
        <aside className="flex flex-col gap-6">
          <section className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="mb-2 text-lg font-bold">Verzenden</h2>
            <p className="text-sm text-muted">De factuur wordt straks als PDF naar de opdrachtgever gemaild. De verzendomgeving is klaar om te koppelen aan <strong>Resend</strong> (e-mail met PDF-bijlage).</p>
            {demo && <p className="mt-2 text-xs text-muted">Demo: versturen/markeren wordt niet bewaard.</p>}
          </section>
          <section className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm">
            <h2 className="mb-2 text-lg font-bold">Afzender</h2>
            <p className="font-semibold">{ISSUER.naam}</p>
            <p className="text-muted">{ISSUER.adres}, {ISSUER.postcode_plaats}</p>
            <p className="text-muted">KvK {ISSUER.kvk} · BTW {ISSUER.btw}</p>
            <p className="text-muted">IBAN {ISSUER.iban}</p>
          </section>
        </aside>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-xs uppercase tracking-wide text-muted">{label}</dt><dd className="font-semibold">{value}</dd></div>;
}
function Row({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return <div className="flex justify-between"><span className={strong ? "font-bold" : ""}>{k}</span><span className={strong ? "font-bold text-cobalt" : ""}>{v}</span></div>;
}
