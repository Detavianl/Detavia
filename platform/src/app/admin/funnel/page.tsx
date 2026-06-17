import { createClient } from "@/lib/supabase/server";
import { STAGES } from "@/lib/ats";
import { isDemo } from "@/lib/demo";
import { demoApplications } from "@/lib/demo-store";

export const dynamic = "force-dynamic";

// Actieve funnel-volgorde (zij-states los getoond)
const FUNNEL = ["nieuw", "kwalificatie", "kennismaking", "voorgesteld", "aanbieding", "geplaatst"];
const label = (k: string) => STAGES.find((s) => s.key === k)?.label ?? k;

type Row = { stage: string; stage_changed_at?: string | null };

export default async function FunnelPage() {
  let rows: Row[];
  let dagenInFase: Record<string, number>;

  if (isDemo()) {
    rows = demoApplications().map((a) => ({ stage: a.stage }));
    dagenInFase = { nieuw: 2, kwalificatie: 5, kennismaking: 8, voorgesteld: 6, aanbieding: 4, geplaatst: 0 };
  } else {
    const supabase = await createClient();
    const { data } = await supabase.from("applications").select("stage, stage_changed_at");
    rows = data ?? [];
    const now = Date.now();
    const acc: Record<string, { sum: number; n: number }> = {};
    for (const r of rows) {
      if (!r.stage_changed_at) continue;
      const d = Math.max(0, Math.round((now - new Date(r.stage_changed_at).getTime()) / 86400000));
      (acc[r.stage] ??= { sum: 0, n: 0 });
      acc[r.stage].sum += d; acc[r.stage].n += 1;
    }
    dagenInFase = Object.fromEntries(Object.entries(acc).map(([k, v]) => [k, v.n ? Math.round(v.sum / v.n) : 0]));
  }

  const count = (k: string) => rows.filter((r) => r.stage === k).length;
  const funnelCounts = FUNNEL.map((k) => ({ k, n: count(k) }));
  const max = Math.max(1, ...funnelCounts.map((f) => f.n));
  const totaal = rows.length;
  const geplaatst = count("geplaatst");
  const afgewezen = count("afgewezen");
  const talentpool = count("talentpool");
  const conversie = totaal ? Math.round((geplaatst / totaal) * 100) : 0;

  return (
    <div className="p-8">
      <h1 className="display text-3xl">Funnel</h1>
      <p className="mt-1 text-muted">Conversie en doorlooptijd door de pijplijn.{isDemo() && " (demo-cijfers)"}</p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Kpi label="In de funnel" value={totaal} />
        <Kpi label="Geplaatst" value={geplaatst} accent />
        <Kpi label="Conversie naar plaatsing" value={`${conversie}%`} accent />
        <Kpi label="In talentpool" value={talentpool} />
      </div>

      <section className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-5 text-lg font-bold">Funnel per fase</h2>
        <div className="grid gap-3">
          {funnelCounts.map((f, i) => {
            const prev = i > 0 ? funnelCounts[i - 1].n : f.n;
            const stap = prev ? Math.round((f.n / prev) * 100) : 100;
            return (
              <div key={f.k} className="flex items-center gap-4">
                <span className="w-32 shrink-0 text-sm font-semibold">{label(f.k)}</span>
                <div className="h-8 flex-1 overflow-hidden rounded-lg bg-neutral-100">
                  <div className="flex h-full items-center justify-end rounded-lg bg-cobalt px-3 text-sm font-bold text-white"
                       style={{ width: `${Math.max(8, (f.n / max) * 100)}%` }}>{f.n}</div>
                </div>
                <span className="w-24 shrink-0 text-right text-sm text-muted">{i === 0 ? "—" : `${stap}% stap`}</span>
                <span className="w-28 shrink-0 text-right text-sm text-muted">~{dagenInFase[f.k] ?? 0} dgn in fase</span>
              </div>
            );
          })}
        </div>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Kpi label="Afgewezen" value={afgewezen} />
        <Kpi label="Gem. doorlooptijd tot plaatsing" value={isDemo() ? "~25 dgn" : "—"} />
      </div>
    </div>
  );
}

function Kpi({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6">
      <div className={`text-3xl font-extrabold ${accent ? "text-cobalt" : ""}`}>{value}</div>
      <div className="mt-1 text-sm font-semibold text-muted">{label}</div>
    </div>
  );
}
