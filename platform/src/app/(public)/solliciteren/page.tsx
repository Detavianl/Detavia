import { pageMeta } from "@/lib/seo";
import { submitSollicitatie } from "../actions";
import { VAKGEBIEDEN } from "@/lib/ats";

export const metadata = pageMeta({ title: "Solliciteren", description: "Solliciteer direct of stuur een open sollicitatie naar DetaVia, detachering in het sociaal domein.", path: "/solliciteren" });

export default async function Solliciteren({ searchParams }: { searchParams: Promise<{ titel?: string; vacature_id?: string }> }) {
  const { titel = "", vacature_id = "" } = await searchParams;
  return (
    <>
      {/* HERO */}
      <section className="bg-cobalt text-white">
        <div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-10">
          <p className="text-sm font-semibold opacity-80">Home / Solliciteren</p>
          <h1 className="display mt-3 text-4xl sm:text-6xl">Solliciteer bij DetaVia</h1>
          <p className="mt-5 max-w-[54ch] text-lg font-medium text-white/90">
            {titel ? <>Je solliciteert op <strong>{titel}</strong>. </> : null}
            Laat je gegevens achter en stuur je cv mee, dan nemen we snel persoonlijk contact met je op.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[760px] px-5 py-16 sm:px-10">
        <form action={submitSollicitatie} className="grid gap-5 rounded-[22px] border border-neutral-200 bg-white p-7 shadow-sm sm:p-9" encType="multipart/form-data">
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
          <label className="grid min-w-0 gap-1.5"><span className="text-sm font-bold">Vakgebied</span>
            <select name="vakgebied" className="w-full rounded-xl border-2 border-neutral-200 bg-white px-4 py-3">
              <option value="">—</option>
              {Object.entries(VAKGEBIEDEN).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select></label>
          <label className="grid min-w-0 gap-1.5"><span className="text-sm font-bold">Cv (pdf/doc)</span>
            <input name="cv" type="file" accept=".pdf,.doc,.docx" className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-cobalt file:px-3 file:py-1.5 file:font-bold file:text-white" /></label>
          <button className="justify-self-start rounded-full bg-cobalt px-6 py-3 font-bold text-white transition hover:-translate-y-0.5">Verstuur sollicitatie</button>
        </form>
      </section>
    </>
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
