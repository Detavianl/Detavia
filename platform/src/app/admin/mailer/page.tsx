"use client";
import { useState } from "react";
import { generateEmailAction, sendEmailAction } from "./actions";
import { MAIL_DOELEN, MAIL_TYPES } from "@/lib/ai-mailer";

export default function MailerPage() {
  const [type, setType] = useState("kandidaat");
  const [doel, setDoel] = useState("uitnodiging");
  const [ontvanger, setOntvanger] = useState("");
  const [naarEmail, setNaarEmail] = useState("");
  const [context, setContext] = useState("");
  const [onderwerp, setOnderwerp] = useState("");
  const [body, setBody] = useState("");
  const [bron, setBron] = useState<"" | "ai" | "sjabloon">("");
  const [bezig, setBezig] = useState(false);
  const [melding, setMelding] = useState("");

  async function genereer() {
    setBezig(true); setMelding("");
    const r = await generateEmailAction({ type, doel, ontvanger, context });
    setOnderwerp(r.onderwerp); setBody(r.body); setBron(r.bron);
    setBezig(false);
  }
  async function verstuur() {
    setMelding("");
    const r = await sendEmailAction(naarEmail, onderwerp, body);
    setMelding(r.melding);
  }

  return (
    <div className="p-8">
      <h1 className="display text-3xl">AI-mailer</h1>
      <p className="mt-1 text-muted">Stel e-mails op in de DetaVia-tone-of-voice. Genereer een concept, pas aan, en verstuur.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Instellingen */}
        <section className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="text-lg font-bold">1. Wat wil je versturen?</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Type ontvanger">
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-xl border-2 border-neutral-200 bg-white px-4 py-3">
                {Object.entries(MAIL_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </Field>
            <Field label="Doel">
              <select value={doel} onChange={(e) => setDoel(e.target.value)} className="w-full rounded-xl border-2 border-neutral-200 bg-white px-4 py-3">
                {Object.entries(MAIL_DOELEN).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Naam ontvanger (optioneel)">
            <input value={ontvanger} onChange={(e) => setOntvanger(e.target.value)} placeholder="bv. Karin Bos" className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3" />
          </Field>
          <Field label="Context / aanvullende info">
            <textarea value={context} onChange={(e) => setContext(e.target.value)} rows={4} placeholder="bv. Gaat over de Wmo-opdracht in Almere, beschikbaar per september, voorstellen voor een gesprek volgende week." className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3" />
          </Field>
          <button onClick={genereer} disabled={bezig} className="self-start rounded-full bg-cobalt px-6 py-3 font-bold text-white disabled:opacity-60">
            {bezig ? "Genereren…" : "✨ Genereer met AI"}
          </button>
        </section>

        {/* Resultaat */}
        <section className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">2. Concept</h2>
            {bron && <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-bold text-muted">{bron === "ai" ? "AI-gegenereerd" : "Sjabloon (geen API-key)"}</span>}
          </div>
          <Field label="Aan (e-mailadres)">
            <input value={naarEmail} onChange={(e) => setNaarEmail(e.target.value)} type="email" placeholder="ontvanger@voorbeeld.nl" className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3" />
          </Field>
          <Field label="Onderwerp">
            <input value={onderwerp} onChange={(e) => setOnderwerp(e.target.value)} className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3" />
          </Field>
          <Field label="Bericht">
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={12} className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3 font-mono text-sm" />
          </Field>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={verstuur} disabled={!body} className="rounded-full bg-black px-6 py-3 font-bold text-white disabled:opacity-50">Versturen</button>
            <button onClick={() => navigator.clipboard.writeText(`${onderwerp}\n\n${body}`)} disabled={!body} className="rounded-full border-2 border-neutral-200 px-6 py-3 font-bold disabled:opacity-50">Kopieer</button>
            {melding && <span className="text-sm font-semibold text-muted">{melding}</span>}
          </div>
        </section>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-bold">{label}</span>
      {children}
    </label>
  );
}
