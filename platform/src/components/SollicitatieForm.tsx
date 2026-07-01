"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { submitSollicitatie } from "@/app/(public)/actions";

const BRONNEN = ["Google", "Facebook", "Instagram", "YouTube", "TikTok", "LinkedIn", "Indeed", "Via vrienden of familie", "Opdrachtgever", "Anders"];

export default function SollicitatieForm({ vacatureId = "", titel = "", backHref = "", backLabel = "Terug" }: { vacatureId?: string; titel?: string; backHref?: string; backLabel?: string }) {
  const [bron, setBron] = useState("");
  const [cvNaam, setCvNaam] = useState("");
  const [sleep, setSleep] = useState(false);
  const cvRef = useRef<HTMLInputElement>(null);

  function onDrop(e: React.DragEvent) {
    e.preventDefault(); setSleep(false);
    const f = e.dataTransfer.files?.[0];
    if (f && cvRef.current) {
      const dt = new DataTransfer(); dt.items.add(f);
      cvRef.current.files = dt.files;
      setCvNaam(f.name);
    }
  }

  return (
    <form action={submitSollicitatie} encType="multipart/form-data" className="rounded-[22px] border border-neutral-200 bg-white p-7 shadow-sm sm:p-9">
      <input type="hidden" name="vacature_id" value={vacatureId} />
      <input type="hidden" name="vacature_titel" value={titel} />

      <h2 className="text-xl font-bold">Jouw gegevens</h2>
      <p className="mt-1 text-sm text-muted">Superleuk dat je wilt solliciteren bij DetaVia. Eerst hebben we wat gegevens van je nodig. Velden met <span className="font-bold text-cobalt">*</span> zijn verplicht.</p>

      <div className="mt-6 grid gap-5">
        <div className="grid gap-5 sm:grid-cols-[1fr_0.6fr_1fr]">
          <Field label="Voornaam *" name="voornaam" required />
          <Field label="Tussenvoegsel" name="tussenvoegsel" />
          <Field label="Achternaam *" name="achternaam" required />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="E-mail *" name="email" type="email" required />
          <Field label="Telefoonnummer *" name="telefoon" type="tel" required />
        </div>

        <label className="grid min-w-0 gap-1.5">
          <span className="text-sm font-bold">Hoe heb je ons gevonden? *</span>
          <select name="gevonden_via" required value={bron} onChange={(e) => setBron(e.target.value)} className="w-full rounded-xl border-2 border-neutral-200 bg-white px-4 py-3">
            <option value="" disabled>Maak een keuze</option>
            {BRONNEN.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </label>
        {bron === "Anders" && (
          <Field label="Namelijk" name="gevonden_anders" />
        )}

        <div className="grid min-w-0 gap-1.5">
          <span className="text-sm font-bold">Cv</span>
          <label
            htmlFor="cv"
            onDragOver={(e) => { e.preventDefault(); setSleep(true); }}
            onDragLeave={() => setSleep(false)}
            onDrop={onDrop}
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition ${sleep ? "border-cobalt bg-cobalt/[0.06]" : "border-neutral-300 hover:border-cobalt hover:bg-cobalt/[0.03]"}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-cobalt"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5-5 5 5" /><path d="M12 5v12" /></svg>
            <span className="text-sm font-semibold">{cvNaam ? cvNaam : "Sleep je cv hierheen of klik om te bladeren"}</span>
            <span className="text-xs text-muted">pdf, doc of docx</span>
          </label>
          <input ref={cvRef} id="cv" name="cv" type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => setCvNaam(e.target.files?.[0]?.name ?? "")} />
        </div>

        <label className="flex items-start gap-2.5 text-sm">
          <input type="checkbox" name="akkoord" required className="mt-0.5 h-4 w-4 shrink-0 accent-cobalt" />
          <span>Ik ga akkoord met de <Link href="/algemene-voorwaarden" className="text-cobalt hover:underline">voorwaarden</Link> en het <Link href="/privacy-statement" className="text-cobalt hover:underline">Privacy Statement</Link>. *</span>
        </label>

        <div className="flex flex-wrap items-center gap-4">
          <button className="rounded-full bg-cobalt px-7 py-3 font-bold text-white transition hover:-translate-y-0.5">Solliciteren</button>
          {backHref && <Link href={backHref} className="text-sm font-semibold text-muted transition hover:text-cobalt">← {backLabel}</Link>}
        </div>
      </div>
    </form>
  );
}

function Field({ label, name, type = "text", required = false }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <label className="grid min-w-0 gap-1.5">
      <span className="text-sm font-bold">{label}</span>
      <input name={name} type={type} required={required} className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3" />
    </label>
  );
}
