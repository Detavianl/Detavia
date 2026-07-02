"use client";
import Link from "next/link";
import { useState } from "react";
import { createPlacement } from "@/app/admin/plaatsingen/actions";
import { berekenMarge, euro2, type MargeConfig } from "@/lib/marge-calc";
import { euroMaand, euroUur, tredeOpties, tredeInfo, type Trede } from "@/lib/schalen-util";

type Opt = { id: string; naam: string };
type Cand = { id: string; naam: string; eigenaar: string | null };

export default function PlacementForm({ candidates, companies, recruiters, config, tredes = [], currentUserId = "", currentUserNaam = "", canEditRecruiter = false, toonMarge = true }: { candidates: Cand[]; companies: Opt[]; recruiters: Opt[]; config: MargeConfig; tredes?: Trede[]; currentUserId?: string; currentUserNaam?: string; canEditRecruiter?: boolean; toonMarge?: boolean }) {
  const [verkoop, setVerkoop] = useState("");
  const [inkoop, setInkoop] = useState("");
  const [uren, setUren] = useState("");
  const [trede, setTrede] = useState("");
  const tInfo = tredeInfo(tredes, trede);

  // Bij het kiezen van een trede het inkooptarief automatisch overnemen.
  function kiesTrede(v: string) {
    setTrede(v);
    const info = tredeInfo(tredes, v);
    if (info?.inkooptarief_uur != null) setInkoop(String(info.inkooptarief_uur));
  }
  const [candidateId, setCandidateId] = useState(candidates[0]?.id ?? "");
  // Recruiter = standaard de ingelogde gebruiker (de aanmaker).
  const [recruiterId, setRecruiterId] = useState(currentUserId);
  const m = berekenMarge(Number(verkoop) || 0, Number(inkoop) || 0, config);
  const heeftInput = (Number(verkoop) || 0) > 0;

  const kiesKandidaat = (id: string) => setCandidateId(id);
  const recruiterOnbekend = !!recruiterId && !recruiters.some((r) => r.id === recruiterId);

  return (
    <div className={`mx-auto grid gap-8 p-8 ${toonMarge ? "max-w-5xl lg:grid-cols-[1.3fr_1fr]" : "max-w-2xl"}`}>
      <form action={createPlacement} className="grid gap-5">
        <div>
          <Link href="/admin/plaatsingen" className="text-sm font-semibold text-cobalt">← Plaatsingen</Link>
          <h1 className="display mt-2 text-3xl">Nieuwe plaatsing</h1>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-1.5"><span className="text-sm font-bold">Professional</span>
            <select name="candidate_id" value={candidateId} onChange={(e) => kiesKandidaat(e.target.value)} className="rounded-xl border-2 border-neutral-200 bg-white px-4 py-3">
              {candidates.map((o) => <option key={o.id} value={o.id}>{o.naam}</option>)}
            </select></label>
          <Sel label="Opdrachtgever" name="company_id" options={companies} leeg />
        </div>
        <label className="grid gap-1.5"><span className="text-sm font-bold">Recruiter (voor verdiensten)</span>
          {canEditRecruiter ? (
            <>
              <select name="recruiter_id" value={recruiterId} onChange={(e) => setRecruiterId(e.target.value)} className="rounded-xl border-2 border-neutral-200 bg-white px-4 py-3">
                <option value="">— geen recruiter gekoppeld —</option>
                {recruiterOnbekend && <option value={recruiterId}>Huidige koppeling (buiten lijst)</option>}
                {recruiters.map((r) => <option key={r.id} value={r.id}>{r.naam}</option>)}
              </select>
              <span className="text-xs text-muted">Als super-admin kun je een andere recruiter kiezen; standaard ben jij dat. Hierop rekent Verdiensten af.</span>
              {!recruiterId && <span className="text-xs font-semibold text-red-600">Let op: nog geen recruiter gekoppeld. Deze plaatsing telt dan bij niemands verdiensten mee.</span>}
            </>
          ) : (
            <input value={currentUserNaam || "Jij (automatisch)"} disabled className="rounded-xl border-2 border-neutral-200 bg-neutral-50 px-4 py-3 text-muted" />
          )}
          {!canEditRecruiter && <span className="text-xs text-muted">Automatisch aan jou gekoppeld. Alleen een super-admin kan dit voor een ander wijzigen.</span>}
        </label>
        <Field label="Functie" name="functie" placeholder="bv. Adviseur Sociaal Domein" />
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-1.5"><span className="text-sm font-bold">Verkooptarief aan opdrachtgever (€/uur)</span>
            <input name="uurtarief" type="number" step="0.01" value={verkoop} onChange={(e) => setVerkoop(e.target.value)} placeholder="84,00" className="rounded-xl border-2 border-neutral-200 px-4 py-3" /></label>
          <label className="grid gap-1.5"><span className="text-sm font-bold">Inkooptarief kandidaat (€/uur)</span>
            <input name="kostprijs" type="number" step="0.01" value={inkoop} onChange={(e) => setInkoop(e.target.value)} placeholder="44,98" className="rounded-xl border-2 border-neutral-200 px-4 py-3" /></label>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid min-w-0 gap-1.5"><span className="text-sm font-bold">Uren per week</span>
            <input name="uren_per_week" type="number" step="0.5" min="0" value={uren} onChange={(e) => setUren(e.target.value)} placeholder="bv. 32" className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3" />
            <span className="text-xs text-muted">Voor inzicht in part-time of full-time.</span>
          </label>
          <div className="grid min-w-0 content-start gap-1.5">
            <span className="text-sm font-bold">Trede</span>
            <select name="trede" value={trede} onChange={(e) => kiesTrede(e.target.value)} className="w-full rounded-xl border-2 border-neutral-200 bg-white px-4 py-3">
              <option value="">Kies trede…</option>
              {tredeOpties(tredes).map((t) => <option key={t} value={t}>Trede {t}</option>)}
            </select>
            <input type="hidden" name="trede_maandsalaris" value={tInfo?.maandsalaris ?? ""} />
            <span className="text-xs text-muted">
              {tInfo ? <>Inkoop <b>{tInfo.inkooptarief_uur != null ? euroUur(tInfo.inkooptarief_uur) : "—"}</b>/uur · bruto {tInfo.maandsalaris != null ? euroMaand(tInfo.maandsalaris) : "—"} p/m. </> : tredes.length === 0 ? <>Nog geen tredes ingevuld. </> : <>Kies een trede; inkooptarief wordt automatisch overgenomen. </>}
              <Link href="/admin/instellingen/schalen" className="font-semibold text-cobalt hover:underline">Tabel beheren →</Link>
            </span>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Startdatum" name="start_datum" type="date" />
          <Field label="Einddatum (optioneel)" name="eind_datum" type="date" />
        </div>
        <p className="text-xs text-muted">Vul alleen verkoop- en inkooptarief in, de recruitervergoeding rekent rechts automatisch uit. De professional ziet alleen z&apos;n plaatsing en uren, niet de bedragen.</p>
        <button className="justify-self-start rounded-full bg-cobalt px-6 py-3 font-bold text-white">Opslaan</button>
      </form>

      {/* LIVE CALCULATOR (verborgen voor jr. recruiter) */}
      {toonMarge && (
      <aside className="lg:sticky lg:top-6 lg:self-start">
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <div className="border-b border-neutral-200 bg-neutral-50 px-5 py-3 font-bold">Marge-calculator (per uur)</div>
          <div className="p-5 text-sm">
            <Regel k="Verkooptarief" v={euro2(m.verkoop)} pct="100%" strong />
            <Regel k="Inkooptarief kandidaat" v={`− ${euro2(m.inkoop)}`} />
            <Regel k="Bruto marge" v={euro2(m.brutoMarge)} strong />
            <div className="my-2 border-t border-neutral-100" />
            <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-muted">Overhead</p>
            <Regel k="Ziekteverzuim & loondoorbetaling" v={`− ${euro2(m.posten.ziekteverzuim)}`} klein />
            <Regel k="Administratie, facturatie & payroll" v={`− ${euro2(m.posten.administratie)}`} klein />
            <Regel k="Juridisch / compliance" v={`− ${euro2(m.posten.juridisch)}`} klein />
            <Regel k="Verzekeringen" v={`− ${euro2(m.posten.verzekeringen)}`} klein />
            <Regel k={`Subtotaal overhead (${m.overheadPct.toLocaleString("nl-NL")}%)`} v={`− ${euro2(m.overhead)}`} />
            <div className="my-2 border-t border-neutral-100" />
            <Regel k={`Nettowinst DetaVia (${config.nettowinst_pct.toLocaleString("nl-NL")}%)`} v={`− ${euro2(m.nettowinst)}`} />
            <div className="my-2 border-t-2 border-neutral-200" />
            {m.teLaag ? (
              <div className="rounded-xl bg-red-50 p-3 text-red-700">
                <p className="font-bold">Recruitervergoeding: € 0,00</p>
                <p className="mt-1 text-xs">Marge te laag: na overhead en {config.nettowinst_pct.toLocaleString("nl-NL")}% nettowinst blijft er niets over. Verhoog het verkooptarief of verlaag het inkooptarief.</p>
              </div>
            ) : (
              <div className="rounded-xl bg-cobalt/[0.06] p-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold">Recruitervergoeding /uur</span>
                  <span className="text-lg font-extrabold text-cobalt">{euro2(m.recruiter)}</span>
                </div>
                <p className="mt-1 text-xs text-muted">Wat overblijft na overhead en nettowinst.</p>
              </div>
            )}
            {!heeftInput && <p className="mt-3 text-xs text-muted">Vul een verkoop- en inkooptarief in om de opbouw te zien.</p>}
          </div>
        </div>
      </aside>
      )}
    </div>
  );
}

function Regel({ k, v, pct, strong, klein }: { k: string; v: string; pct?: string; strong?: boolean; klein?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-1 ${klein ? "text-[13px] text-muted" : ""} ${strong ? "font-bold" : ""}`}>
      <span>{k}</span>
      <span className="flex items-center gap-2">{pct && <span className="text-[11px] text-muted">{pct}</span>}{v}</span>
    </div>
  );
}
function Field({ label, name, type = "text", placeholder }: { label: string; name: string; type?: string; placeholder?: string }) {
  return <label className="grid gap-1.5"><span className="text-sm font-bold">{label}</span><input name={name} type={type} placeholder={placeholder} className="rounded-xl border-2 border-neutral-200 px-4 py-3" /></label>;
}
function Sel({ label, name, options, leeg }: { label: string; name: string; options: Opt[]; leeg?: boolean }) {
  return <label className="grid gap-1.5"><span className="text-sm font-bold">{label}</span>
    <select name={name} className="rounded-xl border-2 border-neutral-200 bg-white px-4 py-3">
      {leeg && <option value="">—</option>}
      {options.map((o) => <option key={o.id} value={o.id}>{o.naam}</option>)}
    </select></label>;
}
