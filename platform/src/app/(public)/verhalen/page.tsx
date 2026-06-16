import Link from "next/link";

// Wordt later uit de database (blog_posts) geladen via Supabase.
const demo = [
  { cat: "Ervaringsverhaal", titel: "Binnenkort: het eerste verhaal", img: "/img/smiling-woman-600x600.jpg" },
  { cat: "Kennis & trends", titel: "Binnenkort: een inzicht uit het vak", img: "/img/office-worker-960x640.jpg" },
  { cat: "Achter de schermen", titel: "Binnenkort: een kijkje bij DetaVia", img: "/img/wit_overhemd.png" },
];

export const metadata = { title: "Verhalen & blog | DetaVia" };

export default function Verhalen() {
  return (
    <>
      <section className="relative overflow-hidden bg-arctic">
        <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-10">
          <p className="text-sm font-semibold opacity-70">Home / Verhalen</p>
          <h1 className="display mt-3 text-4xl sm:text-6xl">Verhalen uit het sociaal domein</h1>
          <p className="mt-4 max-w-[54ch] text-lg">Ervaringen van onze professionals, praktijkverhalen en inzichten die het vak vooruit helpen.</p>
        </div>
      </section>
      <section className="mx-auto max-w-[1180px] px-5 py-20 sm:px-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {demo.map((p) => (
            <Link key={p.titel} href="/verhalen" className="flex flex-col overflow-hidden rounded-[22px] border-[1.5px] border-neutral-200 transition hover:-translate-y-1 hover:shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.img} alt="" className="aspect-[16/10] w-full object-cover" />
              <div className="flex flex-1 flex-col gap-2.5 p-6">
                <span className="text-xs font-bold uppercase tracking-wider text-cobalt">{p.cat}</span>
                <h3 className="text-xl font-bold leading-tight">{p.titel}</h3>
              </div>
            </Link>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted opacity-80">Artikelen worden straks vanuit het beheer (blog) geplaatst en hier automatisch getoond.</p>
      </section>
    </>
  );
}
