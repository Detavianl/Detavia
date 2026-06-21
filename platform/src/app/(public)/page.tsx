import Link from "next/link";
import OpdrachtgeverMarquee from "@/components/OpdrachtgeverMarquee";
import { loadVacatures } from "@/lib/vacatures";
import { VAKGEBIEDEN } from "@/lib/vacatures-demo";

export const metadata = {
  title: "Detacheren in het sociaal domein",
  description:
    "DetaVia verbindt professionals in Wmo, Jeugd, Participatie en Schuldhulpverlening met opdrachten die passen. Bekijk vacatures of vraag een professional aan.",
  alternates: { canonical: "/" },
};
export const dynamic = "force-dynamic";

export default async function Home() {
  const alle = await loadVacatures();
  const featured = [...alle].sort((a, b) => Number(b.top) - Number(a.top)).slice(0, 3);
  return (
    <>
      {/* HERO */}
      <section className="bg-yellow">
        <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-10 px-5 py-16 sm:px-10 md:grid-cols-[1.15fr_.85fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] opacity-60">Specialist in het sociaal domein</p>
            <h1 className="display mt-3 text-4xl sm:text-6xl">De betrouwbare partner in jouw carrièregroei</h1>
            <p className="mt-6 max-w-[42ch] text-lg font-medium">Werken waar het écht telt. DetaVia verbindt professionals in het sociaal domein met opdrachten die passen bij wie je bent, en bij wie je wilt worden.</p>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <Link href="/vacatures" className="rounded-full bg-black px-6 py-3.5 font-bold text-white">Bekijk vacatures</Link>
              <Link href="/voor-opdrachtgevers" className="rounded-full border-2 border-black px-6 py-3.5 font-bold">Vraag een professional aan</Link>
            </div>
          </div>
          <div className="order-first md:order-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/smiling-woman-600x600.jpg" alt="Professional in het sociaal domein"
                 className="aspect-[4/5] w-full rounded-[22px] object-cover shadow-2xl" />
          </div>
        </div>
      </section>

      {/* DOELGROEP-KEUZE */}
      <section className="mx-auto -mt-8 max-w-[1180px] px-5 sm:px-10">
        <div className="grid gap-5 md:grid-cols-2">
          <Link href="/vacatures" className="group flex items-center justify-between gap-4 rounded-[22px] border-[1.5px] border-neutral-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-cobalt">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.16em] text-cobalt">Ik zoek werk</p>
              <h3 className="mt-1 text-2xl font-bold">Vind jouw volgende opdracht</h3>
              <p className="mt-1 text-muted">Bekijk de vacatures in het sociaal domein en solliciteer direct.</p>
            </div>
            <span className="shrink-0 rounded-full bg-cobalt px-4 py-3 font-bold text-white transition group-hover:translate-x-1">→</span>
          </Link>
          <Link href="/voor-opdrachtgevers" className="group flex items-center justify-between gap-4 rounded-[22px] bg-cobalt p-7 text-white shadow-sm transition hover:-translate-y-1">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.16em] text-arctic">Ik zoek personeel</p>
              <h3 className="mt-1 text-2xl font-bold">Vraag een professional aan</h3>
              <p className="mt-1 text-white/85">Snel de juiste mensen in het sociaal domein, zonder gedoe.</p>
            </div>
            <span className="shrink-0 rounded-full bg-yellow px-4 py-3 font-bold text-black transition group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </section>

      {/* OPDRACHTGEVERS (bewegende logobalk) */}
      <OpdrachtgeverMarquee />

      {/* UITGELICHTE VACATURES */}
      <section className="mx-auto max-w-[1180px] px-5 py-20 sm:px-10">
        <div className="mb-11 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] opacity-60">Uitgelichte vacatures</p>
            <h2 className="display text-3xl sm:text-4xl">Opdrachten met impact</h2>
          </div>
          <Link href="/vacatures" className="rounded-full bg-cobalt px-6 py-3.5 font-bold text-white">Bekijk alle vacatures</Link>
        </div>
        {featured.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((v) => (
              <Link key={v.id} href={`/vacatures/${v.slug ?? v.id}`} className="flex min-h-[210px] flex-col gap-2.5 rounded-[22px] border-[1.5px] border-neutral-200 p-7 transition hover:-translate-y-1 hover:border-cobalt">
                <span className="self-start rounded-full bg-yellow px-3 py-1 text-xs font-bold">{VAKGEBIEDEN[v.vakgebied] ?? v.vakgebied}</span>
                <h3 className="mt-1.5 text-xl font-bold">{v.titel}</h3>
                <p className="text-sm font-semibold text-muted">{v.plaats} · {v.uren[0]}-{v.uren[1]} uur</p>
                <p className="flex-1 text-[.96rem] text-muted">{v.omschrijving}</p>
                <span className="font-bold text-cobalt">Bekijk vacature →</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-muted">Er staan op dit moment geen vacatures open. Stuur gerust een <Link href="/solliciteren" className="font-bold text-cobalt hover:underline">open sollicitatie</Link>.</p>
        )}
      </section>

      {/* STATEMENT */}
      <section className="relative overflow-hidden bg-cobalt py-24 text-center text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/logo_white.svg" alt="" aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 w-[150%] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-[0.08]" />
        <div className="relative mx-auto max-w-[1180px] px-5 sm:px-10">
          <p className="text-3xl font-bold leading-tight sm:text-6xl">
            Jouw <span className="italic text-yellow">vaardigheden</span> maken het verschil,<br />
            <span className="italic text-yellow">niet</span> je achtergrond.
          </p>
        </div>
      </section>

      {/* CTA-BAND */}
      <section className="mx-auto max-w-[1180px] px-5 py-20 sm:px-10">
        <div className="rounded-[22px] bg-yellow px-8 py-12 text-center sm:px-12">
          <h2 className="display text-3xl sm:text-4xl">Klaar voor de volgende stap?</h2>
          <p className="mx-auto mt-3 max-w-[52ch] text-lg font-medium">Of je nu werk zoekt of een professional nodig hebt, we helpen je snel verder.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3.5">
            <Link href="/vacatures" className="rounded-full bg-black px-6 py-3.5 font-bold text-white">Bekijk vacatures</Link>
            <Link href="/voor-opdrachtgevers" className="rounded-full bg-cobalt px-6 py-3.5 font-bold text-white">Vraag een professional aan</Link>
            <Link href="/contact" className="rounded-full border-2 border-black px-6 py-3.5 font-bold">Neem contact op</Link>
          </div>
        </div>
      </section>
    </>
  );
}
