import Link from "next/link";
import { notFound } from "next/navigation";
import { VAKGEBIEDEN, salarisLabel } from "@/lib/vacatures-demo";
import { loadVacatures } from "@/lib/vacatures";
import { SITE_URL, SITE_NAME } from "@/lib/site";

export const dynamic = "force-dynamic";

const match = (list: Awaited<ReturnType<typeof loadVacatures>>, id: string) =>
  list.find((x) => x.slug === id || x.id === id);

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const v = match(await loadVacatures(), id);
  if (!v) return { title: "Vacature niet gevonden" };
  return {
    title: `${v.titel} in ${v.plaats}`,
    description: v.omschrijving,
    alternates: { canonical: `/vacatures/${v.slug ?? v.id}` },
  };
}

const meebrengen = [
  "Een relevante hbo-opleiding en affiniteit met het sociaal domein",
  "Sterke communicatieve en gesprekstechnische vaardigheden",
  "Een zelfstandige, oplossingsgerichte werkhouding",
  "Oog voor de mens achter de vraag",
];
const bieden = [
  "Een eerlijk salaris volgens de geldende cao",
  "Persoonlijke begeleiding door een vaste consultant",
  "Toegang tot de DetaVia Academy om te blijven groeien",
  "Opdrachten die passen bij jouw ambitie en situatie",
];

