"use client";
import { useMemo, useState } from "react";
import { generateEmailAction, sendEmailAction } from "./actions";
import { MAIL_DOELEN, MAIL_TYPES } from "@/lib/ai-mailer";
import { renderDetaviaEmail } from "@/lib/email-template";

export default function MailerPage() {
  const [type, setType] = useState("kandidaat");
  const [doel, setDoel] = useState("uitnodiging");
  const [ontvanger, setOntvanger] = useState("");
  const [naarEmail, setNaarEmail] = useState("");
  const [context, setContext] = useState("");
  const [onderwerp, setOnderwerp] = useState("");
  const [body, setBody] = useState("");
  const [ctaLabel, setCtaLabel] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [bron, setBron] = useState<"" | "ai" | "sjabloon">("");
  const [bezig, setBezig] = useState(false);
  const [melding, setMelding] = useState("");
  const [tab, setTab] = useState<"voorbeeld" | "html">("voorbeeld");

  const html = useMemo(() => renderDetaviaEmail({ onderwerp, body, ctaLabel, ctaUrl }), [onderwerp, body, ctaLabel, ctaUrl]);

  async function genereer() {
    setBezig(true); setMelding("");
    const r = await generateEmailAction({ type, doel, ontvanger, context });
    setOnderwerp(r.onderwerp); setBody(r.body);
    setCtaLabel(r.cta_label ?? ""); setCtaUrl(r.cta_url ?? "");
    setBron(r.bron); setBezig(false);
  }
  async function verstuur() {
    setMelding("");
    const r = await sendEmailAction(naarEmail, onderwerp, html);
    setMelding(r.melding);
  }

  return (
    <div className="p-8">
      <h1 className="display text-3xl">AI-mailer</h1>
      <p className="mt-1 text-muted">Genereer een mooie HTML-mail in de DetaVia-huisstijl, pas aan en verstuur.</p>

      {/* 1. Instellingen */}
      <section className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Type ontvanger"><select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-xl border-2 border-neutral-200 bg-white px-4 py-3">{Object.entries(MAIL_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></Field>
          <Field label="Doel"><select value={doel} onChange={(e) => setDoel(e.target.value)} className="w-full rounded-xl border-2 border-neutral-200 bg-white px-4 py-3">{Object.entries(MAIL_DOELEN).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></Field>
          <Field label="Naam ontvanger"><input value={ontvanger} onChange={(e) => setOntvanger(e.target.value)} placeholder="bv. Karin Bos" className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3" /></Field>
          <button onClick={genereer} disabled={bezig} className="h-[50px] rounded-full bg-cobalt px-6 font-bold text-white disabled:opacity-60">{bezig ? "Genereren…" : "✨ Genereer met AI"}</button>
        </div>
        <Field label="Context / aanvullende info" className="mt-4">
          <textarea value={context} onChange={(e) => setContext(e.target.value)} rows={2} placeholder="bv. Wmo-opdracht in Almere, beschikbaar per september, voorstellen voor een gesprek volgende week." className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3" />
        </Field>
      </section>

      {/* 2. Bewerken + live voorbeeld */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Bewerken</h2>
            {bron && <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-bold text-muted">{bron === "ai" ? "AI-gegenereerd" : "Sjabloon (geen API-key)"}</span>}
          </div>
          <Field label="Aan (e-mailadres)"><input value={naarEmail} onChange={(e) => setNaarEmail(e.target.value)} type="email" placeholder="ontvanger@voorbeeld.nl" className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3" /></Field>
          <Field label="Onderwerp"><input value={onderwerp} onChange={(e) => setOnderwerp(e.target.value)} className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3" /></Field>
          <Field label="Bericht"><textarea value={body} onChange={(e) => setBody(e.target.value)} rows={9} className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3 text-sm" /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Knoptekst (optioneel)"><input value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} placeholder="Plan een afspraak" className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3" /></Field>
            <Field label="Knop-link"><input value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} placeholder="https://…" className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3" /></Field>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={verstuur} disabled={!body} className="rounded-full bg-black px-6 py-3 font-bold text-white disabled:opacity-50">Versturen</button>
            <button onClick={() => navigator.clipboard.writeText(html)} disabled={!body} className="rounded-full border-2 border-neutral-200 px-6 py-3 font-bold disabled:opacity-50">Kopieer HTML</button>
            {melding && <span className="text-sm font-semibold text-muted">{melding}</span>}
          </div>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-3">
          <div className="mb-2 flex gap-1 px-1">
            <Tab on={tab === "voorbeeld"} onClick={() => setTab("voorbeeld")}>Voorbeeld</Tab>
            <Tab on={tab === "html"} onClick={() => setTab("html")}>HTML</Tab>
          </div>
          {tab === "voorbeeld" ? (
            <iframe srcDoc={html} title="E-mail voorbeeld" className="h-[620px] w-full rounded-xl border border-neutral-200 bg-neutral-100" />
          ) : (
            <pre className="h-[620px] overflow-auto rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-[11px] leading-snug">{html}</pre>
          )}
        </section>
      </div>
    </div>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return <label className={`grid gap-1.5 ${className}`}><span className="text-sm font-bold">{label}</span>{children}</label>;
}
function Tab({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} className={`rounded-lg px-3 py-1.5 text-sm font-bold ${on ? "bg-cobalt text-white" : "text-muted hover:bg-neutral-100"}`}>{children}</button>;
}
