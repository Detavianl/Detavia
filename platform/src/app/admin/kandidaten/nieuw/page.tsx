import Link from "next/link";
import { createCandidate } from "../actions";
import { VAKGEBIEDEN, NIVEAUS, KANDIDAAT_STATUS } from "@/lib/ats";

export default function NieuweKandidaat() {
  return (
    <form action={createCandidate} className="mx-auto max-w-4xl p-8">
      {/* sticky kop met opslaan */}
      <div className="sticky top-0 z-10 -mx-8 mb-6 flex items-center justify-between border-b border-neutral-200 bg-neutral-50/90 px-8 py-4 backdrop-blur">
        <div>
          <Link href="/admin/kandidaten" className="text-sm font-semibold text-cobalt">← Talentpool</Link>
          <h1 className="display text-2xl">Nieuwe kandidaat</h1>
        </div>
        <button className="rounded-full bg-cobalt px-6 py-2.5 font-bold text-white">Opslaan + in funnel</button>
      </div>

      <div className="grid gap-6">
        <Card title="Persoonlijk" desc="Wie is de kandidaat en hoe bereik je diegene?">
          <Grid>
            <Field className="sm:col-span-2" label="Naam" name="naam" required />
            <Field label="E-mail" name="email" type="email" />
            <Field label="Telefoon" name="telefoon" />
            <Field label="Woonplaats" name="woonplaats" />
            <Field label="LinkedIn" name="linkedin" placeholder="https://linkedin.com/in/…" />
          </Grid>
        </Card>

        <Card title="Professioneel" desc="Seniority, vakgebied en achtergrond.">
          <Grid>
            <Select label="Niveau" name="niveau" options={[["", "—"], ...NIVEAUS.map((n) => [n, cap(n)] as [string, string])]} />
            <Select label="Vakgebied" name="vakgebied" options={[["", "—"], ...Object.entries(VAKGEBIEDEN)]} />
            <Field label="Huidige functie" name="huidige_functie" />
            <Field label="Huidige werkgever" name="huidige_werkgever" />
            <Field label="Opleidingsniveau" name="opleidingsniveau" />
            <Field label="Regio / mobiliteit" name="regio" />
            <Field label="Talen" name="talen" placeholder="Nederlands, Engels" />
            <label className="flex items-end gap-2 pb-3 font-semibold">
              <input type="checkbox" name="rijbewijs" className="h-5 w-5 accent-cobalt" /> Rijbewijs
            </label>
            <Field className="sm:col-span-2" label="Expertise" name="expertise" placeholder="Wmo, Complexe casuïstiek, Teamleiding (komma-gescheiden)" />
          </Grid>
        </Card>

        <Card title="Beschikbaarheid & tarief" desc="Vanaf wanneer, hoeveel uur en tegen welk tarief.">
          <Grid>
            <Field label="Beschikbaar per" name="beschikbaar_per" type="date" />
            <Field label="Uren per week" name="uren_beschikbaar" type="number" placeholder="32" />
            <Field label="Uurtarief min (€)" name="tarief_min" type="number" placeholder="80" />
            <Field label="Uurtarief max (€)" name="tarief_max" type="number" placeholder="95" />
          </Grid>
        </Card>

        <Card title="Status & notitie">
          <Grid>
            <Select label="Status" name="status" options={Object.entries(KANDIDAAT_STATUS)} defaultValue="actief" />
            <div className="hidden sm:block" />
            <label className="grid gap-1.5 sm:col-span-2">
              <span className="text-sm font-bold">Interne notitie</span>
              <textarea name="notitie" rows={3} className="rounded-xl border-2 border-neutral-200 px-4 py-3" />
            </label>
          </Grid>
        </Card>
      </div>
    </form>
  );
}

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

function Card({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6">
      <h2 className="text-lg font-bold">{title}</h2>
      {desc && <p className="mb-4 mt-0.5 text-sm text-muted">{desc}</p>}
      <div className={desc ? "" : "mt-4"}>{children}</div>
    </section>
  );
}
function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-5 sm:grid-cols-2">{children}</div>;
}
function Field({ label, name, type = "text", required = false, placeholder, className = "" }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string; className?: string }) {
  return (
    <label className={`grid gap-1.5 ${className}`}>
      <span className="text-sm font-bold">{label}{required && " *"}</span>
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
