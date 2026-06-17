import { createClient } from "@/lib/supabase/server";
import { isDemo, DEMO_HOURS, DEMO_PLACEMENTS, DEMO_CANDIDATES } from "@/lib/demo";
import HoursReviewButtons from "@/components/HoursReviewButtons";

export const dynamic = "force-dynamic";

const BADGE: Record<string, string> = { ingediend: "bg-yellow text-black", goedgekeurd: "bg-green-100 text-green-700", afgekeurd: "bg-red-100 text-red-700" };
const STATUS: Record<string, string> = { ingediend: "Ingediend", goedgekeurd: "Goedgekeurd", afgekeurd: "Afgekeurd" };

export default async function UrenPage() {
  let rows: any[];
  if (isDemo()) {
    const pl = (id: string) => DEMO_PLACEMENTS.find((p) => p.id === id);
    const naam = (cid: string) => DEMO_CANDIDATES.find((c) => c.id === cid)?.naam ?? "—";
    rows = DEMO_HOURS.map((h) => { const p = pl(h.placement_id); return { ...h, professional: p ? naam(p.candidate_id) : "—", functie: p?.functie ?? "" }; });
  } else {
    const supabase = await createClient();
    const { data } = await supabase.from("hours")
      .select("id, datum, uren, omschrijving, status, placement:placements(functie, candidate:candidates(naam))")
      .order("datum", { ascending: false }).limit(100);
    rows = (data ?? []).map((h: any) => ({ ...h, professional: h.placement?.candidate?.naam ?? "—", functie: h.placement?.functie ?? "" }));
  }
  rows.sort((a, b) => (a.status === "ingediend" ? -1 : 1) - (b.status === "ingediend" ? -1 : 1));
  const open = rows.filter((r) => r.status === "ingediend").length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display text-3xl">Uren</h1>
          <p className="mt-1 text-muted">{open} {open === 1 ? "urenregel" : "urenregels"} te beoordelen.</p>
        </div>
        <a href="/admin/uren/export" className="rounded-full border-2 border-neutral-200 bg-white px-5 py-2.5 font-bold hover:border-cobalt">⬇ Exporteer (CSV)</a>
      </div>
      <div className="mt-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-muted">
            <tr><th className="px-5 py-3">Professional</th><th className="px-5 py-3">Datum</th><th className="px-5 py-3">Uren</th><th className="px-5 py-3">Omschrijving</th><th className="px-5 py-3">Status</th><th className="px-5 py-3"></th></tr>
          </thead>
          <tbody>
            {rows.map((h) => (
              <tr key={h.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                <td className="px-5 py-3"><div className="font-bold">{h.professional}</div><div className="text-xs text-muted">{h.functie}</div></td>
                <td className="px-5 py-3">{h.datum}</td>
                <td className="px-5 py-3 font-semibold">{h.uren}</td>
                <td className="px-5 py-3 text-muted">{h.omschrijving || "—"}</td>
                <td className="px-5 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-bold ${BADGE[h.status]}`}>{STATUS[h.status]}</span></td>
                <td className="px-5 py-3 text-right">{h.status === "ingediend" && <HoursReviewButtons id={h.id} />}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={6} className="px-5 py-10 text-center text-muted">Nog geen ingediende uren.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
