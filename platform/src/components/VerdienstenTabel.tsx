"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { euro2 } from "@/lib/marge-calc";

export type VerdienstRow = {
  id: string;
  kandidaat: string;
  recruiterNaam: string;
  weggezet: string;
  verkoop: number;
  inkoop: number;
  brutoMarge: number;
  overhead: number;
  nettowinst: number;
  recruiter: number;
  teLaag: boolean;
};

const KEY = "detavia_verdiensten_uren";
const r2 = (n: number) => Math.round(n * 100) / 100;

export default function VerdienstenTabel({ rows, isRecruiter, isJr = false }: { rows: VerdienstRow[]; isRecruiter: boolean; isJr?: boolean }) {
  const [uren, setUren] = useState<Record<string, string>>({});
  const [klaar, setKlaar] = useState(false);

  useEffect(() => {
    try { const s = localStorage.getItem(KEY); if (s) setUren(JSON.parse(s)); } catch { /* leeg */ }
    setKlaar(true);
  }, []);
  useEffect(() => {
    if (klaar) { try { localStorage.setItem(KEY, JSON.stringify(uren)); } catch { /* vol */ } }
  }, [uren, klaar]);

  const toonMarge = !isJr; // jr. recruiter ziet geen verkoop/inkoop/overhead/marge
  const u = (id: string) => Number(uren[id]) || 0;
  const totUren = rows.reduce((a, r) => a + u(r.id), 0);
  const totRecruiter = r2(rows.reduce((a, r) => a + r.recruiter * u(r.id), 0));
  const totFactuur = r2(rows.reduce((a, r) => a + r.verkoop * u(r.id), 0));

  return (
    <>
      <div className={`mt-6 grid grid-cols-2 gap-4 ${toonMarge ? "sm:grid-cols-4" : "sm:grid-cols-3"}`}>
        <Kpi label="Plaatsingen" value={String(rows.length)} />
        <Kpi label="Totaal uren" value={totUren ? totUren.toLocaleString("nl-NL") : "—"} />
        <Kpi label={isRecruiter ? "Jouw verdienste (totaal)" : "Recruiters samen"} value={euro2(totRecruiter)} accent />
        {toonMarge && <Kpi label="Te factureren (totaal)" value={euro2(totFactuur)} />}
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Kandidaat</th>
              {!isRecruiter && <th className="px-4 py-3">Recruiter</th>}
              <th className="px-4 py-3">Weggezet bij</th>
              {toonMarge && <th className="px-4 py-3 text-right">Verkoop /u</th>}
              {toonMarge && <th className="px-4 py-3 text-right">Inkoop /u</th>}
              {toonMarge && <th className="px-4 py-3 text-right">Overhead /u</th>}
              {toonMarge && <th className="px-4 py-3 text-right">Nettowinst /u</th>}
              <th className="px-4 py-3 text-right">{isJr ? "Vergoeding /u" : "Recruiter /u"}</th>
              <th className="px-4 py-3 text-right">Uren</th>
              <th className="px-4 py-3 text-right">{isJr ? "Verdienste totaal" : "Recruiter totaal"}</th>
              {toonMarge && <th className="px-4 py-3 text-right">Te factureren</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const uu = u(r.id);
              return (
                <tr key={r.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                  <td className="px-4 py-3"><Link href={`/admin/plaatsingen/${r.id}`} className="font-bold text-cobalt">{r.kandidaat}</Link></td>
                  {!isRecruiter && <td className="px-4 py-3">{r.recruiterNaam}</td>}
                  <td className="px-4 py-3">{r.weggezet}</td>
                  {toonMarge && <td className="px-4 py-3 text-right">{euro2(r.verkoop)}</td>}
                  {toonMarge && <td className="px-4 py-3 text-right">{euro2(r.inkoop)}</td>}
                  {toonMarge && <td className="px-4 py-3 text-right text-muted">{euro2(r.overhead)}</td>}
                  {toonMarge && <td className="px-4 py-3 text-right text-muted">{euro2(r.nettowinst)}</td>}
                  <td className="px-4 py-3 text-right font-bold text-cobalt">{r.teLaag ? <span className="text-red-500">€ 0,00</span> : euro2(r.recruiter)}</td>
                  <td className="px-4 py-2 text-right">
                    <input
                      type="number" min="0" step="0.5" inputMode="decimal"
                      value={uren[r.id] ?? ""} placeholder="0"
                      onChange={(e) => setUren((s) => ({ ...s, [r.id]: e.target.value }))}
                      className="w-20 rounded-lg border-2 border-neutral-200 px-2 py-1.5 text-right focus:border-cobalt focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-3 text-right font-extrabold">{euro2(r2(r.recruiter * uu))}</td>
                  {toonMarge && <td className="px-4 py-3 text-right font-semibold">{euro2(r2(r.verkoop * uu))}</td>}
                </tr>
              );
            })}
            {rows.length === 0 && <tr><td colSpan={12} className="px-5 py-10 text-center text-muted">Nog geen plaatsingen.</td></tr>}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-muted">
        {isJr
          ? "Vul per kandidaat de gemaakte uren in. “Verdienste totaal” = vergoeding /u × uren. De ingevulde uren worden alleen in deze browser bewaard (rekenhulp, geen facturatie)."
          : "Vul per kandidaat de gemaakte uren in. “Recruiter totaal” = recruiter /u × uren. “Te factureren” = verkoop /u × uren (exclusief btw). Recruiter /u = bruto marge − overhead − nettowinst (minimaal € 0). De ingevulde uren worden alleen in deze browser bewaard, dit is een rekenhulp en geen facturatie."}
      </p>
    </>
  );
}

function Kpi({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return <div className="rounded-2xl border border-neutral-200 bg-white p-5"><div className={`text-xl font-extrabold ${accent ? "text-cobalt" : ""}`}>{value}</div><div className="mt-1 text-sm font-semibold text-muted">{label}</div></div>;
}
