import { submitContact } from "../actions";
import CalendlyButton from "@/components/CalendlyButton";

export const metadata = {
  title: "Voor opdrachtgevers | DetaVia",
  description: "Snel de juiste professionals in het sociaal domein. Vraag vrijblijvend een professional aan bij DetaVia.",
};

const redenen = [
  { t: "Specialist in het sociaal domein", d: "Leerplicht, Werk en inkomen, Participatie, Schuldhulp en beleid. Wij kennen de praktijk en de mensen." },
  { t: "Snel de juiste match", d: "Een warm netwerk van professionals, dus snel een passende kandidaat zonder eindeloos zoeken." },
  { t: "Volledig ontzorgd", d: "Wij regelen contract, begeleiding en facturatie. Jij houdt grip op je opdracht." },
];
const stappen = [
  { t: "Je aanvraag", d: "Vertel ons kort wie en wat je zoekt." },
  { t: "Voorstel", d: "Binnen enkele dagen dragen we passende professionals voor." },
  { t: "Kennismaking", d: "Je spreekt de kandidaat en bepaalt zelf de klik." },
  { t: "Aan de slag", d: "Wij regelen de rest, de professional begint." },
];
const vakgebieden = [
  { t: "Leerplicht", d: "Leerplichtambtenaren en RMC-medewerkers die schoolverzuim aanpakken en jongeren terugleiden naar onderwijs of werk." },
  { t: "Werk en inkomen", d: "Klantmanagers en consulenten werk en inkomen die inwoners begeleiden naar werk en bestaanszekerheid." },
  { t: "Participatie", d: "Klantmanagers en re-integratieadviseurs richting werk en meedoen." },
  { t: "Schuldhulpverlening", d: "Schuldhulpverleners en budgetcoaches voor financiële rust." },
  { t: "Inkomen", d: "Inkomensconsulenten en handhavers binnen het sociaal domein." },
  { t: "Beleid & advies", d: "Beleidsadviseurs en projectleiders voor het sociaal domein." },
];
const diensten = [
  { t: "Detachering", d: "Onze professional, jouw opdracht. Wij blijven werkgever en ontzorgen volledig." },
  { t: "Werving & selectie", d: "Wij vinden de juiste kandidaat voor een vaste plek in jouw team." },
  { t: "Interim & projecten", d: "Snel ervaren capaciteit bij piek, uitval of een tijdelijk project." },
];

