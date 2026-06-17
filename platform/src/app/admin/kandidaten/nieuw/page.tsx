import Link from "next/link";
import { createCandidate } from "../actions";
import { VAKGEBIEDEN, NIVEAUS, KANDIDAAT_STATUS } from "@/lib/ats";

export default function NieuweKandidaat() {
  return (
    <div className="p-8">
      <Link href="/admin/kandidaten" className="text-sm font-semibold text-cobalt">← Kandidaten</Link>
      <h1 className="display mt-2 text-3xl">Nieuwe kandidaat</h1>
      <form action={createCandidate} className="mt-8 grid max-w-2xl gap-5">
        <Field label="Naam *" name="naam" required />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="E-mail" name="email" type="email" />
          <Field label="Telefoon" name="telefoon" />
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Woonplaats" name="woonplaats" />
          <Select label="Vakgebied" name="vakgebied" options={[["", "—"], ...Object.entries(VAKGEBIEDEN)]} />
          <Select label="Niveau" name="niveau" options={[["", "—"], ...NIVEAUS.map((n) => [n, n[0].toUpperCase() + n.slice(1)] as [string, string])]} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Huidige functie" name="huidige_functie" />
          <Field label="Huidige werkgever" name="huidige_werkgever" />
        </div>
        <div className="grid gap-5 sm:grid-cols-4">
          <Field label="Beschikbaar per" name="beschikbaar_per" type="date" />
          <Field label="Uren/week" name="uren_beschikbaar" type="number" />
          <Field label="Tarief min (€/u)" name="tarief_min" type="number" />
          <Field label="Tarief max (€/u)" name="tarief_max" type="number" />
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Opleidingsniveau" name="opleidingsniveau" />
          <Field label="Regio / mobiliteit" name="regio" />
          <Field label="Talen" name="talen" />
        </div>
        <Field label="Expertise (komma-gescheiden)" name="expertise" placeholder="Wmo, Complexe casuïstiek, Teamleiding" />
        <div className="grid gap-5 sm:grid-cols-2">
          <Select label="Status" name="status" options={Object.entries(KANDIDAAT_STATUS)} defaultValue="actief" />
          <label className="flex items-end gap-2 pb-3 font-semibold">
            <input type="checkbox" name="rijbewijs" className="h-5 w-5 accent-cobalt" /> Rijbewijs
          </label>
        </div>
        <Field label="LinkedIn" name="linkedin" />
        <label className="grid gap-1.5"><span className="text-sm font-bold">Notitie</span>
          <textarea name="notitie" rows={3} className="rounded-xl border-2 border-neutral-200 px-4 py-3" /></label>
        <button className="justify-self-start rounded-full bg-cobalt px-6 py-3 font-bold text-white">Opslaan + in funnel</button>
      </form>
    </div>
  );
}

function Field({ label, name, type = "text", required = false, placeholder }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-bold">{label}</span>
      <input name={name} type={type} required={required} placeholder={placeholder} className="rounded-xl border-2 border-neutral-200 px-4 py-3" />
    </label>
  );
}
function Select({ label, name, options, defaultValue }: { label: string; name: string; options: [string, string][]; defaultValue?: string }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-bold">{label}</span>
      <select name={name} defaultValue={defaultValue} className="rounded-xl border-2 border-neutral-200 bg-white px-4 py-3">
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  );
}
