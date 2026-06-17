import VacatureZoeker from "@/components/VacatureZoeker";
import { DEMO_VACATURES, type Vacature } from "@/lib/vacatures-demo";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Vacatures in het sociaal domein | DetaVia" };
export const dynamic = "force-dynamic";

async function loadVacatures(): Promise<Vacature[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("vacatures").select("*").eq("status", "open").order("created_at", { ascending: false });
    if (!data || data.length === 0) return DEMO_VACATURES; // fallback zolang DB leeg/niet gekoppeld
    return data.map((v: any) => ({
      id: v.id, titel: v.titel, vakgebied: v.vakgebied, plaats: v.plaats,
      uren: [v.uren_min, v.uren_max], salaris: [v.salaris_min ?? 0, v.salaris_max ?? 0],
      type: v.type, top: v.top, datum: (v.created_at ?? "").slice(0, 10), omschrijving: v.omschrijving,
    }));
  } catch {
    return DEMO_VACATURES;
  }
}

export default async function VacaturesPage() {
  const vacatures = await loadVacatures();
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
