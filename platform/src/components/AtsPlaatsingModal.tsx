"use client";
import { useState } from "react";
import { berekenMarge, euro2, type MargeConfig } from "@/lib/marge-calc";
import { plaatsVanuitAts } from "@/app/admin/ats/actions";
import type { AtsCard } from "@/lib/ats";

type Opt = { id: string; naam: string };

// Popup die verschijnt zodra een kaart naar "Geplaatst" wordt gesleept: hier
// wordt de plaatsing direct aangemaakt, met velden voorgevuld uit de vacature
// en de kandidaat. Zo hoeft de recruiter dit niet los nog eens in te voeren.
export default function AtsPlaatsingModal({ card, companies, recruiters, config, onDone, onCancel }: {
  card: AtsCard;
  companies: Opt[];
  recruiters: Opt[];
  config: MargeConfig;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [functie, setFunctie] = useState(card.vacature?.titel ?? "");
  const [companyId, setCompanyId] = useState(card.vacature?.company_id ?? "");
  const [recruiterId, setRecruiterId] = useState(card.vacature?.recruiter_id ?? card.candidate?.eigenaar ?? "");
  const [verkoop, setVerkoop] = useState("");
  const [inkoop, setInkoop] = useState("");
  const [start, setStart] = useState("");
  const [eind, setEind] = useState("");
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState("");

  const m = berekenMarge(Number(verkoop) || 0, Number(inkoop) || 0, config);
  const heeftInput = (Number(verkoop) || 0) > 0;
  const recruiterOnbekend = !!recruiterId && !recruiters.some((r) => r.id === recruiterId);

  async function opslaan(e: React.FormEvent) {
    e.preventDefault();
    setBezig(true); setFout("");
    try {
      await plaatsVanuitAts({
        applicationId: card.id,
        candidate_id: card.candidate?.id ?? "",
        company_id: companyId,
        functie,
        uurtarief: verkoop,
        kostprijs: inkoop,
        recruiter_id: recruiterId,
        start_datum: start,
        eind_datum: eind,
      });
      onDone();
    } catch (err) {
      setFout(err instanceof Error ? err.message : "Opslaan mislukt.");
      setBezig(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:p-8" onMouseDown={onCancel}>
      <div className="my-auto w-full max-w-4xl overflow-hidden rounded-[24px] bg-white shadow-2xl" onMouseDown={(e) => e.stopPropagation()}>
        {/* Kop */}
        <div className="relative overflow-hidden bg-cobalt px-6 py-5 text-white">
          <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-yellow/20 blur-2xl" />
          <p className="relative text-xs font-bold uppercase tracking-[.16em] text-arctic">Plaatsing aanmaken</p>
          <h2 className="display relative mt-1 text-2xl leading-tight">{card.candidate?.naam ?? "Kandidaat"}</h2>
          {card.vacature?.titel && <p className="relative mt-0.5 text-sm text-white/85">↳ {card.vacature.titel}</p>}
        </div>

        <form onSubmit={opslaan} className="grid gap-6 p-6 lg:grid-cols-[1.25fr_1fr]">
          {/* Velden */}
          <div className="grid gap-4">
            <label className="grid min-w-0 gap-1.5"><span className="text-sm font-bold">Functie</span>
              <input value={functie} onChange={(e) => setFunctie(e.target.value)} placeholder="bv. Adviseur Sociaal Domein" className="w-full rounded-xl border-2 border-neutral-200 px-4 py-2.5" /></label>

            <label className="grid min-w-0 gap-1.5"><span className="text-sm font-bold">Opdrachtgever</span>
              <select value={companyId} onChange={(e) => setCompanyId(e.target.value)} className="w-full rounded-xl border-2 border-neutral-200 bg-white px-4 py-2.5">
                <option value="">—</option>
                {companies.map((o) => <option key={o.id} value={o.id}>{o.naam}</option>)}
              </select></label>

            <label className="grid min-w-0 gap-1.5"><span className="text-sm font-bold">Recruiter (voor verdiensten)</span>
              <select value={recruiterId} onChange={(e) => setRecruiterId(e.target.value)} className="w-full rounded-xl border-2 border-neutral-200 bg-white px-4 py-2.5">
                <option value="">— geen recruiter gekoppeld —</option>
                {recruiterOnbekend && <option value={recruiterId}>Huidige koppeling (buiten lijst)</option>}
                {recruiters.map((r) => <option key={r.id} value={r.id}>{r.naam}</option>)}
              </select>
              {!recruiterId && <span className="text-xs font-semibold text-red-600">Nog geen recruiter gekoppeld: deze plaatsing telt dan bij niemands verdiensten mee.</span>}
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid min-w-0 gap-1.5"><span className="text-sm font-bold">Verkooptarief (€/uur)</span>
                <input type="number" step="0.01" value={verkoop} onChange={(e) => setVerkoop(e.target.value)} placeholder="84,00" className="w-full rounded-xl border-2 border-neutral-200 px-4 py-2.5" /></label>
              <label className="grid min-w-0 gap-1.5"><span className="text-sm font-bold">Inkooptarief (€/uur)</span>
                <input type="number" step="0.01" value={inkoop} onChange={(e) => setInkoop(e.target.value)} placeholder="44,98" className="w-full rounded-xl border-2 border-neutral-200 px-4 py-2.5" /></label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid min-w-0 gap-1.5"><span className="text-sm font-bold">Startdatum</span>
                <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="w-full rounded-xl border-2 border-neutral-200 px-4 py-2.5" /></label>
              <label className="grid min-w-0 gap-1.5"><span className="text-sm font-bold">Einddatum (optioneel)</span>
                <input type="date" value={eind} onChange={(e) => setEind(e.target.value)} className="w-full rounded-xl border-2 border-neutral-200 px-4 py-2.5" /></label>
            </div>
          </div>

          {/* Live marge-calculator */}
          <aside className="lg:sticky lg:top-0 lg:self-start">
            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
              <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm font-bold">Marge-calculator (per uur)</div>
              <div className="p-4 text-sm">
                <Regel k="Verkooptarief" v={euro2(m.verkoop)} strong />
                <Regel k="Inkooptarief kandidaat" v={`− ${euro2(m.inkoop)}`} />
                <Regel k="Bruto marge" v={euro2(m.brutoMarge)} strong />
                <div className="my-2 border-t border-neutral-100" />
                <Regel k={`Overhead (${m.overheadPct.toLocaleString("nl-NL")}%)`} v={`− ${euro2(m.overhead)}`} klein />
                <Regel k={`Nettowinst DetaVia (${config.nettowinst_pct.toLocaleString("nl-NL")}%)`} v={`− ${euro2(m.nettowinst)}`} klein />
                <div className="my-2 border-t-2 border-neutral-200" />
                {m.teLaag ? (
                  <div className="rounded-xl bg-red-50 p-3 text-red-700">
                    <p className="font-bold">Recruitervergoeding: € 0,00</p>
                    <p className="mt-1 text-xs">Marge te laag: verhoog het verkooptarief of verlaag het inkooptarief.</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between rounded-xl bg-cobalt/[0.06] p-3">
                    <span className="font-bold">Recruitervergoeding /uur</span>
                    <span className="text-lg font-extrabold text-cobalt">{euro2(m.recruiter)}</span>
                  </div>
                )}
                {!heeftInput && <p className="mt-3 text-xs text-muted">Vul verkoop- en inkooptarief in om de opbouw te zien.</p>}
              </div>
            </div>
          </aside>

          {/* Acties (volle breedte) */}
          <div className="lg:col-span-2">
            {fout && <p className="mb-3 text-sm font-semibold text-red-600">{fout}</p>}
            <div className="flex flex-wrap items-center gap-4">
              <button disabled={bezig} className="rounded-full bg-cobalt px-6 py-3 font-bold text-white transition hover:-translate-y-0.5 disabled:opacity-60">
                {bezig ? "Bezig…" : "Plaatsing aanmaken & verplaatsen"}
              </button>
              <button type="button" onClick={onCancel} className="text-sm font-semibold text-muted transition hover:text-ink">Annuleren</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function Regel({ k, v, strong, klein }: { k: string; v: string; strong?: boolean; klein?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-1 ${klein ? "text-[13px] text-muted" : ""} ${strong ? "font-bold" : ""}`}>
      <span>{k}</span>
      <span>{v}</span>
    </div>
  );
}
