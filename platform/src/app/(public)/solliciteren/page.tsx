import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import SollicitatieForm from "@/components/SollicitatieForm";

export const metadata = pageMeta({ title: "Solliciteren", description: "Solliciteer direct of stuur een open sollicitatie naar DetaVia, detachering in het sociaal domein.", path: "/solliciteren" });

export default async function Solliciteren({ searchParams }: { searchParams: Promise<{ titel?: string; vacature_id?: string }> }) {
  const { titel = "", vacature_id = "" } = await searchParams;
  const backHref = vacature_id ? `/vacatures/${vacature_id}` : "/vacatures";
  const backLabel = vacature_id ? "Terug naar de vacature" : "Terug naar vacatures";

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
          {titel && (
            <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold ring-1 ring-white/25">
              Je solliciteert op<span className="font-bold text-yellow">{titel}</span>
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[760px] px-5 py-16 sm:px-10">
        <SollicitatieForm vacatureId={vacature_id} titel={titel} backHref={backHref} backLabel={backLabel} />
      </section>
    </>
  );
}
