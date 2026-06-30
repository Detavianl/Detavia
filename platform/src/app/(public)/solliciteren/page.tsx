import { pageMeta } from "@/lib/seo";
import SollicitatieForm from "@/components/SollicitatieForm";

export const metadata = pageMeta({ title: "Solliciteren", description: "Solliciteer direct of stuur een open sollicitatie naar DetaVia, detachering in het sociaal domein.", path: "/solliciteren" });

export default async function Solliciteren({ searchParams }: { searchParams: Promise<{ titel?: string; vacature_id?: string }> }) {
  const { titel = "", vacature_id = "" } = await searchParams;
  return (
    <>
      {/* HERO */}
      <section className="bg-cobalt text-white">
        <div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-10">
          <p className="text-sm font-semibold opacity-80">Home / Solliciteren</p>
          <h1 className="display mt-3 text-4xl sm:text-6xl">Solliciteer bij DetaVia</h1>
          <p className="mt-5 max-w-[54ch] text-lg font-medium text-white/90">
            {titel ? <>Je solliciteert op <strong>{titel}</strong>. </> : null}
            Laat je gegevens achter en stuur je cv mee, dan nemen we snel persoonlijk contact met je op.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[760px] px-5 py-16 sm:px-10">
        <SollicitatieForm vacatureId={vacature_id} titel={titel} />
      </section>
    </>
  );
}
