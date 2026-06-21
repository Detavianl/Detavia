import { VAKGEBIEDEN } from "@/lib/ats";
import { salarisLabel, urenLabel } from "@/lib/vacatures-demo";

export type PreviewData = {
  titel: string;
  vakgebied: string;
  plaats: string;
  uren_min: number;
  uren_max: number;
  salaris_min: number;
  salaris_max: number;
  salaris_periode: string;
  type: string;
  top: boolean;
  status: string;
  omschrijving: string;
  taken: string;
  eisen: string[];
  opdrachtgever: string;
  startdatum: string;
  duur: string;
};

const bieden = [
  "Een eerlijk salaris volgens de geldende cao",
  "Persoonlijke begeleiding door een vaste consultant",
  "Toegang tot de DetaVia Academy om te blijven groeien",
  "Opdrachten die passen bij jouw ambitie en situatie",
];

// 1:1 weergave van hoe de vacature op de publieke detailpagina komt te staan.
export default function VacaturePreview({ v }: { v: PreviewData }) {
  const vakLabel = VAKGEBIEDEN[v.vakgebied] || v.vakgebied || "Vakgebied";
  const takenParas = v.taken.split(/\n+/).map((s) => s.trim()).filter(Boolean);
  const salaris: [number, number] = [v.salaris_min, v.salaris_max];
  const uren: [number, number] = [v.uren_min, v.uren_max];

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      {/* nep-browserbalk */}
      <div className="flex items-center gap-1.5 border-b border-neutral-200 bg-neutral-50 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-300" />
        <span className="ml-3 truncate text-xs text-neutral-400">detavia.nl/vacatures/{(v.titel || "vacature").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "vacature"}</span>
        {v.status === "gesloten" && <span className="ml-auto rounded-full bg-neutral-200 px-2 py-0.5 text-[10px] font-bold text-neutral-600">INACTIEF</span>}
      </div>

      <div className="max-h-[calc(100vh-180px)] overflow-y-auto text-[13px]">
        {/* HERO */}
        <div className="bg-cobalt px-6 py-7 text-white">
          <p className="text-[11px] font-semibold text-white/70">Home / Vacatures / {v.titel || "..."}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {v.top && <span className="rounded-full bg-yellow px-2 py-0.5 text-[10px] font-bold text-black">Topvacature</span>}
            <span className="text-[10px] font-bold uppercase tracking-[.16em] text-arctic">{vakLabel}</span>
          </div>
          <h1 className="display mt-2 text-2xl">{v.titel || "Titel van de vacature"}</h1>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-white/90">
            <span>📍 {v.plaats || "Plaats"}</span>
            <span>🕒 {urenLabel(uren)}</span>
            <span>💶 {salarisLabel(salaris, v.salaris_periode)}</span>
            <span>📄 {v.type}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-yellow px-4 py-2 text-xs font-bold text-black">Solliciteer direct</span>
            <span className="rounded-full border-2 border-white px-4 py-2 text-xs font-bold">Stel een vraag</span>
          </div>
        </div>

        {/* BODY + ZIJBALK */}
        <div className="grid gap-5 px-6 py-6 md:grid-cols-[1.5fr_1fr]">
          <div className="min-w-0">
            <h2 className="display text-lg">Over deze opdracht</h2>
            <p className="mt-2 text-muted">{v.omschrijving || "Korte omschrijving verschijnt hier."}</p>

            {takenParas.length > 0 && (
              <>
                <h2 className="display mt-6 text-lg">Wat ga je doen?</h2>
                <div className="mt-2 grid gap-2 text-muted">
                  {takenParas.map((p, i) => <p key={i}>{p}</p>)}
                </div>
              </>
            )}

            {v.eisen.length > 0 && (
              <>
                <h2 className="display mt-6 text-lg">Wat je meebrengt</h2>
                <ul className="mt-2 grid gap-1.5">
                  {v.eisen.map((e, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-yellow text-[9px] font-extrabold">✓</span>
                      <span>{e}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <h2 className="display mt-6 text-lg">Wat DetaVia jou biedt</h2>
            <ul className="mt-2 grid gap-1.5">
              {bieden.map((p) => (
                <li key={p} className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cobalt text-[9px] font-extrabold text-white">✓</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ZIJBALK */}
          <aside>
            <div className="rounded-xl border-[1.5px] border-neutral-200 p-5">
              <h3 className="font-bold">Vacaturegegevens</h3>
              <dl className="mt-3 grid gap-2 text-xs">
                <Row k="Vakgebied" val={vakLabel} />
                {v.opdrachtgever && <Row k="Opdrachtgever" val={v.opdrachtgever} />}
                <Row k="Plaats" val={v.plaats || "—"} />
                <Row k="Uren per week" val={urenLabel(uren)} />
                <Row k="Salaris" val={salarisLabel(salaris, v.salaris_periode)} />
                <Row k="Dienstverband" val={v.type} />
                {v.startdatum && <Row k="Startdatum" val={v.startdatum} />}
                {v.duur && <Row k="Duur" val={v.duur} />}
              </dl>
              <div className="mt-4 rounded-full bg-cobalt px-4 py-2 text-center text-xs font-bold text-white">Solliciteer direct</div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Row({ k, val }: { k: string; val: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-neutral-100 pb-1.5 last:border-0">
      <dt className="text-muted">{k}</dt>
      <dd className="text-right font-semibold">{val}</dd>
    </div>
  );
}
