import { submitContact } from "../actions";

export const metadata = { title: "Contact & veelgestelde vragen | DetaVia" };

const faq = [
  ["Voor wie is DetaVia bedoeld?", "Voor professionals in het sociaal domein, van starter tot ervaren consulent of adviseur, die via detachering willen werken aan opdrachten met impact."],
  ["In welke vakgebieden bemiddelt DetaVia?", "Uitsluitend binnen het sociaal domein: Wmo, Jeugd, Participatie, Schuldhulpverlening, Inkomen en Beleid & Advies."],
  ["Hoe verloopt het traject?", "Kennismaking, match, plaatsing en begeleiding. We nemen persoonlijk contact op na je bericht of sollicitatie."],
];

export default function Contact() {
  return (
    <>
      <section className="relative overflow-hidden bg-yellow">
        <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-10">
          <p className="text-sm font-semibold opacity-70">Home / Contact</p>
          <h1 className="display mt-3 text-4xl sm:text-6xl">Even kennismaken?</h1>
          <p className="mt-4 max-w-[54ch] text-lg">Vragen, of klaar voor je volgende stap? Laat je gegevens achter, dan nemen we persoonlijk contact met je op.</p>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 py-20 sm:px-10">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="rounded-[22px] bg-neutral-100 p-8 sm:p-11">
            <h2 className="display text-2xl">Stuur ons een bericht</h2>
            <form className="mt-6 grid gap-4" action={submitContact}>
              <Field label="Naam" name="naam" />
              <Field label="E-mail" name="email" type="email" />
              <Field label="Telefoon" name="telefoon" type="tel" />
              <label className="grid gap-1.5">
                <span className="text-sm font-bold">Ik ben</span>
                <select name="soort" className="rounded-xl border-2 border-neutral-200 bg-white px-4 py-3">
                  <option value="professional">Professional, op zoek naar werk</option>
                  <option value="opdrachtgever">Opdrachtgever</option>
                  <option value="anders">Anders</option>
                </select>
              </label>
              <label className="grid gap-1.5">
                <span className="text-sm font-bold">Bericht</span>
                <textarea name="bericht" rows={4} className="rounded-xl border-2 border-neutral-200 bg-white px-4 py-3" />
              </label>
              <button className="justify-self-start rounded-full bg-black px-6 py-3 font-bold text-white" type="submit">Verstuur</button>
              <p className="text-xs text-muted">Komt binnen bij het beheer (contactberichten) zodra Supabase gekoppeld is.</p>
            </form>
          </div>
          <div>
            <h2 className="display text-2xl">Direct contact</h2>
            <dl className="mt-6">
              <dt className="mt-4 font-bold">E-mail</dt><dd className="text-muted">[ info@detavia.nl ]</dd>
              <dt className="mt-4 font-bold">Telefoon</dt><dd className="text-muted">[ telefoonnummer ]</dd>
              <dt className="mt-4 font-bold">Adres</dt><dd className="text-muted">[ Argonweg 72, 1362 AD Almere ]</dd>
            </dl>
          </div>
        </div>

        <div id="faq" className="mt-20">
          <p className="text-xs font-bold uppercase tracking-[.16em] opacity-60">Veelgesteld</p>
          <h2 className="display mt-2 text-3xl sm:text-4xl">Goed om te weten</h2>
          <div className="mt-8 grid max-w-[820px] gap-3.5">
            {faq.map(([q, a]) => (
              <details key={q} className="rounded-2xl border-[1.5px] border-neutral-200 px-6 py-1 open:border-cobalt">
                <summary className="cursor-pointer list-none py-4 text-lg font-bold">{q}</summary>
                <p className="pb-5 text-muted">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-bold">{label}</span>
      <input name={name} type={type} className="rounded-xl border-2 border-neutral-200 bg-white px-4 py-3" />
    </label>
  );
}
