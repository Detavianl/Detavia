import Link from "next/link";
import { createCandidate } from "../actions";
import { VAKGEBIEDEN } from "@/lib/ats";

export default function NieuweKandidaat() {
  return (
    <div className="p-8">
      <Link href="/admin/kandidaten" className="text-sm font-semibold text-cobalt">← Kandidaten</Link>
      <h1 className="display mt-2 text-3xl">Nieuwe kandidaat</h1>
      <form action={createCandidate} className="mt-8 grid max-w-xl gap-4">
        <Field label="Naam *" name="naam" required />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="E-mail" name="email" type="email" />
          <Field label="Telefoon" name="telefoon" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Woonplaats" name="woonplaats" />
          <label className="grid gap-1.5">
            <span className="text-sm font-bold">Vakgebied</span>
            <select name="vakgebied" className="rounded-xl border-2 border-neutral-200 bg-white px-4 py-3">
              <option value="">—</option>
              {Object.entries(VAKGEBIEDEN).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </label>
        </div>
        <Field label="LinkedIn" name="linkedin" />
        <label className="grid gap-1.5">
          <span className="text-sm font-bold">Notitie</span>
          <textarea name="notitie" rows={3} className="rounded-xl border-2 border-neutral-200 px-4 py-3" />
        </label>
        <button className="justify-self-start rounded-full bg-cobalt px-6 py-3 font-bold text-white">Opslaan + in ATS</button>
      </form>
    </div>
  );
}

function Field({ label, name, type = "text", required = false }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-bold">{label}</span>
      <input name={name} type={type} required={required} className="rounded-xl border-2 border-neutral-200 px-4 py-3" />
    </label>
  );
}
