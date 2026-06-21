import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DEMO_VACATURES, VAKGEBIEDEN, fmtSalaris, type Vacature } from "@/lib/vacatures-demo";

export const dynamic = "force-dynamic";

async function loadAll(): Promise<Vacature[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("vacatures").select("*").eq("status", "open").order("created_at", { ascending: false });
    if (!data || data.length === 0) return DEMO_VACATURES;
    return data.map((v: { id: string; titel: string; vakgebied: string; plaats: string; uren_min: number; uren_max: number; salaris_min: number | null; salaris_max: number | null; type: string; top: boolean; created_at: string | null; omschrijving: string }) => ({
      id: v.id, titel: v.titel, vakgebied: v.vakgebied, plaats: v.plaats,
      uren: [v.uren_min, v.uren_max], salaris: [v.salaris_min ?? 0, v.salaris_max ?? 0],
      type: v.type, top: v.top, datum: (v.created_at ?? "").slice(0, 10), omschrijving: v.omschrijving,
    }));
  } catch {
    return DEMO_VACATURES;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const v = (await loadAll()).find((x) => x.id === id);
  if (!v) return { title: "Vacature niet gevonden | DetaVia" };
  return { title: `${v.titel} in ${v.plaats}`, description: v.omschrijving };
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
  const all = await loadAll();
  const v = all.find((x) => x.id === id);
  if (!v) notFound();
  const vakLabel = VAKGEBIEDEN[v.vakgebied] ?? v.vakgebied;
  const related = all.filter((x) => x.vakgebied === v.vakgebied && x.id !== v.id).slice(0, 3);
  const solliciteerHref = `/solliciteren?vacature_id=${v.id}&titel=${encodeURIComponent(v.titel)}`;

  return (
    <>
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
            <span>💶 {fmtSalaris(v.salaris)}</span>
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

          <h2 className="display mt-12 text-2xl sm:text-3xl">Wat je meebrengt</h2>
          <ul className="mt-4 grid gap-3">
            {meebrengen.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-yellow text-xs font-extrabold">✓</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>

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
              <Row k="Plaats" v={v.plaats} />
              <Row k="Uren per week" v={`${v.uren[0]}-${v.uren[1]} uur`} />
              <Row k="Salarisindicatie" v={fmtSalaris(v.salaris)} />
              <Row k="Dienstverband" v={v.type} />
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
                <Link key={r.id} href={`/vacatures/${r.id}`} className="flex flex-col rounded-2xl border-[1.5px] border-neutral-200 bg-white p-6 transition hover:-translate-y-1 hover:border-cobalt">
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
