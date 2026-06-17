import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { euro, totalen, STATUS_LABEL, type Invoice } from "@/lib/invoice";
import { isDemo, DEMO_INVOICES } from "@/lib/demo";

export const dynamic = "force-dynamic";

const BADGE: Record<string, string> = {
  concept: "bg-neutral-100 text-muted",
  verzonden: "bg-yellow text-black",
  betaald: "bg-green-100 text-green-700",
};

export default async function FacturenPage() {
  let facturen: Invoice[];
  if (isDemo()) {
    facturen = DEMO_INVOICES;
  } else {
    const supabase = await createClient();
    const { data } = await supabase.from("invoices").select("*").order("created_at", { ascending: false });
    facturen = (data ?? []) as Invoice[];
  }

  const openstaand = facturen.filter((f) => f.status !== "betaald").reduce((a, f) => a + totalen(f).incl, 0);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div><h1 className="display text-3xl">Facturen</h1><p className="mt-1 text-muted">Automatisch aangemaakt bij gewonnen deals.</p></div>
        <div className="rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-right">
          <div className="text-xs font-semibold text-muted">Openstaand</div>
          <div className="text-xl font-extrabold text-cobalt">{euro(openstaand)}</div>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-muted">
            <tr><th className="px-5 py-3">Nummer</th><th className="px-5 py-3">Opdrachtgever</th><th className="px-5 py-3">Datum</th><th className="px-5 py-3">Bedrag (incl.)</th><th className="px-5 py-3">Status</th></tr>
          </thead>
          <tbody>
            {facturen.map((f) => (
              <tr key={f.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                <td className="px-5 py-3"><Link href={`/admin/facturen/${f.id}`} className="font-bold text-cobalt">{f.nummer}</Link></td>
                <td className="px-5 py-3">{f.bedrijf_naam || "—"}</td>
                <td className="px-5 py-3">{f.factuurdatum}</td>
                <td className="px-5 py-3 font-semibold">{euro(totalen(f).incl)}</td>
                <td className="px-5 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-bold ${BADGE[f.status]}`}>{STATUS_LABEL[f.status]}</span></td>
              </tr>
            ))}
            {facturen.length === 0 && <tr><td colSpan={5} className="px-5 py-10 text-center text-muted">Nog geen facturen. Zet een deal op &quot;Gewonnen&quot; om er automatisch een aan te maken.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
