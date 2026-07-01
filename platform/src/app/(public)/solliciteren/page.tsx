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

  const vac = vacature_id
    ? (await loadVacatures()).find((x) => x.slug === vacature_id || x.id === vacature_id) ?? null
    : null;
  const effTitel = vac?.titel || titel;

  const form = <SollicitatieForm vacatureId={vacature_id} titel={effTitel} backHref={backHref} backLabel={backLabel} />;

  return (
    <>
      {/* HERO */}
      <section className="bg-cobalt text-white">
        <div className="mx-auto max-w-[1120px] px-5 py-14 sm:px-10">
          <Link href={backHref} className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 transition hover:text-white">
            <span aria-hidden>←</span> {backLabel}
          </Link>
          <h1 className="display mt-4 text-4xl sm:text-6xl">Solliciteer bij DetaVia</h1>
          <p className="mt-4 max-w-[54ch] text-lg font-medium text-white/90">Laat je gegevens achter en stuur je cv mee, dan nemen we snel persoonlijk contact met je op.</p>
        </div>
      </section>

      <section className="mx-auto max-w-[1120px] px-5 py-16 sm:px-10">
        {vac ? (
          <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-start">
            <div className="order-2 lg:order-1">{form}</div>
            <aside className="order-1 lg:order-2 lg:sticky lg:top-6">
              <div className="overflow-hidden rounded-[26px] border border-neutral-200 bg-white shadow-sm">
                <div className="relative overflow-hidden bg-cobalt px-6 py-6 text-white">
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-yellow/20 blur-2xl" />
                  <p className="relative text-xs font-bold uppercase tracking-[.16em] text-arctic">Je solliciteert op</p>
                  <h2 className="display relative mt-1 text-2xl leading-tight">{vac.titel}</h2>
                  {vac.top && <span className="relative mt-3 inline-block rounded-full bg-yellow px-3 py-1 text-xs font-extrabold text-black">Topvacature</span>}
                </div>
                <div className="p-6">
                  {vac.omschrijving && <p className="text-sm leading-relaxed text-muted">{vac.omschrijving}</p>}
                  <div className="mt-6 grid gap-3.5">
                    <Row label="Locatie" value={vac.plaats || "In overleg"} icon={<PinIcon />} />
                    <Row label="Salaris" value={salarisLabel(vac.salaris, vac.salaris_periode)} icon={<EuroIcon />} />
                    <Row label="Uren" value={urenLabel(vac.uren)} icon={<ClockIcon />} />
                    {vac.type && <Row label="Dienstverband" value={vac.type} icon={<CaseIcon />} />}
                  </div>
                  <Link href={backHref} className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-cobalt hover:underline">
                    Bekijk de volledige vacature <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        ) : (
          <div className="mx-auto max-w-[760px]">{form}</div>
        )}
      </section>
    </>
  );
}

function Row({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cobalt/[0.08] text-cobalt">{icon}</span>
      <div className="min-w-0">
        <div className="text-[11px] font-bold uppercase tracking-wide text-muted">{label}</div>
        <div className="truncate text-sm font-semibold">{value}</div>
      </div>
    </div>
  );
}

const svg = "h-5 w-5";
function PinIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={svg}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;
}
function EuroIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={svg}><circle cx="12" cy="12" r="9" /><path d="M15.5 9a3.5 3.5 0 1 0 0 6" /><path d="M7.5 11h5" /><path d="M7.5 13.5h5" /></svg>;
}
function ClockIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={svg}><circle cx="12" cy="12" r="9" /><path d="M12 7.5V12l3 1.8" /></svg>;
}
function CaseIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={svg}><rect x="3" y="7.5" width="18" height="12.5" rx="2" /><path d="M8 7.5V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1.5" /></svg>;
}
