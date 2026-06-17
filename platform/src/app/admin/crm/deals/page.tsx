import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DealBoard from "@/components/DealBoard";
import { euro, type DealCard } from "@/lib/crm";
import { isDemo, DEMO_DEALS } from "@/lib/demo";

export const dynamic = "force-dynamic";

export default async function DealsPage() {
  let deals: DealCard[];
  if (isDemo()) {
    deals = DEMO_DEALS;
  } else {
    const supabase = await createClient();
    const { data } = await supabase
      .from("deals")
      .select("id, stage, titel, waarde, kans, vakgebied, company:companies(naam)")
      .order("created_at", { ascending: false });
    deals = (data ?? []) as unknown as DealCard[];
  }

  const open = deals.filter((d) => d.stage !== "gewonnen" && d.stage !== "verloren");
  const pipelineWaarde = open.reduce((a, d) => a + (d.waarde ?? 0), 0);
  const gewogen = open.reduce((a, d) => a + ((d.waarde ?? 0) * d.kans) / 100, 0);
  const gewonnen = deals.filter((d) => d.stage === "gewonnen").reduce((a, d) => a + (d.waarde ?? 0), 0);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div><h1 className="display text-3xl">Deals</h1><p className="mt-1 text-muted">Verkooppijplijn voor opdrachten.</p></div>
        <Link href="/admin/crm/deals/nieuw" className="rounded-full bg-cobalt px-5 py-2.5 font-bold text-white">Nieuwe deal</Link>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Kpi label="Open deals" value={open.length} />
        <Kpi label="Pipeline-waarde" value={euro(pipelineWaarde)} accent />
        <Kpi label="Gewogen waarde" value={euro(Math.round(gewogen))} accent />
        <Kpi label="Gewonnen" value={euro(gewonnen)} />
      </div>
      <div className="mt-8"><DealBoard initial={deals} /></div>
    </div>
  );
}

function Kpi({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
      <div className={`text-2xl font-extrabold ${accent ? "text-cobalt" : ""}`}>{value}</div>
      <div className="mt-1 text-sm font-semibold text-muted">{label}</div>
    </div>
  );
}
