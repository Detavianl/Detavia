import Link from "next/link";
import { notFound } from "next/navigation";
import sanitizeHtml from "sanitize-html";
import { pageMeta } from "@/lib/seo";
import { loadOpdracht, sluitingLabel } from "@/lib/flextender";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ avnummer: string }> }) {
  const { avnummer } = await params;
  const o = await loadOpdracht(avnummer);
  return pageMeta({
    title: o ? o.opdracht : "Opdracht",
    description: o ? `Inhuuropdracht ${o.opdracht}${o.opdrachtgever ? ` bij ${o.opdrachtgever}` : ""} in het sociaal domein. Reageer via DetaVia.` : "Opdracht in het sociaal domein.",
    path: `/vacatures/opdracht/${avnummer}`,
  });
}

export default async function OpdrachtDetail({ params }: { params: Promise<{ avnummer: string }> }) {
  const { avnummer } = await params;
  const o = await loadOpdracht(avnummer);
  if (!o) notFound();

  const html = sanitizeHtml(o.omschrijving ?? "", {
    allowedTags: ["p", "br", "ul", "ol", "li", "strong", "em", "b", "i", "h3", "h4", "a"],
    allowedAttributes: { a: ["href", "target", "rel"] },
    transformTags: { a: sanitizeHtml.simpleTransform("a", { target: "_blank", rel: "noopener noreferrer" }) },
  });
  const solliciteerHref = `/solliciteren?titel=${encodeURIComponent(o.opdracht)}`;

  return (
    <>
      <section className="bg-cobalt text-white">
        <div className="mx-auto max-w-[1120px] px-5 py-12 sm:px-10">
          <Link href="/vacatures" className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 transition hover:text-white">
            <span aria-hidden>←</span> Terug naar vacatures &amp; opdrachten
          </Link>
          <span className="mt-4 inline-block rounded-full bg-yellow px-3 py-1 text-xs font-extrabold text-black">Inhuuropdracht · Sociaal domein</span>
          <h1 className="display mt-3 text-3xl leading-tight sm:text-5xl">{o.opdracht}</h1>
          {o.opdrachtgever && <p className="mt-2 text-lg font-medium text-white/90">{o.opdrachtgever}</p>}
        </div>
      </section>

      <section className="mx-auto grid max-w-[1120px] gap-8 px-5 py-14 sm:px-10 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        <div className="order-2 lg:order-1">
          <h2 className="text-xl font-bold">Over de opdracht</h2>
          {html ? (
            <div className="prose-detavia mt-4" dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <p className="mt-4 text-muted">Geen omschrijving beschikbaar. Neem contact op voor meer informatie.</p>
          )}
        </div>

        <aside className="order-1 lg:order-2 lg:sticky lg:top-6">
          <div className="overflow-hidden rounded-[26px] border border-neutral-200 bg-white shadow-sm">
            <div className="border-b border-neutral-200 bg-neutral-50 px-6 py-4">
              <p className="text-xs font-bold uppercase tracking-[.16em] text-muted">Opdracht in het kort</p>
            </div>
            <div className="grid gap-3.5 p-6">
              {o.regio && <Info label="Regio" value={o.regio} />}
              {o.urenperweek && <Info label="Uren per week" value={o.urenperweek} />}
              {o.aanvang && <Info label="Aanvang" value={o.aanvang} />}
              {o.duur && <Info label="Duur" value={o.duur} />}
              {o.verlengingsoptie && <Info label="Verlengingsoptie" value={o.verlengingsoptie} />}
              {o.aantal_professionals && <Info label="Aantal professionals" value={o.aantal_professionals} />}
              {o.opleiding && <Info label="Opleidingsniveau" value={o.opleiding} />}
              <Info label="Reageren tot" value={sluitingLabel(o.sluiting_inschrijving)} />
            </div>
            <div className="border-t border-neutral-200 p-6">
              <Link href={solliciteerHref} className="block rounded-full bg-cobalt px-6 py-3.5 text-center font-bold text-white transition hover:-translate-y-0.5">
                Reageer via DetaVia
              </Link>
              <p className="mt-3 text-center text-xs text-muted">Wij nemen contact op en bemiddelen voor je richting de opdrachtgever.</p>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] font-bold uppercase tracking-wide text-muted">{label}</div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}
