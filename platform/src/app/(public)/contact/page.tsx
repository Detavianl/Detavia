import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { submitContact } from "../actions";
import CalendlyButton from "@/components/CalendlyButton";

export const metadata = pageMeta({ title: "Contact & veelgestelde vragen", description: "Vragen of klaar voor je volgende stap? Neem contact op met DetaVia, specialist in detachering in het sociaal domein.", path: "/contact" });

const faq = [
  ["Voor wie is DetaVia bedoeld?", "Voor professionals in het sociaal domein, van starter tot ervaren consulent of adviseur, die via detachering willen werken aan opdrachten met impact."],
  ["In welke vakgebieden bemiddelt DetaVia?", "Uitsluitend binnen het sociaal domein: Leerplicht, Werk, Inkomen, Participatie, Schuldhulpverlening en Inburgering."],
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

      {/* SPLIT-KEUZE */}
      <section className="relative z-10 mx-auto -mt-10 max-w-[1180px] px-5 sm:px-10">
        <div className="grid gap-5 md:grid-cols-2">
          <Link href="/vacatures" className="group flex items-center justify-between gap-4 rounded-[22px] border-[1.5px] border-neutral-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-cobalt">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.16em] text-cobalt">Ik zoek werk</p>
              <h3 className="mt-1 text-xl font-bold">Bekijk vacatures &amp; solliciteer</h3>
            </div>
            <span className="shrink-0 rounded-full bg-cobalt px-4 py-3 font-bold text-white transition group-hover:translate-x-1">→</span>
          </Link>
          <Link href="/voor-opdrachtgevers" className="group flex items-center justify-between gap-4 rounded-[22px] bg-cobalt p-7 text-white shadow-sm transition hover:-translate-y-1">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.16em] text-arctic">Ik zoek personeel</p>
              <h3 className="mt-1 text-xl font-bold">Vraag een professional aan</h3>
            </div>
            <span className="shrink-0 rounded-full bg-yellow px-4 py-3 font-bold text-black transition group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </section>

      {/* CALENDLY-BOEKING */}
      <section id="kennismaking" className="mx-auto max-w-[1180px] scroll-mt-24 px-5 pt-20 sm:px-10">
        <div className="rounded-[26px] bg-cobalt px-7 py-12 text-center text-white sm:px-12">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-arctic">Plan direct</p>
          <h2 className="display mt-2 text-3xl sm:text-4xl">Boek een kennismaking</h2>
          <p className="mx-auto mt-3 max-w-[54ch] text-lg text-white/85">Klik op de knop en kies zelf een moment dat jou uitkomt. We bellen of videobellen je voor een vrijblijvende kennismaking van 30 minuten.</p>
          <CalendlyButton className="mt-7 inline-block cursor-pointer rounded-full bg-yellow px-7 py-3.5 font-bold text-black transition hover:brightness-95">Plan een kennismaking</CalendlyButton>
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
              <label className="flex items-center gap-2.5 text-sm font-semibold">
                <input type="checkbox" name="terugbellen" value="1" className="h-4 w-4 accent-cobalt" />
                Liever gebeld worden? Vink aan, dan bellen wij jou.
              </label>
              <button className="justify-self-start rounded-full bg-black px-6 py-3 font-bold text-white" type="submit">Verstuur</button>
            </form>
          </div>
          <div>
            <h2 className="display text-2xl">Direct contact</h2>
            <dl className="mt-6">
              <dt className="mt-4 font-bold">E-mail</dt><dd><a href="mailto:info@detavia.nl" className="text-cobalt hover:underline">info@detavia.nl</a></dd>
              <dt className="mt-4 font-bold">Telefoon</dt><dd><a href="tel:080xxxxxx" className="text-cobalt hover:underline">080xxxxxx</a></dd>
              <dt className="mt-4 font-bold">Adres</dt><dd className="text-muted">Argonweg 72, 1362 AD Almere</dd>
            </dl>
            <div className="mt-8 rounded-[22px] bg-cobalt p-7 text-white">
              <h3 className="text-lg font-bold">Liever meteen een afspraak?</h3>
              <p className="mt-1 text-white/85">Plan zelf een kennismakingsgesprek op een moment dat jou uitkomt.</p>
              <CalendlyButton className="mt-4 inline-block cursor-pointer rounded-full bg-yellow px-5 py-2.5 font-bold text-black">Boek een kennismaking</CalendlyButton>
            </div>
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
