import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import SollicitatieForm from "@/components/SollicitatieForm";
import { loadVacatures } from "@/lib/vacatures";
import { salarisLabel, urenLabel } from "@/lib/vacatures-demo";

export const metadata = pageMeta({ title: "Solliciteren", description: "Solliciteer direct of stuur een open sollicitatie naar DetaVia, detachering in het sociaal domein.", path: "/solliciteren" });

export const dynamic = "force-dynamic";

export default async function Solliciteren({ searchParams }: { searchParams: Promise<{ titel?: string; vacature_id?: string }> }) {
  const { titel = "", vacature_id = "" } = await searchParams;
  const backHref = vacature_id ? `/vacatures/${vacature_id}` : "/vacatures";
  const backLabel = vacature_id ? "Terug naar de vacature" : "Terug naar vacatures";

  // Vacature ophalen om een korte samenvatting boven het formulier te tonen.
  const vac = vacature_id
    ? (await loadVacatures()).find((x) => x.slug === vacature_id || x.id === vacature_id) ?? null
    : null;
  const effTitel = vac?.titel || titel;

  return (
    <>
      {/* HERO */}
      <section className="bg-cobalt text-white">
        <div className="mx-auto max-w-[1180px] px-5 py-14 sm:px-10">
          <Link href={backHref} className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 transition hover:text-white">
            <span aria-hidden>←</span> {backLabel}
          </Link>
          <h1 className="display mt-4 text-4xl sm:text-6xl">Solliciteer bij DetaVia</h1>
          <p className="mt-4 max-w-[54ch] text-lg font-medium text-white/90">Laat je gegevens achter en stuur je cv mee, dan nemen we snel persoonlijk contact met je op.</p>
        </div>
      </section>

      <section className="mx-auto max-w-[760px] px-5 py-16 sm:px-10">
        {vac && (
          <div className="mb-8 rounded-[22px] border border-neutral-200 bg-white p-6 sm:p-7">
            <p className="text-xs font-bold uppercase tracking-[.16em] text-cobalt">Je solliciteert op</p>
            <h2 className="mt-1 text-xl font-bold">{vac.titel}</h2>
            {vac.omschrijving && <p className="mt-2 text-muted">{vac.omschrijving}</p>}
            <dl className="mt-5 grid grid-cols-1 gap-4 border-t border-neutral-100 pt-5 sm:grid-cols-3">
              <div><dt className="text-sm font-bold">Locatie</dt><dd className="mt-0.5 text-sm text-muted">{vac.plaats || "In overleg"}</dd></div>
              <div><dt className="text-sm font-bold">Salaris</dt><dd className="mt-0.5 text-sm text-muted">{salarisLabel(vac.salaris, vac.salaris_periode)}</dd></div>
              <div><dt className="text-sm font-bold">Uren</dt><dd className="mt-0.5 text-sm text-muted">{urenLabel(vac.uren)}</dd></div>
            </dl>
          </div>
        )}
        <SollicitatieForm vacatureId={vacature_id} titel={effTitel} backHref={backHref} backLabel={backLabel} />
      </section>
    </>
  );
}
