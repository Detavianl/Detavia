import VacatureZoeker from "@/components/VacatureZoeker";
import { DEMO_VACATURES } from "@/lib/vacatures-demo";

export const metadata = { title: "Vacatures in het sociaal domein | DetaVia" };

// Later: vacatures uit Supabase laden i.p.v. de demo-set.
export default function VacaturesPage() {
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
        <VacatureZoeker vacatures={DEMO_VACATURES} />
      </section>
    </>
  );
}
