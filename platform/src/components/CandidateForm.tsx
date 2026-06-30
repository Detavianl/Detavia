import Link from "next/link";
import { VAKGEBIEDEN, NIVEAUS, KANDIDAAT_STATUS } from "@/lib/ats";

type C = {
  id?: string; naam?: string; email?: string | null; telefoon?: string | null; woonplaats?: string | null;
  linkedin?: string | null; niveau?: string | null; vakgebied?: string | null; huidige_functie?: string | null;
  huidige_werkgever?: string | null; opleidingsniveau?: string | null; regio?: string | null; talen?: string | null;
  rijbewijs?: boolean | null; expertise?: string[] | null; beschikbaar_per?: string | null; uren_beschikbaar?: number | null;
  tarief_min?: number | null; tarief_max?: number | null; status?: string | null;
};

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

export default function CandidateForm({ candidate, action, isEdit }: {
  candidate?: C;
  action: (formData: FormData) => void | Promise<void>;
  isEdit?: boolean;
}) {
  const v = candidate ?? {};
  return (
    <form action={action} className="mx-auto max-w-4xl p-8">
      <div className="sticky top-0 z-10 -mx-8 mb-6 flex items-center justify-between border-b border-neutral-200 bg-neutral-50/90 px-8 py-4 backdrop-blur">
        <div>
          <Link href={isEdit && v.id ? `/admin/kandidaten/${v.id}` : "/admin/kandidaten"} className="text-sm font-semibold text-cobalt">← {isEdit ? "Kandidaat" : "Talentpool"}</Link>
          <h1 className="display text-2xl">{isEdit ? "Kandidaat bewerken" : "Nieuwe kandidaat"}</h1>
        </div>
        <button className="rounded-full bg-cobalt px-6 py-2.5 font-bold text-white">{isEdit ? "Opslaan" : "Opslaan + in funnel"}</button>
      </div>

      {isEdit && v.id && <input type="hidden" name="id" value={v.id} />}

      <div className="grid gap-6">
        <Card title="Persoonlijk" desc="Wie is de kandidaat en hoe bereik je diegene?">
          <Grid>
            <Field className="sm:col-span-2" label="Naam" name="naam" required defaultValue={v.naam} />
            <Field label="E-mail" name="email" type="email" defaultValue={v.email} />
            <Field label="Telefoon" name="telefoon" defaultValue={v.telefoon} />
            <Field label="Woonplaats" name="woonplaats" defaultValue={v.woonplaats} />
            <Field label="LinkedIn" name="linkedin" placeholder="https://linkedin.com/in/…" defaultValue={v.linkedin} />
          </Grid>
        </Card>

        <Card title="Professioneel" desc="Seniority, vakgebied en achtergrond.">
          <Grid>
            <Select label="Niveau" name="niveau" defaultValue={v.niveau ?? ""} options={[["", "—"], ...NIVEAUS.map((n) => [n, cap(n)] as [string, string])]} />
            <Select label="Vakgebied" name="vakgebied" defaultValue={v.vakgebied ?? ""} options={[["", "—"], ...Object.entries(VAKGEBIEDEN)]} />
            <Field label="Huidige functie" name="huidige_functie" defaultValue={v.huidige_functie} />
            <Field label="Huidige werkgever" name="huidige_werkgever" defaultValue={v.huidige_werkgever} />
            <Field label="Opleidingsniveau" name="opleidingsniveau" defaultValue={v.opleidingsniveau} />
            <Field label="Regio / mobiliteit" name="regio" defaultValue={v.regio} />
            <Field label="Talen" name="talen" placeholder="Nederlands, Engels" defaultValue={v.talen} />
            <label className="flex items-end gap-2 pb-3 font-semibold">
              <input type="checkbox" name="rijbewijs" defaultChecked={!!v.rijbewijs} className="h-5 w-5 accent-cobalt" /> Rijbewijs
            </label>
            <Field className="sm:col-span-2" label="Expertise" name="expertise" placeholder="Leerplicht, Complexe casuïstiek (komma-gescheiden)" defaultValue={(v.expertise ?? []).join(", ")} />
          </Grid>
        </Card>

        <Card title="Beschikbaarheid & tarief" desc="Vanaf wanneer, hoeveel uur en tegen welk tarief.">
          <Grid>
            <Field label="Beschikbaar per" name="beschikbaar_per" type="date" defaultValue={v.beschikbaar_per} />
            <Field label="Uren per week" name="uren_beschikbaar" type="number" placeholder="32" defaultValue={v.uren_beschikbaar} />
            <Field label="Uurtarief min (€)" name="tarief_min" type="number" placeholder="80" defaultValue={v.tarief_min} />
            <Field label="Uurtarief max (€)" name="tarief_max" type="number" placeholder="95" defaultValue={v.tarief_max} />
          </Grid>
        </Card>

        <Card title={isEdit ? "Status" : "Status & eerste notitie"}>
          <Grid>
            <Select label="Status" name="status" defaultValue={v.status ?? "actief"} options={Object.entries(KANDIDAAT_STATUS)} />
            <div className="hidden sm:block" />
            {!isEdit && (
              <label className="grid min-w-0 gap-1.5 sm:col-span-2">
                <span className="text-sm font-bold">Eerste notitie (optioneel)</span>
                <span className="text-xs text-neutral-500">Verschijnt als notitie bij de kandidaat. Meer notities voeg je toe op de kandidaatpagina.</span>
                <textarea name="notitie" rows={3} className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3" />
              </label>
            )}
          </Grid>
        </Card>
      </div>
    </form>
  );
}

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
function Field({ label, name, type = "text", required = false, placeholder, className = "", defaultValue }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string; className?: string; defaultValue?: string | number | null }) {
  return (
    <label className={`grid min-w-0 gap-1.5 ${className}`}>
      <span className="text-sm font-bold">{label}{required && " *"}</span>
      <input name={name} type={type} required={required} placeholder={placeholder} defaultValue={defaultValue ?? ""} className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3" />
    </label>
  );
}
function Select({ label, name, options, defaultValue }: { label: string; name: string; options: [string, string][]; defaultValue?: string }) {
  return (
    <label className="grid min-w-0 gap-1.5">
      <span className="text-sm font-bold">{label}</span>
      <select name={name} defaultValue={defaultValue} className="w-full rounded-xl border-2 border-neutral-200 bg-white px-4 py-3">
        {options.map(([val, l]) => <option key={val} value={val}>{l}</option>)}
      </select>
    </label>
  );
}
