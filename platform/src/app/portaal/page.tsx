import { requireProfessional } from "@/lib/professional-context";
import { createClient } from "@/lib/supabase/server";
import { submitHours, deleteHours } from "./actions";
import { isDemo, DEMO_PLACEMENTS, DEMO_HOURS } from "@/lib/demo";
import DeleteHoursButton from "@/components/DeleteHoursButton";

export const dynamic = "force-dynamic";

const STATUS: Record<string, string> = { ingediend: "Ingediend", goedgekeurd: "Goedgekeurd", afgekeurd: "Afgekeurd" };
const BADGE: Record<string, string> = { ingediend: "bg-yellow text-black", goedgekeurd: "bg-green-100 text-green-700", afgekeurd: "bg-red-100 text-red-700" };

export default async function PortaalDashboard() {
  const prof = await requireProfessional();

  let placements: any[], hours: any[];
  if (isDemo()) {
    placements = DEMO_PLACEMENTS.filter((p) => p.candidate_id === prof.id);
    const ids = placements.map((p) => p.id);
    hours = DEMO_HOURS.filter((h) => ids.includes(h.placement_id));
  } else {
    const supabase = await createClient();
    const { data: pl } = await supabase.from("placements")
      .select("id, functie, status, start_datum, eind_datum, company:companies(naam)")
      .eq("candidate_id", prof.id).eq("status", "actief");
    placements = (pl ?? []).map((p: any) => ({ ...p, company_naam: p.company?.naam ?? "" }));
    const ids = placements.map((p) => p.id);
    const { data: hr } = ids.length
      ? await supabase.from("hours").select("*").in("placement_id", ids).order("datum", { ascending: false })
      : { data: [] };
    hours = hr ?? [];
  }

  const totaal = hours.reduce((a, h) => a + Number(h.uren), 0);
  const goedgekeurd = hours.filter((h) => h.status === "goedgekeurd").reduce((a, h) => a + Number(h.uren), 0);

  return (
    <div>
      <h1 className="display text-3xl">Hoi {prof.naam.split(" ")[0]}</h1>
      <p className="mt-1 text-muted">Registreer hier je gewerkte uren per dag.</p>

      {placements.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 text-muted">Je hebt nog geen actieve plaatsing. Zodra je gekoppeld bent, verschijnt die hier.</p>
      ) : (
        <>
          {/* plaatsing(en) */}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Kpi label="Totaal geregistreerd" value={`${totaal} uur`} />
            <Kpi label="Goedgekeurd" value={`${goedgekeurd} uur`} accent />
            <Kpi label="In behandeling" value={`${totaal - goedgekeurd} uur`} />
          </div>

          {placements.map((p) => (
            <section key={p.id} className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">{p.functie}</h2>
                  <p className="text-sm text-muted">{p.company_naam}{p.start_datum ? ` · sinds ${p.start_datum}` : ""}</p>
                </div>
                <span className="rounded-full bg-arctic px-3 py-1 text-sm font-bold">Actief</span>
              </div>

              {/* uren toevoegen */}
              <form action={submitHours} className="mt-5 grid gap-3 rounded-xl bg-neutral-50 p-4 sm:grid-cols-[140px_100px_1fr_auto] sm:items-end">
                <input type="hidden" name="placement_id" value={p.id} />
                <label className="grid gap-1 text-sm font-bold">Datum<input type="date" name="datum" required className="rounded-lg border-2 border-neutral-200 px-3 py-2 font-normal" /></label>
                <label className="grid gap-1 text-sm font-bold">Uren<input type="number" name="uren" step="0.25" min="0" max="24" required placeholder="8" className="rounded-lg border-2 border-neutral-200 px-3 py-2 font-normal" /></label>
                <label className="grid gap-1 text-sm font-bold">Omschrijving<input name="omschrijving" placeholder="Waar heb je aan gewerkt?" className="rounded-lg border-2 border-neutral-200 px-3 py-2 font-normal" /></label>
                <button className="rounded-full bg-cobalt px-5 py-2.5 font-bold text-white">Indienen</button>
              </form>

              {/* urenlijst */}
              <div className="mt-5 overflow-hidden rounded-xl border border-neutral-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-neutral-50 text-xs uppercase tracking-wide text-muted">
                    <tr><th className="px-4 py-2.5">Datum</th><th className="px-4 py-2.5">Uren</th><th className="px-4 py-2.5">Omschrijving</th><th className="px-4 py-2.5">Status</th><th className="px-4 py-2.5"></th></tr>
                  </thead>
                  <tbody>
                    {hours.filter((h) => h.placement_id === p.id).map((h) => (
                      <tr key={h.id} className="border-t border-neutral-100">
                        <td className="px-4 py-2.5">{h.datum}</td>
                        <td className="px-4 py-2.5 font-semibold">{h.uren}</td>
                        <td className="px-4 py-2.5 text-muted">{h.omschrijving || "—"}</td>
                        <td className="px-4 py-2.5"><span className={`rounded-full px-2 py-0.5 text-xs font-bold ${BADGE[h.status]}`}>{STATUS[h.status]}</span></td>
                        <td className="px-4 py-2.5 text-right">{h.status === "ingediend" && <DeleteHoursButton id={h.id} />}</td>
                      </tr>
                    ))}
                    {hours.filter((h) => h.placement_id === p.id).length === 0 && (
                      <tr><td colSpan={5} className="px-4 py-6 text-center text-muted">Nog geen uren geregistreerd.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </>
      )}
    </div>
  );
}

function Kpi({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return <div className="rounded-2xl border border-neutral-200 bg-white p-5"><div className={`text-2xl font-extrabold ${accent ? "text-cobalt" : ""}`}>{value}</div><div className="mt-1 text-sm font-semibold text-muted">{label}</div></div>;
}