export default async function VacatureDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const all = await loadVacatures();
  const v = match(all, id);
  if (!v) notFound();
  const vakLabel = VAKGEBIEDEN[v.vakgebied] ?? v.vakgebied;
  const slug = v.slug ?? v.id;
  const takenIsHtml = !!v.taken && /<[a-z][\s\S]*>/i.test(v.taken);
  const related = all.filter((x) => x.vakgebied === v.vakgebied && x.id !== v.id).slice(0, 3);
  const solliciteerHref = `/solliciteren?vacature_id=${v.id}&titel=${encodeURIComponent(v.titel)}`;

  // Structured data voor Google Jobs (JobPosting)
  const jobJsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: v.titel,
    description: `<p>${v.omschrijving}</p>${v.taken ? `<p>${v.taken}</p>` : ""}`,
    datePosted: v.datum || undefined,
    employmentType: v.uren[1] >= 36 ? "FULL_TIME" : "PART_TIME",
    hiringOrganization: { "@type": "Organization", name: v.opdrachtgever || SITE_NAME, sameAs: SITE_URL },
    jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: v.plaats, addressCountry: "NL" } },
    industry: "Sociaal domein",
    url: `${SITE_URL}/vacatures/${slug}`,
    ...(v.salaris[0] > 0 ? { baseSalary: { "@type": "MonetaryAmount", currency: "EUR", value: { "@type": "QuantitativeValue", minValue: v.salaris[0], maxValue: v.salaris[1], unitText: "MONTH" } } } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobJsonLd) }} />
      {/* HERO */}
      <section className="bg-cobalt text-white">
        <div className="mx-auto max-w-[1180px] px-5 py-14 sm:px-10">
          <p className="text-sm font-semibold text-white/70">
            <Link href="/" className="hover:underline">Home</Link> / <Link href="/vacatures" className="hover:underline">Vacatures</Link> / <span className="text-white">{v.titel}</span>
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            {v.top && <span className="rounded-full bg-yellow px-2.5 py-0.5 text-xs font-bold text-black">Topvacature</span>}
            <span className="text-xs font-bold uppercase tracking-[.16em] text-arctic">{vakLabel}</span>
          </div>
          <h1 className="display mt-3 max-w-[22ch] text-4xl sm:text-5xl">{v.titel}</h1>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 font-semibold text-white/90">
            <span>📍 {v.plaats}</span>
            <span>🕒 {v.uren[0]}-{v.uren[1]} uur</span>
            <span>💶 {salarisLabel(v.salaris)}</span>
            <span>📄 {v.type}</span>
          </div>
          <div className="mt-7 flex flex-wrap gap-3.5">
            <Link href={solliciteerHref} className="rounded-full bg-yellow px-6 py-3.5 font-bold text-black transition hover:-translate-y-0.5">Solliciteer direct</Link>
            <Link href="/contact" className="rounded-full border-2 border-white px-6 py-3.5 font-bold text-white">Stel een vraag</Link>
          </div>
        </div>
      </section>

      {/* HOOFD + ZIJBALK */}
      <section className="mx-auto grid max-w-[1180px] gap-10 px-5 py-16 sm:px-10 lg:grid-cols-[1.6fr_1fr]">
        <div className="min-w-0">
          <h2 className="display text-2xl sm:text-3xl">Over deze opdracht</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">{v.omschrijving}</p>

          {v.taken && (
            <>
              <h2 className="display mt-12 text-2xl sm:text-3xl">Wat ga je doen?</h2>
              {takenIsHtml ? (
                <div className="prose-detavia mt-4 text-muted" dangerouslySetInnerHTML={{ __html: v.taken }} />
              ) : (
                <p className="mt-4 leading-relaxed text-muted">{v.taken}</p>
              )}
            </>
          )}

          {(v.eisen || !takenIsHtml) && (
            <>
              <h2 className="display mt-12 text-2xl sm:text-3xl">Wat je meebrengt</h2>
              <ul className="mt-4 grid gap-3">
                {(v.eisen ?? meebrengen).map((p) => (
                  <li key={p} className="flex items-start gap-3">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-yellow text-xs font-extrabold">✓</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          <h2 className="display mt-12 text-2xl sm:text-3xl">Wat DetaVia jou biedt</h2>
          <ul className="mt-4 grid gap-3">
            {bieden.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cobalt text-xs font-extrabold text-white">✓</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>

          <div className="mt-12 rounded-[22px] bg-neutral-50 p-7">
            <h3 className="text-xl font-bold">Klinkt dit als jouw volgende stap?</h3>
            <p className="mt-1.5 text-muted">Solliciteer direct, of stel eerst je vraag. We reageren snel en persoonlijk.</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
              <Link href={solliciteerHref} className="rounded-full bg-cobalt px-6 py-3 font-bold text-white">Solliciteer op deze vacature</Link>
              <Link href="/contact" className="font-bold text-cobalt hover:underline">Stel een vraag</Link>
            </div>
          </div>
        </div>

        {/* ZIJBALK */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[22px] border-[1.5px] border-neutral-200 p-7">
            <h3 className="text-lg font-bold">Vacaturegegevens</h3>
            <dl className="mt-4 grid gap-3 text-sm">
              <Row k="Vakgebied" v={vakLabel} />
              {v.opdrachtgever && <Row k="Opdrachtgever" v={v.opdrachtgever} />}
              <Row k="Plaats" v={v.plaats} />
              <Row k="Uren per week" v={`${v.uren[0]}-${v.uren[1]} uur`} />
              <Row k="Salarisindicatie" v={salarisLabel(v.salaris)} />
              <Row k="Dienstverband" v={v.type} />
              {v.startdatum && <Row k="Startdatum" v={v.startdatum} />}
              {v.duur && <Row k="Duur" v={v.duur} />}
              {v.datum && <Row k="Geplaatst" v={v.datum} />}
            </dl>
            <Link href={solliciteerHref} className="mt-6 block rounded-full bg-cobalt px-6 py-3 text-center font-bold text-white">Solliciteer direct</Link>

            <div className="mt-7 border-t border-neutral-200 pt-6">
              <p className="text-xs font-bold uppercase tracking-wider opacity-60">Je contactpersoon</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-[1.5px] border-dashed border-cobalt/30 bg-cobalt/[0.05]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7 text-cobalt/40"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.5-6 8-6s8 2 8 6" /></svg>
                </div>
                <div>
                  <p className="font-bold">[ Naam ]</p>
                  <p className="text-sm text-muted">[ Consultant ]</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </section>

      {/* VERGELIJKBARE VACATURES */}
      {related.length > 0 && (
        <section className="bg-neutral-50">
          <div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-10">
            <h2 className="display text-2xl sm:text-3xl">Vergelijkbare vacatures</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link key={r.id} href={`/vacatures/${r.slug ?? r.id}`} className="flex flex-col rounded-2xl border-[1.5px] border-neutral-200 bg-white p-6 transition hover:-translate-y-1 hover:border-cobalt">
                  <span className="self-start text-xs font-bold uppercase tracking-wide text-cobalt">{VAKGEBIEDEN[r.vakgebied] ?? r.vakgebied}</span>
                  <h3 className="mt-1.5 text-lg font-bold">{r.titel}</h3>
                  <p className="mt-1 text-sm font-semibold text-muted">{r.plaats} · {r.uren[0]}-{r.uren[1]} uur</p>
                  <span className="mt-3 font-bold text-cobalt">Bekijk vacature →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-neutral-100 pb-2.5 last:border-0">
      <dt className="text-muted">{k}</dt>
      <dd className="text-right font-semibold">{v}</dd>
    </div>
  );
}
