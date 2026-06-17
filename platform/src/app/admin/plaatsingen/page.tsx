import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { euro } from "@/lib/crm";
import { isDemo, DEMO_PLACEMENTS, DEMO_CANDIDATES } from "@/lib/demo";

export const dynamic = "force-dynamic";

export default async function PlaatsingenPage() {
  let rows: any[];
  if (isDemo()) {
    const naam = (id: string) => DEMO_CANDIDATES.find((c) => c.id === id)?.naam ?? "—";
    rows = DEMO_PLACEMENTS.map((p) => ({ ...p, kandidaat: naam(p.candidate_id) }));
  } else {
    const supabase = await createClient();
    const { data } = await supabase.from("placements")
      .select("id, functie, uurtarief, kostprijs, status, start_datum, candidate:candidates(naam), company:companies(naam)")
      .order("created_at", { ascending: false });
    rows = (data ?? []).map((p: any) => ({ ...p, kandidaat: p.candidate?.naam ?? "—", company_naam: p.company?.naam ?? "—" }));
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div><h1 className="display text-3xl">Plaatsingen</h1><p className="mt-1 text-muted">Detacheringen met tarief, kostprijs en marge.</p></div>
        <Link href="/admin/plaatsingen/nieuw" className="rounded-full bg-cobalt px-5 py-2.5 font-bold text-white">Nieuwe plaatsing</Link>
      </div>
      <div className="mt-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-muted">
            <tr><th className="px-5 py-3">Professional</th><th className="px-5 py-3">Functie</th><th className="px-5 py-3">Opdrachtgever</th><th className="px-5 py-3">Tarief</th><th className="px-5 py-3">Kostprijs</th><th className="px-5 py-3">Marge</th></tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                <td className="px-5 py-3"><Link href={`/admin/plaatsingen/${p.id}`} className="font-bold text-cobalt">{p.kandidaat}</Link></td>
                <td className="px-5 py-3">{p.functie}</td>
                <td className="px-5 py-3">{p.company_naam}</td>
                <td className="px-5 py-3">{euro(p.uurtarief)}/u</td>
                <td className="px-5 py-3 text-muted">{euro(p.kostprijs)}/u</td>
                <td className="px-5 py-3 font-bold text-cobalt">{euro(p.uurtarief - p.kostprijs)}/u</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={6} className="px-5 py-10 text-center text-muted">Nog geen plaatsingen.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
