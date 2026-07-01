import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { loadOpdrachten, sluitingLabel } from "@/lib/flextender";

export const metadata = pageMeta({ title: "Opdrachten", description: "Actuele inhuuropdrachten in het sociaal domein bij gemeenten en overheidsorganisaties. Reageer eenvoudig via DetaVia.", path: "/opdrachten" });
export const dynamic = "force-dynamic";

export default async function OpdrachtenPage() {
  const opdrachten = await loadOpdrachten();

  return (
    <>
      <section className="bg-cobalt text-white">
        <div className="mx-auto max-w-[1120px] px-5 py-14 sm:px-10">
          <h1 className="display text-4xl sm:text-6xl">Opdrachten in het sociaal domein</h1>
          <p className="mt-4 max-w-[60ch] text-lg font-medium text-white/90">
            Actuele inhuuropdrachten bij gemeenten en overheidsorganisaties. Interesse? Reageer eenvoudig via DetaVia, dan bemiddelen wij voor je.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1120px] px-5 py-14 sm:px-10">
        <p className="text-sm font-semibold text-muted">{opdrachten.length} actuele opdrachten</p>

        {opdrachten.length === 0 ? (
          <p className="mt-8 text-muted">Er staan op dit moment geen opdrachten open. Kom snel weer terug.</p>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {opdrachten.map((o) => (
              <Link key={o.avnummer} href={`/opdrachten/${o.avnummer}`}
                className="group flex flex-col rounded-[22px] border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-cobalt/40 hover:shadow-md">
                <span className="inline-block w-fit rounded-full bg-arctic px-2.5 py-0.5 text-[.7rem] font-bold">Sociaal domein</span>
                <h2 className="mt-3 text-lg font-bold leading-snug group-hover:text-cobalt">{o.opdracht}</h2>
                {o.opdrachtgever && <p className="mt-1 text-sm font-semibold text-muted">{o.opdrachtgever}</p>}
                <div className="mt-4 grid gap-1.5 text-sm text-muted">
                  {o.regio && <Row label="Regio" value={o.regio} />}
                  {o.urenperweek && <Row label="Uren p/w" value={o.urenperweek} />}
                  {o.duur && <Row label="Duur" value={o.duur} />}
                  <Row label="Reageren tot" value={sluitingLabel(o.sluiting_inschrijving)} />
                </div>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-cobalt">Bekijk opdracht <span aria-hidden>→</span></span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[13px]">{label}</span>
      <span className="truncate text-right font-semibold text-ink">{value}</span>
    </div>
  );
}
