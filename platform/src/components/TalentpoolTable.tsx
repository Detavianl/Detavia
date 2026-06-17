"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { VAKGEBIEDEN, KANDIDAAT_STATUS, NIVEAUS } from "@/lib/ats";

type C = {
  id: string; naam: string; huidige_functie?: string | null; vakgebied?: string | null;
  niveau?: string | null; status?: string | null; tarief_min?: number | null; tarief_max?: number | null;
  rating?: number | null; expertise?: string[] | null; beschikbaar_per?: string | null;
};

export default function TalentpoolTable({ candidates }: { candidates: C[] }) {
  const [q, setQ] = useState("");
  const [niveau, setNiveau] = useState("");
  const [status, setStatus] = useState("");
  const [vak, setVak] = useState("");

  const list = useMemo(() => candidates.filter((c) => {
    if (niveau && c.niveau !== niveau) return false;
    if (status && c.status !== status) return false;
    if (vak && c.vakgebied !== vak) return false;
    if (q) {
      const s = q.toLowerCase();
      const hay = [c.naam, c.huidige_functie, ...(c.expertise ?? [])].join(" ").toLowerCase();
      if (!hay.includes(s)) return false;
    }
    return true;
  }), [candidates, q, niveau, status, vak]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Zoek op naam, functie of expertise"
          className="min-w-[220px] flex-1 rounded-xl border-2 border-neutral-200 px-4 py-2.5" />
        <Sel value={niveau} onChange={setNiveau} all="Alle niveaus" options={NIVEAUS.map((n) => [n, n[0].toUpperCase() + n.slice(1)])} />
        <Sel value={status} onChange={setStatus} all="Alle statussen" options={Object.entries(KANDIDAAT_STATUS)} />
        <Sel value={vak} onChange={setVak} all="Alle vakgebieden" options={Object.entries(VAKGEBIEDEN)} />
      </div>

      <p className="mb-3 text-sm text-muted"><b className="text-cobalt">{list.length}</b> van {candidates.length} kandidaten</p>

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-muted">
            <tr><th className="px-5 py-3">Naam</th><th className="px-5 py-3">Niveau</th><th className="px-5 py-3">Vakgebied</th>
              <th className="px-5 py-3">Status</th><th className="px-5 py-3">Tarief</th></tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                <td className="px-5 py-3"><Link href={`/admin/kandidaten/${c.id}`} className="font-bold text-cobalt">{c.naam}</Link>
                  <div className="text-xs text-muted">{c.huidige_functie || ""}</div></td>
                <td className="px-5 py-3 capitalize">{c.niveau || "—"}</td>
                <td className="px-5 py-3">{c.vakgebied ? VAKGEBIEDEN[c.vakgebied] ?? c.vakgebied : "—"}</td>
                <td className="px-5 py-3"><span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-semibold">{KANDIDAAT_STATUS[c.status ?? ""] ?? c.status ?? "—"}</span></td>
                <td className="px-5 py-3">{c.tarief_min || c.tarief_max ? `€ ${c.tarief_min ?? "?"}-${c.tarief_max ?? "?"}` : "—"}</td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={5} className="px-5 py-10 text-center text-muted">Geen kandidaten gevonden.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Sel({ value, onChange, all, options }: { value: string; onChange: (v: string) => void; all: string; options: [string, string][] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="rounded-xl border-2 border-neutral-200 bg-white px-3 py-2.5 font-semibold">
      <option value="">{all}</option>
      {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  );
}
