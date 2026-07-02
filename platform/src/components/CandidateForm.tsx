import Link from "next/link";
import { VAKGEBIEDEN, NIVEAUS, KANDIDAAT_STATUS } from "@/lib/ats";
import SubmitButton from "@/components/SubmitButton";
import AdresVelden from "@/components/AdresVelden";

type Team = { user_id: string; naam: string };

type C = {
  id?: string; naam?: string; email?: string | null; telefoon?: string | null; woonplaats?: string | null;
  postcode?: string | null; huisnummer?: string | null; straat?: string | null; geboortedatum?: string | null;
  linkedin?: string | null; niveau?: string | null; vakgebied?: string | null; huidige_functie?: string | null;
  huidige_werkgever?: string | null; opleidingsniveau?: string | null; regio?: string | null; talen?: string | null;
  rijbewijs?: boolean | null; expertise?: string[] | null; beschikbaar_per?: string | null; uren_beschikbaar?: number | null;
  tarief_min?: number | null; tarief_max?: number | null; status?: string | null;
};

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

// Splitst een volledige naam in delen om de losse velden voor te vullen
// (eerste woord = voornaam, laatste = achternaam, de rest = tussenvoegsel).
function deelNaam(naam?: string | null) {
  const delen = (naam ?? "").trim().split(/\s+/).filter(Boolean);
  if (delen.length === 0) return { voornaam: "", tussenvoegsel: "", achternaam: "" };
  if (delen.length === 1) return { voornaam: delen[0], tussenvoegsel: "", achternaam: "" };
  return { voornaam: delen[0], tussenvoegsel: delen.slice(1, -1).join(" "), achternaam: delen[delen.length - 1] };
}

// Landcodes voor het telefoonveld (Nederland, België, Duitsland).
const LANDCODES: [string, string][] = [["+31", "🇳🇱 +31"], ["+32", "🇧🇪 +32"], ["+49", "🇩🇪 +49"]];

// Splitst een opgeslagen telefoonnummer in landcode + nummer om voor te vullen.
function deelTelefoon(t?: string | null) {
  const s = (t ?? "").trim();
  for (const [code] of LANDCODES) {
    if (s.startsWith(code)) return { code, nummer: s.slice(code.length).trim() };
  }
  return { code: "+31", nummer: s };
}

export default function CandidateForm({ candidate, action, isEdit, canEditOwner = false, team = [], eigenaar = "", eigenaarNaam = "" }: {
  candidate?: C;
  action: (formData: FormData) => void | Promise<void>;
  isEdit?: boolean;
  canEditOwner?: boolean;
  team?: Team[];
  eigenaar?: string;
  eigenaarNaam?: string;
}) {
  const v = candidate ?? {};
  const n = deelNaam(v.naam);
  const tel = deelTelefoon(v.telefoon);
  return (
    <form action={action} className="mx-auto max-w-4xl p-8">
      <div className="sticky top-0 z-10 -mx-8 mb-6 flex items-center justify-between border-b border-neutral-200 bg-neutral-50/90 px-8 py-4 backdrop-blur">
        <div>
          <Link href={isEdit && v.id ? `/admin/kandidaten/${v.id}` : "/admin/kandidaten"} className="text-sm font-semibold text-cobalt">← {isEdit ? "Kandidaat" : "Talentpool"}</Link>
          <h1 className="display text-2xl">{isEdit ? "Kandidaat bewerken" : "Nieuwe kandidaat"}</h1>
        </div>
        <SubmitButton className="rounded-full bg-cobalt px-6 py-2.5 font-bold text-white">{isEdit ? "Opslaan" : "Opslaan + in funnel"}</SubmitButton>
      </div>

      {isEdit && v.id && <input type="hidden" name="id" value={v.id} />}

      <div className="grid gap-6">
        <Card title="Persoonlijk" desc="Wie is de kandidaat en hoe bereik je diegene?">
          <Grid>
            <div className="grid gap-5 sm:col-span-2 sm:grid-cols-[1fr_0.6fr_1fr]">
              <Field label="Voornaam" name="voornaam" required defaultValue={n.voornaam} />
              <Field label="Tussenvoegsel" name="tussenvoegsel" defaultValue={n.tussenvoegsel} />
              <Field label="Achternaam" name="achternaam" required defaultValue={n.achternaam} />
            </div>
            <Field label="E-mail" name="email" type="email" defaultValue={v.email} />
            <Field label="Geboortedatum" name="geboortedatum" type="date" defaultValue={v.geboortedatum} />
            <label className="grid min-w-0 gap-1.5">
              <span className="text-sm font-bold">Telefoon</span>
              <div className="flex gap-2">
                <select name="tel_landcode" defaultValue={tel.code} className="shrink-0 rounded-xl border-2 border-neutral-200 bg-white px-3 py-3">
                  {LANDCODES.map(([code, label]) => <option key={code} value={code}>{label}</option>)}
                </select>
                <input name="tel_nummer" type="tel" defaultValue={tel.nummer} placeholder="6 12345678" className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3" />
              </div>
            </label>
            <AdresVelden postcode={v.postcode} huisnummer={v.huisnummer} straat={v.straat} woonplaats={v.woonplaats} />
            <Field label="LinkedIn" name="linkedin" placeholder="https://linkedin.com/in/…" defaultValue={v.linkedin} />
            {canEditOwner ? (
              <label className="grid min-w-0 gap-1.5">
                <span className="text-sm font-bold">Eigenaar</span>
                <select name="eigenaar" defaultValue={eigenaar} className="w-full rounded-xl border-2 border-neutral-200 bg-white px-4 py-3">
                  <option value="">— niemand —</option>
                  {team.map((t) => <option key={t.user_id} value={t.user_id}>{t.naam}</option>)}
                </select>
                <span className="text-xs text-muted">Als super-admin kun je de eigenaar wijzigen. Standaard is dit de aanmaker.</span>
              </label>
            ) : (
              <label className="grid min-w-0 gap-1.5">
                <span className="text-sm font-bold">Eigenaar</span>
                <input value={eigenaarNaam || "Jij (automatisch)"} disabled className="w-full rounded-xl border-2 border-neutral-200 bg-neutral-50 px-4 py-3 text-muted" />
                <span className="text-xs text-muted">Automatisch gekoppeld. Alleen een super-admin kan dit wijzigen.</span>
              </label>
            )}
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
