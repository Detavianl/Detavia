import { submitSollicitatie } from "../actions";
import { VAKGEBIEDEN } from "@/lib/ats";

export const metadata = { title: "Solliciteren | DetaVia" };

export default async function Solliciteren({ searchParams }: { searchParams: Promise<{ titel?: string; vacature_id?: string }> }) {
  const { titel = "", vacature_id = "" } = await searchParams;
  return (
    <section className="mx-auto max-w-[760px] px-5 py-16 sm:px-10">
      <h1 className="display text-4xl">Solliciteren</h1>
      {titel && <p className="mt-2 text-lg text-muted">Je solliciteert op: <strong>{titel}</strong></p>}
      <form action={submitSollicitatie} className="mt-8 grid gap-5" encType="multipart/form-data">
        <input type="hidden" name="vacature_id" value={vacature_id} />
        <input type="hidden" name="vacature_titel" value={titel} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Naam *" name="naam" required />
          <Field label="E-mail *" name="email" type="email" required />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Telefoon" name="telefoon" type="tel" />
          <Field label="Woonplaats" name="woonplaats" />
        </div>
        <label className="grid gap-1.5"><span className="text-sm font-bold">Vakgebied</span>
          <select name="vakgebied" className="rounded-xl border-2 border-neutral-200 bg-white px-4 py-3">
            <option value="">—</option>
            {Object.entries(VAKGEBIEDEN).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select></label>
        <label className="grid gap-1.5"><span className="text-sm font-bold">Cv (pdf/doc)</span>
          <input name="cv" type="file" accept=".pdf,.doc,.docx" className="rounded-xl border-2 border-neutral-200 px-4 py-3" /></label>
        <button className="justify-self-start rounded-full bg-cobalt px-6 py-3 font-bold text-white">Verstuur sollicitatie</button>
        <p className="text-xs text-muted">Werkt zodra Supabase gekoppeld is. Je gegevens komen dan direct in het ATS.</p>
      </form>
    </section>
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
