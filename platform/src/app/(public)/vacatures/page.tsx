import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import VacatureZoeker from "@/components/VacatureZoeker";
import { loadVacatures } from "@/lib/vacatures";
import { loadOpdrachten, sluitingLabel } from "@/lib/flextender";

export const metadata = pageMeta({ title: "Vacatures in het sociaal domein", description: "Bekijk alle openstaande vacatures en opdrachten in het sociaal domein bij DetaVia. Filter op vakgebied, plaats en uren en solliciteer direct.", path: "/vacatures" });
export const dynamic = "force-dynamic";

export default async function VacaturesPage() {
  const [vacatures, opdrachten] = await Promise.all([loadVacatures(), loadOpdrachten()]);
  return (
    <>
      <section className="relative overflow-hidden bg-cobalt text-white">
        <div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-10">
          <p className="text-sm font-semibold opacity-80">Home / Vacatures</p>
          <h1 className="display mt-3 max-w-[20ch] text-4xl sm:text-6xl">Vind jouw opdracht in het sociaal domein</h1>
          <p className="mt-3 text-lg opacity-95">Doorzoek alle openstaande vacatures en filter op vakgebied, plaats en uren.</p>
        </div>
      </section>
      <section className="mx-auto max-w-[1180px] px-5 py-14 sm:px-10">
        <VacatureZoeker vacatures={vacatures} />

        {opdrachten.length > 0 && (
          <div className="mt-16 border-t border-neutral-200 pt-12">
            <h2 className="display text-3xl">Inhuuropdrachten in het sociaal domein</h2>
            <p className="mt-2 max-w-[70ch] text-muted">Actuele opdrachten bij gemeenten en overheidsorganisaties. Interesse? Reageer via DetaVia, dan bemiddelen wij voor je.</p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {opdrachten.map((o) => (
                <Link key={o.avnummer} href={`/vacatures/opdracht/${o.avnummer}`}
                  className="group flex flex-col rounded-[22px] border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-cobalt/40 hover:shadow-md">
                  <span className="inline-block w-fit rounded-full bg-arctic px-2.5 py-0.5 text-[.7rem] font-bold">Inhuuropdracht</span>
                  <h3 className="mt-3 text-lg font-bold leading-snug group-hover:text-cobalt">{o.opdracht}</h3>
                  {o.opdrachtgever && <p className="mt-1 text-sm font-semibold text-muted">{o.opdrachtgever}</p>}
                  <div className="mt-4 grid gap-1.5 text-sm text-muted">
                    {o.regio && <RowKV label="Regio" value={o.regio} />}
                    {o.urenperweek && <RowKV label="Uren p/w" value={o.urenperweek} />}
                    {o.duur && <RowKV label="Duur" value={o.duur} />}
                    <RowKV label="Reageren tot" value={sluitingLabel(o.sluiting_inschrijving)} />
                  </div>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-cobalt">Bekijk opdracht <span aria-hidden>→</span></span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <div className="rounded-[22px] border-[1.5px] border-neutral-200 p-7">
            <h3 className="text-xl font-bold">Niets passends gevonden?</h3>
            <p className="mt-1.5 text-muted">Stuur een open sollicitatie. We denken graag met je mee over wat wél past.</p>
            <a href="/solliciteren" className="mt-4 inline-block rounded-full bg-cobalt px-5 py-2.5 font-bold text-white">Open sollicitatie</a>
          </div>
          <div className="rounded-[22px] bg-neutral-900 p-7 text-white">
            <h3 className="text-xl font-bold">Zoek je juist personeel?</h3>
            <p className="mt-1.5 text-white/80">Ben je opdrachtgever en zoek je een professional in het sociaal domein? Wij denken mee.</p>
            <a href="/voor-opdrachtgevers" className="mt-4 inline-block rounded-full bg-yellow px-5 py-2.5 font-bold text-black">Vraag een professional aan</a>
          </div>
        </div>
      </section>
    </>
  );
}

function RowKV({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[13px]">{label}</span>
      <span className="truncate text-right font-semibold text-ink">{value}</span>
    </div>
  );
}
