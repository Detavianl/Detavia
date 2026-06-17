import { requireClient } from "@/lib/client-context";
import { createClient } from "@/lib/supabase/server";
import { isDemo, DEMO_PLACEMENTS, DEMO_HOURS, DEMO_CANDIDATES } from "@/lib/demo";
import ClientHoursButtons from "@/components/ClientHoursButtons";

export const dynamic = "force-dynamic";

const BADGE: Record<string, string> = { ingediend: "bg-yellow text-black", goedgekeurd: "bg-green-100 text-green-700", afgekeurd: "bg-red-100 text-red-700" };
const STATUS: Record<string, string> = { ingediend: "Ingediend", goedgekeurd: "Goedgekeurd", afgekeurd: "Afgekeurd" };

export default async function OpdrachtgeverDashboard() {
  const client = await requireClient();
  const demo = isDemo();

  let placements: any[], hours: any[];
  if (demo) {
    placements = DEMO_PLACEMENTS.filter((p) => p.company_id === client.companyId)
      .map((p) => ({ ...p, professional: DEMO_CANDIDATES.find((c) => c.id === p.candidate_id)?.naam ?? "—" }));
    const ids = placements.map((p) => p.id);
    hours = DEMO_HOURS.filter((h) => ids.includes(h.placement_id))
      .map((h) => ({ ...h, professional: placements.find((p) => p.id === h.placement_id)?.professional ?? "—" }));
  } else {
    const supabase = await createClient();
    const { data: pl } = await supabase.from("placements")
      .select("id, functie, candidate:candidates(naam)").eq("company_id", client.companyId).eq("status", "actief");
    placements = (pl ?? []).map((p: any) => ({ ...p, professional: p.candidate?.naam ?? "—" }));
    const ids = placements.map((p) => p.id);
    const { data: hr } = ids.length
      ? await supabase.from("hours").select("id, placement_id, datum, uren, omschrijving, status").in("placement_id", ids).order("datum", { ascending: false })
      : { data: [] };
    hours = (hr ?? []).map((h: any) => ({ ...h, professional: placements.find((p) => p.id === h.placement_id)?.professional ?? "—" }));
  }

  const teBeoordelen = hours.filter((h) => h.status === "ingediend");

  return (
    <div>
      <h1 className="display text-3xl">Welkom, {client.contactNaam.split(" ")[0]}</h1>
      <p className="mt-1 text-muted">Keur de uren goed van de professionals die via DetaVia bij {client.companyNaam} werken.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Kpi label="Professionals" value={String(placements.length)} />
        <Kpi label="Te beoordelen" value={String(teBeoordelen.length)} accent />
        <Kpi label="Uren deze periode" value={`${hours.reduce((a, h) => a + Number(h.uren), 0)}`} />
      </div>

      {placements.map((p) => (
        <section key={p.id} className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <div className="flex items-center justify-between bg-neutral-50 px-5 py-3">
            <div><span className="font-bold">{p.professional}</span><span className="ml-2 text-sm text-muted">{p.functie}</span></div>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-muted"><tr><th className="px-5 py-2.5">Datum</th><th className="px-5 py-2.5">Uren</th><th className="px-5 py-2.5">Omschrijving</th><th className="px-5 py-2.5">Status</th><th className="px-5 py-2.5"></th></tr></thead>
            <tbody>
              {hours.filter((h) => h.placement_id === p.id).map((h) => (
                <tr key={h.id} className="border-t border-neutral-100">
                  <td className="px-5 py-2.5">{h.datum}</td>
                  <td className="px-5 py-2.5 font-semibold">{h.uren} uur</td>
                  <td className="px-5 py-2.5 text-muted">{h.omschrijving || "—"}</td>
                  <td className="px-5 py-2.5"><span className={`rounded-full px-2 py-0.5 text-xs font-bold ${BADGE[h.status]}`}>{STATUS[h.status]}</span></td>
                  <td className="px-5 py-2.5 text-right">{h.status === "ingediend" && <ClientHoursButtons id={h.id} demo={demo} />}</td>
                </tr>
              ))}
              {hours.filter((h) => h.placement_id === p.id).length === 0 && <tr><td colSpan={5} className="px-5 py-6 text-center text-muted">Nog geen uren ingediend.</td></tr>}
            </tbody>
          </table>
        </section>
      ))}
      {placements.length === 0 && <p className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 text-muted">Er zijn nog geen professionals via DetaVia bij jullie geplaatst.</p>}
    </div>
  );
}

function Kpi({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return <div className="rounded-2xl border border-neutral-200 bg-white p-5"><div className={`text-2xl font-extrabold ${accent ? "text-cobalt" : ""}`}>{value}</div><div className="mt-1 text-sm font-semibold text-muted">{label}</div></div>;
}