export default function VoorOpdrachtgevers() {
  return (
    <>
      {/* HERO */}
      <section className="bg-cobalt text-white">
        <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-10 px-5 py-16 sm:px-10 md:grid-cols-[1.1fr_.9fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-arctic">Voor opdrachtgevers</p>
            <h1 className="display mt-3 text-4xl sm:text-6xl">De juiste professional in het sociaal domein</h1>
            <p className="mt-6 max-w-[44ch] text-lg font-medium text-white/90">Personeel nodig voor Leerplicht, Werk en inkomen, Participatie of Schuldhulpverlening? Wij koppelen je snel aan de juiste mensen, en ontzorgen je volledig.</p>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <a href="#aanvraag" className="rounded-full bg-yellow px-6 py-3.5 font-bold text-black">Vraag een professional aan</a>
              <CalendlyButton className="cursor-pointer rounded-full border-2 border-white px-6 py-3.5 font-bold text-white">Boek een kennismaking</CalendlyButton>
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/office-worker-960x640.jpg" alt="Samenwerken in het sociaal domein" className="order-first aspect-[4/3] w-full rounded-[22px] object-cover shadow-2xl md:order-none" />
        </div>
      </section>

      {/* WAAROM / WAT WE DOEN */}
      <section id="wat-we-doen" className="mx-auto max-w-[1180px] scroll-mt-24 px-5 py-20 sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[.16em] opacity-60">Wat we doen</p>
        <h2 className="display mt-2 text-3xl sm:text-4xl">Personeel zonder gedoe</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {redenen.map((r) => (
            <div key={r.t} className="rounded-[22px] border-[1.5px] border-neutral-200 p-7">
              <h3 className="text-xl font-bold">{r.t}</h3>
              <p className="mt-2 text-muted">{r.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOE HET WERKT */}
      <section className="bg-neutral-50">
        <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-10">
          <h2 className="display text-3xl sm:text-4xl">Zo werkt het</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stappen.map((s, i) => (
              <div key={s.t} className="rounded-[22px] bg-white p-6 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow font-extrabold italic">{i + 1}</div>
                <h3 className="mt-4 text-lg font-bold">{s.t}</h3>
                <p className="mt-1 text-sm text-muted">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VAKGEBIEDEN */}
      <section id="vakgebieden" className="mx-auto max-w-[1180px] scroll-mt-24 px-5 py-20 sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[.16em] opacity-60">Vakgebieden</p>
        <h2 className="display mt-2 text-3xl sm:text-4xl">Specialisten in het hele sociaal domein</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {vakgebieden.map((v) => (
            <div key={v.t} className="rounded-[22px] border-[1.5px] border-neutral-200 p-7">
              <h3 className="text-xl font-bold">{v.t}</h3>
              <p className="mt-2 text-muted">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ONZE DIENSTEN */}
      <section className="bg-neutral-50">
        <div id="diensten" className="mx-auto max-w-[1180px] scroll-mt-24 px-5 py-20 sm:px-10">
          <p className="text-xs font-bold uppercase tracking-[.16em] opacity-60">Onze diensten</p>
          <h2 className="display mt-2 text-3xl sm:text-4xl">Op de manier die jou past</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {diensten.map((d) => (
              <div key={d.t} className="rounded-[22px] bg-white p-7 shadow-sm">
                <h3 className="text-xl font-bold">{d.t}</h3>
                <p className="mt-2 text-muted">{d.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CERTIFICERING & CAO */}
      <section id="cao" className="mx-auto max-w-[1180px] scroll-mt-24 px-5 py-20 sm:px-10">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] opacity-60">Certificering &amp; CAO</p>
            <h2 className="display mt-2 text-3xl sm:text-4xl">Kwaliteit en zekerheid</h2>
            <p className="mt-4 max-w-[46ch] text-lg text-muted">Werken met DetaVia betekent werken volgens de regels van het vak. Onze professionals worden netjes en volgens cao beloond, en jij weet zeker dat alles goed geregeld is.</p>
          </div>
          <ul className="grid gap-3">
            {["Beloning volgens de geldende cao", "Correcte contracten en verzekeringen", "Aandacht voor begeleiding en ontwikkeling", "Transparante tarieven, geen verrassingen"].map((p) => (
              <li key={p} className="flex items-start gap-3 rounded-[18px] border-[1.5px] border-neutral-200 p-4">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-yellow text-sm font-extrabold">✓</span>
                <span className="font-semibold">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* AANVRAAG */}
      <section id="aanvraag" className="mx-auto max-w-[1180px] px-5 py-20 sm:px-10">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="display text-3xl sm:text-4xl">Vraag een professional aan</h2>
            <p className="mt-3 max-w-[46ch] text-lg text-muted">Laat je gegevens achter en vertel kort wat je zoekt. We nemen snel persoonlijk contact met je op, vrijblijvend.</p>
            <dl className="mt-8 grid gap-3 text-sm">
              <div><dt className="font-bold">Telefoon</dt><dd><a href="tel:+31000000000" className="text-cobalt">[ telefoonnummer ]</a></dd></div>
              <div><dt className="font-bold">E-mail</dt><dd><a href="mailto:info@detavia.nl" className="text-cobalt">[ info@detavia.nl ]</a></dd></div>
            </dl>
          </div>
          <form action={submitContact} className="rounded-[22px] bg-neutral-100 p-8">
            <input type="hidden" name="soort" value="opdrachtgever" />
            <div className="grid gap-4">
              <Field label="Naam" name="naam" />
              <Field label="Organisatie" name="organisatie" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="E-mail" name="email" type="email" />
                <Field label="Telefoon" name="telefoon" type="tel" />
              </div>
              <label className="grid gap-1.5">
                <span className="text-sm font-bold">Wat zoek je?</span>
                <textarea name="bericht" rows={4} placeholder="bv. een leerplichtambtenaar voor 32 uur, per september" className="rounded-xl border-2 border-neutral-200 bg-white px-4 py-3" />
              </label>
              <button className="justify-self-start rounded-full bg-cobalt px-6 py-3 font-bold text-white">Verstuur aanvraag</button>
              <p className="text-xs text-muted">Vrijblijvend. We reageren snel en persoonlijk.</p>
            </div>
          </form>
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
