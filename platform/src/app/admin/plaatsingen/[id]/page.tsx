import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { euro } from "@/lib/crm";
import PlacementActions from "@/components/PlacementActions";
import QuickNotes from "@/components/QuickNotes";
import { loadNotes } from "@/lib/notes";
import { requireAdmin } from "@/lib/admin-context";
import { isDemo, DEMO_PLACEMENTS, DEMO_HOURS, DEMO_CANDIDATES } from "@/lib/demo";

export const dynamic = "force-dynamic";

const BADGE: Record<string, string> = { ingediend: "bg-yellow text-black", goedgekeurd: "bg-green-100 text-green-700", afgekeurd: "bg-red-100 text-red-700" };

function weekStart(iso: string) {
  const d = new Date(iso + "T00:00:00");
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  return d.toISOString().slice(0, 10);
}

export default async function PlaatsingDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const demo = isDemo();

  let p: any, hours: any[], kandidaat: string, candidateId: string, uitgenodigd: boolean;
  if (demo) {
    p = DEMO_PLACEMENTS.find((x) => x.id === id);
    if (!p) notFound();
    hours = DEMO_HOURS.filter((h) => h.placement_id === id).map((h) => ({ ...h, invoice_id: null }));
    kandidaat = DEMO_CANDIDATES.find((c) => c.id === p.candidate_id)?.naam ?? "—";
    candidateId = p.candidate_id; uitgenodigd = false;
    p.company_naam = p.company_naam ?? "";
  } else {
    const supabase = await createClient();
    const { data } = await supabase.from("placements")
      .select("*, candidate:candidates(id, naam, professional_user_id), company:companies(naam)").eq("id", id).single();
    if (!data) notFound();
    p = { ...data, company_naam: data.company?.naam ?? "" };
    kandidaat = data.candidate?.naam ?? "—"; candidateId = data.candidate?.id; uitgenodigd = !!data.candidate?.professional_user_id;
    const { data: hr } = await supabase.from("hours").select("*").eq("placement_id", id).order("datum");
    hours = hr ?? [];
  }

  const admin = await requireAdmin();
  const notes = demo ? [] : await loadNotes("placement", id);

  const factureerbaar = hours.filter((h) => h.status === "goedgekeurd" && !h.invoice_id);
  const factUren = factureerbaar.reduce((a, h) => a + Number(h.uren), 0);
  const factBedrag = Math.round(factUren * (p.uurtarief ?? 0));

  // groepeer per week
  const weken: Record<string, any[]> = {};
  for (const h of hours) (weken[weekStart(h.datum)] ??= []).push(h);
  const weekKeys = Object.keys(weken).sort().reverse();

  return (
    <div className="p-8">
      <Link href="/admin/plaatsingen" className="text-sm font-semibold text-cobalt">← Plaatsingen</Link>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="display text-3xl">{p.functie}</h1>
          <p className="mt-1 text-muted">{kandidaat} · {p.company_naam}{p.start_datum ? ` · sinds ${p.start_datum}` : ""}</p>
        </div>
        <PlacementActions placementId={id} candidateId={candidateId} uren={factUren} bedrag={factBedrag} uitgenodigd={uitgenodigd} demo={demo} />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Kpi label="Uurtarief" value={`${euro(p.uurtarief)}/u`} />
        <Kpi label="Kostprijs" value={`${euro(p.kostprijs)}/u`} />
        <Kpi label="Marge" value={`${euro((p.uurtarief ?? 0) - (p.kostprijs ?? 0))}/u`} accent />
        <Kpi label="Te factureren" value={`${factUren} uur`} accent />
      </div>

      <div className="mt-8 grid gap-4">
        {weekKeys.map((wk) => {
          const rows = weken[wk];
          const tot = rows.reduce((a: number, h: any) => a + Number(h.uren), 0);
          return (
            <section key={wk} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
              <div className="flex items-center justify-between bg-neutral-50 px-5 py-3">
                <span className="font-bold">Week van {wk}</span>
                <span className="text-sm font-semibold text-muted">{tot} uur</span>
              </div>
              <table className="w-full text-left text-sm">
                <tbody>
                  {rows.sort((a: any, b: any) => a.datum.localeCompare(b.datum)).map((h: any) => (
                    <tr key={h.id} className="border-t border-neutral-100">
                      <td className="px-5 py-2.5">{h.datum}</td>
                      <td className="px-5 py-2.5 font-semibold">{h.uren} uur</td>
                      <td className="px-5 py-2.5 text-muted">{h.omschrijving || "—"}</td>
                      <td className="px-5 py-2.5"><span className={`rounded-full px-2 py-0.5 text-xs font-bold ${BADGE[h.status]}`}>{h.status}</span>{h.invoice_id ? <span className="ml-2 text-xs text-muted">gefactureerd</span> : ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          );
        })}
        {weekKeys.length === 0 && <p className="rounded-2xl border border-neutral-200 bg-white p-6 text-muted">Nog geen uren geregistreerd.</p>}
      </div>

      <p className="mt-6"><a href={`/admin/uren/export?placement=${id}`} className="text-sm font-bold text-cobalt">⬇ Exporteer uren (CSV)</a></p>

      <section className="mt-8 max-w-2xl rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-3 text-lg font-bold">Notities</h2>
        <QuickNotes entity="placement" entityId={id} items={notes} currentUser={admin.naam} demo={demo} />
      </section>
    </div>
  );
}

function Kpi({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return <div className="rounded-2xl border border-neutral-200 bg-white p-5"><div className={`text-xl font-extrabold ${accent ? "text-cobalt" : ""}`}>{value}</div><div className="mt-1 text-sm font-semibold text-muted">{label}</div></div>;
}
