"use client";
import { useMemo, useState } from "react";
import { VAKGEBIEDEN, salarisLabel, urenLabel, type Vacature } from "@/lib/vacatures-demo";

export default function VacatureZoeker({ vacatures }: { vacatures: Vacature[] }) {
  const [tekst, setTekst] = useState("");
  const [plaats, setPlaats] = useState("");
  const [branches, setBranches] = useState<Set<string>>(new Set());
  const [urenMin, setUrenMin] = useState<number | null>(null);
  const [urenMax, setUrenMax] = useState<number | null>(null);
  const [afstand, setAfstand] = useState(50);
  const [sort, setSort] = useState("nieuwste");
  const [grid, setGrid] = useState(false);

  const matchUren = (v: Vacature) => {
    if (urenMin == null && urenMax == null) return true;
    const lo = urenMin ?? 0, hi = urenMax ?? 99;
    return v.uren[0] <= hi && v.uren[1] >= lo;
  };
  const passes = (v: Vacature, ignore?: string) => {
    if (tekst) {
      const q = tekst.toLowerCase();
      if (!(v.titel.toLowerCase().includes(q) || v.omschrijving.toLowerCase().includes(q) || VAKGEBIEDEN[v.vakgebied]?.toLowerCase().includes(q))) return false;
    }
    if (plaats && !v.plaats.toLowerCase().includes(plaats.toLowerCase())) return false;
    if (ignore !== "vak" && branches.size && !branches.has(v.vakgebied)) return false;
    if (!matchUren(v)) return false;
    return true;
  };

  const list = useMemo(() => {
    const l = vacatures.filter((v) => passes(v));
    if (sort === "nieuwste") l.sort((a, b) => b.datum.localeCompare(a.datum));
    if (sort === "uren") l.sort((a, b) => b.uren[1] - a.uren[1]);
    return l;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vacatures, tekst, plaats, branches, urenMin, urenMax, sort]);

  const count = (k: string) => vacatures.filter((v) => v.vakgebied === k && passes(v, "vak")).length;
  const toggleBranche = (k: string) => {
    const n = new Set(branches);
    n.has(k) ? n.delete(k) : n.add(k);
    setBranches(n);
  };
  const reset = () => {
    setTekst(""); setPlaats(""); setBranches(new Set()); setUrenMin(null); setUrenMax(null); setAfstand(50); setSort("nieuwste");
  };

  return (
    <div>
      {/* zoekbalk */}
      <div className="mb-8 flex flex-wrap gap-2.5">
        <input value={tekst} onChange={(e) => setTekst(e.target.value)} placeholder="Zoek op functie of trefwoord"
               className="min-w-[220px] flex-1 rounded-xl border-2 border-neutral-200 px-4 py-3 text-base" />
      </div>

      <div className="grid items-start gap-8 md:grid-cols-[290px_1fr]">
        {/* FILTER-SIDEBAR (joinuz-opbouw) */}
        <aside className="rounded-[22px] border-[1.5px] border-neutral-200 p-6 md:sticky md:top-24">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-bold">Filter</h2>
            <button onClick={reset} className="inline-flex items-center gap-1.5 text-sm font-bold text-cobalt">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" /></svg>
              Verwijder filters
            </button>
          </div>

          <Group title="Locatie">
            <input value={plaats} onChange={(e) => setPlaats(e.target.value)} placeholder="Stad / postcode"
                   className="w-full rounded-lg border-2 border-neutral-200 px-3 py-2" />
          </Group>

          <Group title="Afstand">
            <input type="range" min={0} max={50} step={5} value={afstand} onChange={(e) => setAfstand(+e.target.value)} className="w-full accent-cobalt" />
            <div className="mt-2 flex justify-between text-sm font-bold text-cobalt">
              <span className="rounded-lg bg-neutral-100 px-2 py-1">0 km</span>
              <span className="rounded-lg bg-neutral-100 px-2 py-1">{afstand} km</span>
            </div>
          </Group>

          <Group title="Vakgebied">
            <select className="w-full rounded-lg border-2 border-neutral-200 px-3 py-2 font-semibold">
              <option>Sociaal Domein</option>
            </select>
          </Group>

          <Group title="Vakgebied">
            {Object.entries(VAKGEBIEDEN).map(([k, label]) => {
              const n = count(k);
              return (
                <label key={k} className={`flex cursor-pointer items-center gap-2.5 py-1.5 font-medium ${n === 0 && !branches.has(k) ? "opacity-40" : ""}`}>
                  <input type="checkbox" checked={branches.has(k)} onChange={() => toggleBranche(k)} className="h-[18px] w-[18px] accent-cobalt" />
                  <span>{label}</span>
                  <span className="ml-auto rounded-full bg-neutral-100 px-2 text-xs font-bold text-muted">{n}</span>
                </label>
              );
            })}
          </Group>

          <Group title="Uren per week">
            <div className="flex items-center gap-2.5">
              <input type="number" min={0} max={40} placeholder="min" value={urenMin ?? ""} onChange={(e) => setUrenMin(e.target.value === "" ? null : +e.target.value)}
                     className="w-full rounded-lg border-2 border-neutral-200 px-3 py-2" />
              <span className="font-bold text-muted">–</span>
              <input type="number" min={0} max={40} placeholder="max" value={urenMax ?? ""} onChange={(e) => setUrenMax(e.target.value === "" ? null : +e.target.value)}
                     className="w-full rounded-lg border-2 border-neutral-200 px-3 py-2" />
            </div>
          </Group>

          <button onClick={() => { /* live filtering, scroll */ }} className="mt-5 w-full rounded-full bg-cobalt px-5 py-3 font-bold text-white">Zoeken</button>
        </aside>

        {/* RESULTATEN */}
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <span className="font-bold"><b className="text-cobalt">{list.length}</b> {list.length === 1 ? "vacature" : "vacatures"} gevonden</span>
            <div className="flex items-center gap-3.5">
              <label className="font-semibold">Sorteer{" "}
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-lg border-2 border-neutral-200 px-2 py-1 font-semibold">
                  <option value="nieuwste">Nieuwste eerst</option>
                  <option value="uren">Meeste uren</option>
                </select>
              </label>
              <div className="flex overflow-hidden rounded-lg border-[1.5px] border-neutral-200">
                <button onClick={() => setGrid(false)} className={`px-2.5 py-2 ${!grid ? "bg-cobalt text-white" : "text-neutral-400"}`} aria-label="Lijst">≡</button>
                <button onClick={() => setGrid(true)} className={`px-2.5 py-2 ${grid ? "bg-cobalt text-white" : "text-neutral-400"}`} aria-label="Raster">▦</button>
              </div>
            </div>
          </div>

          <div className={grid ? "grid gap-4 sm:grid-cols-2" : "grid gap-4"}>
            {list.map((v) => (
              <article key={v.id} className="rounded-2xl border-[1.5px] border-neutral-200 p-6 transition hover:border-cobalt">
                <div className="mb-2 flex flex-wrap items-center gap-2.5">
                  {v.top && <span className="rounded-full bg-yellow px-2.5 py-0.5 text-xs font-bold">Topvacature</span>}
                  <span className="text-xs font-bold uppercase tracking-wide text-cobalt">{VAKGEBIEDEN[v.vakgebied]}</span>
                </div>
                <h3 className="text-xl font-bold"><a href={`/vacatures/${v.slug ?? v.id}`} className="hover:text-cobalt">{v.titel}</a></h3>
                <div className="mt-2 flex flex-wrap gap-4 text-sm font-semibold text-muted">
                  <span>📍 {v.plaats}</span><span>🕒 {urenLabel(v.uren)}</span>
                  <span>💶 {salarisLabel(v.salaris, v.salaris_periode)}</span><span>📄 {v.type}</span>
                </div>
                <p className="mt-2.5 text-[.95rem] text-muted">{v.omschrijving}</p>
                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                  <a href={`/vacatures/${v.slug ?? v.id}`} className="inline-block rounded-full bg-cobalt px-5 py-2.5 font-bold text-white">Bekijk vacature</a>
                  <a href={`/solliciteren?vacature_id=${v.id}&titel=${encodeURIComponent(v.titel)}`} className="font-bold text-cobalt hover:underline">Direct solliciteren →</a>
                </div>
              </article>
            ))}
            {list.length === 0 && (
              <div className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center text-muted">
                <strong>Geen vacatures gevonden.</strong><br />Pas je filters aan.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-neutral-100 py-4 first:border-t-0">
      <h4 className="mb-3 text-xs font-bold uppercase tracking-wider opacity-60">{title}</h4>
      {children}
    </div>
  );
}
