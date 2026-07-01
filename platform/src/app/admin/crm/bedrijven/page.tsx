import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { COMPANY_TYPE, COMPANY_STATUS } from "@/lib/crm";
import { isDemo, DEMO_COMPANIES } from "@/lib/demo";

export const dynamic = "force-dynamic";

export default async function BedrijvenPage() {
  let companies: any[];
  if (isDemo()) companies = DEMO_COMPANIES;
  else { const supabase = await createClient(); const { data } = await supabase.from("companies").select("id, naam, type, plaats, status").order("naam"); companies = data ?? []; }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div><h1 className="display text-3xl">Opdrachtgevers</h1><p className="mt-1 text-muted">{companies.length} opdrachtgevers</p></div>
        <Link href="/admin/crm/bedrijven/nieuw" className="rounded-full bg-cobalt px-5 py-2.5 font-bold text-white">Nieuwe opdrachtgever</Link>
      </div>
      <div className="mt-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-muted">
            <tr><th className="px-5 py-3">Naam</th><th className="px-5 py-3">Type</th><th className="px-5 py-3">Plaats</th><th className="px-5 py-3">Status</th></tr>
          </thead>
          <tbody>
            {companies.map((c) => (
              <tr key={c.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                <td className="px-5 py-3"><Link href={`/admin/crm/bedrijven/${c.id}`} className="font-bold text-cobalt">{c.naam}</Link></td>
                <td className="px-5 py-3">{COMPANY_TYPE[c.type] ?? c.type}</td>
                <td className="px-5 py-3">{c.plaats || "—"}</td>
                <td className="px-5 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-bold ${c.status === "klant" ? "bg-green-100 text-green-700" : c.status === "prospect" ? "bg-yellow text-black" : "bg-neutral-100 text-muted"}`}>{COMPANY_STATUS[c.status] ?? c.status}</span></td>
              </tr>
            ))}
            {companies.length === 0 && <tr><td colSpan={4} className="px-5 py-10 text-center text-muted">Nog geen opdrachtgevers.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
