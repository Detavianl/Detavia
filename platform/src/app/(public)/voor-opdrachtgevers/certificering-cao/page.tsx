import PageHero from "@/components/PageHero";
import PageCta from "@/components/PageCta";
import InlineContactForm from "@/components/InlineContactForm";

export const metadata = {
  title: "Certificering & CAO",
  description: "Werken met DetaVia betekent kwaliteit en zekerheid: correcte cao-beloning, nette contracten en alles goed geregeld.",
};

const punten = [
  "Beloning volgens de geldende cao",
  "Correcte contracten en verzekeringen",
  "Aandacht voor begeleiding en ontwikkeling",
  "Transparante tarieven, geen verrassingen",
];

const waarborg = [
  { t: "Kwaliteit", d: "Onze professionals zijn vakbekwaam en blijven zich ontwikkelen via de DetaVia Academy." },
  { t: "Zekerheid", d: "Alles is netjes en volgens de regels geregeld, voor jou en voor de professional." },
  { t: "Betrouwbaarheid", d: "Heldere afspraken en korte lijnen. Je weet altijd waar je aan toe bent." },
];

export default function CertificeringCao() {
  return (
    <>
      <PageHero
        kicker="Certificering & CAO"
        title="Kwaliteit en zekerheid"
        intro="Werken met DetaVia betekent werken volgens de regels van het vak. Onze professionals worden netjes beloond volgens cao en jij weet zeker dat alles goed geregeld is."
      />

      <section className="mx-auto grid max-w-[1180px] items-center gap-10 px-5 py-20 sm:px-10 md:grid-cols-2">
        <div>
          <h2 className="display text-3xl sm:text-4xl">Goed werkgeverschap</h2>
          <p className="mt-4 max-w-[46ch] text-lg text-muted">Goede zorg begint bij goede arbeidsvoorwaarden. Daarom regelen we alles correct, van beloning tot verzekering, zodat professionals met een gerust hart bij jou aan de slag gaan.</p>
        </div>
        <ul className="grid gap-3">
          {punten.map((p) => (
            <li key={p} className="flex items-start gap-3 rounded-[18px] border-[1.5px] border-neutral-200 p-4">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-yellow text-sm font-extrabold">✓</span>
              <span className="font-semibold">{p}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-neutral-50">
        <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-10">
          <h2 className="display text-3xl sm:text-4xl">Waar je op kunt bouwen</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {waarborg.map((w) => (
              <div key={w.t} className="rounded-[22px] bg-white p-7 shadow-sm">
                <h3 className="text-xl font-bold">{w.t}</h3>
                <p className="mt-2 text-muted">{w.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <InlineContactForm
        soort="opdrachtgever"
        organisatie
        title="Vragen over onze voorwaarden?"
        text="Laat je gegevens achter, dan vertellen we je graag hoe we kwaliteit en goede voorwaarden borgen."
        button="Neem contact op"
      />

      <PageCta
        title="Samenwerken met zekerheid?"
        text="We vertellen je graag hoe we kwaliteit en goede voorwaarden borgen."
        primary={{ href: "/voor-opdrachtgevers", label: "Vraag een professional aan" }}
        secondary={{ href: "/contact", label: "Neem contact op" }}
      />
    </>
  );
}
