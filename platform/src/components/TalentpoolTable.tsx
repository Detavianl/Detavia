"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { VAKGEBIEDEN, KANDIDAAT_STATUS, NIVEAUS } from "@/lib/ats";

type C = {
  id: string; naam: string; huidige_functie?: string | null; vakgebied?: string | null;
  niveau?: string | null; status?: string | null; tarief_min?: number | null; tarief_max?: number | null;
  rating?: number | null; expertise?: string[] | null; beschikbaar_per?: string | null;
  uren_beschikbaar?: number | null; regio?: string | null; woonplaats?: string | null;
  rijbewijs?: boolean | null; opleidingsniveau?: string | null;
};

export default function TalentpoolTable({ candidates }: { candidates: C[] }) {
  const [q, setQ] = useState("");
  const [vakken, setVakken] = useState<Set<string>>(new Set());
  const [niveaus, setNiveaus] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState("");
  const [regio, setRegio] = useState("");
  const [beschikbaar, setBeschikbaar] = useState("");
  const [urenMin, setUrenMin] = useState<number | null>(null);
  const [tariefMax, setTariefMax] = useState<number | null>(null);
  const [rijbewijs, setRijbewijs] = useState(false);

  const toggle = (set: Set<string>, setter: (s: Set<string>) => void, k: string) => {
    const n = new Set(set);
    n.has(k) ? n.delete(k) : n.add(k);
    setter(n);
  };

  const list = useMemo(() => candidates.filter((c) => {
    if (vakken.size && !(c.vakgebied && vakken.has(c.vakgebied))) return false;
    if (niveaus.size && !(c.niveau && niveaus.has(c.niveau))) return false;
    if (status && c.status !== status) return false;
    if (regio) {
      const r = regio.toLowerCase();
      if (!`${c.regio ?? ""} ${c.woonplaats ?? ""}`.toLowerCase().includes(r)) return false;
    }
    if (beschikbaar && c.beschikbaar_per && c.beschikbaar_per > beschikbaar) return false;
    if (urenMin != null && (c.uren_beschikbaar ?? 0) < urenMin) return false;
    if (tariefMax != null && (c.tarief_min ?? 0) > tariefMax) return false;
    if (rijbewijs && c.rijbewijs !== true) return false;
    if (q) {
      const s = q.toLowerCase();
      const hay = [c.naam, c.huidige_functie, c.opleidingsniveau, c.woonplaats, ...(c.expertise ?? [])].join(" ").toLowerCase();
      if (!hay.includes(s)) return false;
    }
    return true;
  }), [candidates, q, vakken, niveaus, status, regio, beschikbaar, urenMin, tariefMax, rijbewijs]);

  const actief = vakken.size + niveaus.size + (status ? 1 : 0) + (regio ? 1 : 0) + (beschikbaar ? 1 : 0) + (urenMin != null ? 1 : 0) + (tariefMax != null ? 1 : 0) + (rijbewijs ? 1 : 0) + (q ? 1 : 0);
  const wis = () => { setQ(""); setVakken(new Set()); setNiveaus(new Set()); setStatus(""); setRegio(""); setBeschikbaar(""); setUrenMin(null); setTariefMax(null); setRijbewijs(false); };

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[280px_1fr]">
      {/* FILTER-ZIJBALK */}
      <aside className="rounded-[22px] border-[1.5px] border-neutral-200 p-5 lg:sticky lg:top-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">Filter</h2>
          {actief > 0 && <button onClick={wis} className="text-sm font-bold text-cobalt">Wis ({actief})</button>}
        </div>

        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Zoek op naam, functie, expertise…"
          className="mb-4 w-full rounded-lg border-2 border-neutral-200 px-3 py-2 text-sm" />

        <Group title="Vakgebied">
          {Object.entries(VAKGEBIEDEN).map(([k, l]) => (
            <Check key={k} checked={vakken.has(k)} onChange={() => toggle(vakken, setVakken, k)} label={l} n={candidates.filter((c) => c.vakgebied === k).length} />
          ))}
        </Group>

        <Group title="Niveau">
          {NIVEAUS.map((n) => (
            <Check key={n} checked={niveaus.has(n)} onChange={() => toggle(niveaus, setNiveaus, n)} label={n[0].toUpperCase() + n.slice(1)} n={candidates.filter((c) => c.niveau === n).length} />
          ))}
        </Group>

        <Group title="Status">
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-lg border-2 border-neutral-200 px-3 py-2 text-sm font-semibold">
            <option value="">Alle statussen</option>
            {Object.entries(KANDIDAAT_STATUS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </Group>

        <Group title="Regio / plaats">
          <input value={regio} onChange={(e) => setRegio(e.target.value)} placeholder="bv. Gelderland of Almere"
            className="w-full rounded-lg border-2 border-neutral-200 px-3 py-2 text-sm" />
        </Group>

        <Group title="Beschikbaar uiterlijk">
          <input type="date" value={beschikbaar} onChange={(e) => setBeschikbaar(e.target.value)} className="w-full rounded-lg border-2 border-neutral-200 px-3 py-2 text-sm" />
        </Group>

        <Group title="Beschikbaarheid & tarief">
          <div className="grid grid-cols-2 gap-2">
            <label className="grid gap-1 text-xs font-semibold text-muted">Min. uren/week
              <input type="number" min={0} max={40} value={urenMin ?? ""} onChange={(e) => setUrenMin(e.target.value === "" ? null : +e.target.value)} className="rounded-lg border-2 border-neutral-200 px-2 py-1.5 text-sm" /></label>
            <label className="grid gap-1 text-xs font-semibold text-muted">Tarief tot €/u
              <input type="number" min={0} value={tariefMax ?? ""} onChange={(e) => setTariefMax(e.target.value === "" ? null : +e.target.value)} className="rounded-lg border-2 border-neutral-200 px-2 py-1.5 text-sm" /></label>
          </div>
        </Group>

        <label className="mt-3 flex items-center gap-2.5 font-semibold">
          <input type="checkbox" checked={rijbewijs} onChange={(e) => setRijbewijs(e.target.checked)} className="h-[18px] w-[18px] accent-cobalt" />
          Heeft rijbewijs
        </label>
      </aside>

      {/* RESULTATEN */}
      <div>
        <p className="mb-3 text-sm text-muted"><b className="text-cobalt">{list.length}</b> van {candidates.length} kandidaten</p>
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-muted">
              <tr><th className="px-5 py-3">Naam</th><th className="px-5 py-3">Niveau</th><th className="px-5 py-3">Vakgebied</th>
                <th className="px-5 py-3">Regio</th><th className="px-5 py-3">Uren</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Tarief</th></tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                  <td className="px-5 py-3"><Link href={`/admin/kandidaten/${c.id}`} className="font-bold text-cobalt">{c.naam}</Link>
                    <div className="text-xs text-muted">{c.huidige_functie || ""}</div></td>
                  <td className="px-5 py-3 capitalize">{c.niveau || "—"}</td>
                  <td className="px-5 py-3">{c.vakgebied ? VAKGEBIEDEN[c.vakgebied] ?? c.vakgebied : "—"}</td>
                  <td className="px-5 py-3">{c.regio || c.woonplaats || "—"}</td>
                  <td className="px-5 py-3">{c.uren_beschikbaar ? `${c.uren_beschikbaar} u` : "—"}</td>
                  <td className="px-5 py-3"><span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-semibold">{KANDIDAAT_STATUS[c.status ?? ""] ?? c.status ?? "—"}</span></td>
                  <td className="px-5 py-3">{c.tarief_min || c.tarief_max ? `€ ${c.tarief_min ?? "?"}-${c.tarief_max ?? "?"}` : "—"}</td>
                </tr>
              ))}
              {list.length === 0 && <tr><td colSpan={7} className="px-5 py-10 text-center text-muted">Geen kandidaten gevonden. Pas je filters aan.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 border-t border-neutral-100 pt-3">
      <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">{title}</h3>
      {children}
    </div>
  );
}

function Check({ checked, onChange, label, n }: { checked: boolean; onChange: () => void; label: string; n: number }) {
  return (
    <label className={`flex cursor-pointer items-center gap-2.5 py-1 text-sm font-medium ${n === 0 && !checked ? "opacity-40" : ""}`}>
      <input type="checkbox" checked={checked} onChange={onChange} className="h-[16px] w-[16px] accent-cobalt" />
      <span>{label}</span>
      <span className="ml-auto rounded-full bg-neutral-100 px-1.5 text-[11px] font-bold text-muted">{n}</span>
    </label>
  );
}
