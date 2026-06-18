import PageHero from "@/components/PageHero";
import PageCta from "@/components/PageCta";
import InlineContactForm from "@/components/InlineContactForm";

export const metadata = {
  title: "Werving & selectie",
  description: "Op zoek naar een vaste kracht in het sociaal domein? DetaVia vindt en selecteert de juiste kandidaat voor jouw team.",
};

const stappen = [
  { t: "Scherp profiel", d: "We brengen samen in kaart wie je zoekt: vakinhoudelijk en qua persoonlijkheid en teamfit." },
  { t: "Gericht zoeken", d: "Via ons netwerk en onze kennis van het sociaal domein benaderen we ook de mensen die niet actief zoeken." },
  { t: "Zorgvuldige selectie", d: "We voeren de gesprekken, toetsen op kwaliteit en motivatie en dragen alleen passende kandidaten voor." },
  { t: "Een goede start", d: "We begeleiden de kennismaking en blijven betrokken tot de nieuwe collega goed geland is." },
];

export default function WervingSelectie() {
  return (
    <>
      <PageHero
        kicker="Werving & selectie"
        title="De juiste vaste kracht voor je team"
        intro="Soms zoek je geen tijdelijke oplossing, maar een blijvende. DetaVia vindt en selecteert de professional die past bij je organisatie en blijft."
      />

      <section className="bg-neutral-50">
        <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-10">
          <h2 className="display text-3xl sm:text-4xl">Zo pakken we het aan</h2>
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

      <section className="mx-auto grid max-w-[1180px] items-center gap-10 px-5 py-20 sm:px-10 md:grid-cols-2">
        <div>
          <h2 className="display text-3xl sm:text-4xl">Kwaliteit boven volume</h2>
          <p className="mt-4 max-w-[46ch] text-lg text-muted">Wij sturen niet op aantallen, maar op de juiste match. Liever een paar kandidaten die echt passen dan een stapel cv's.</p>
        </div>
        <ul className="grid gap-3">
          {["Specialist in het sociaal domein", "Aandacht voor teamfit en cultuur", "Zorgvuldige, persoonlijke selectie", "Betrokken tot de nieuwe collega geland is"].map((p) => (
            <li key={p} className="flex items-start gap-3 rounded-[18px] border-[1.5px] border-neutral-200 p-4">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-yellow text-sm font-extrabold">✓</span>
              <span className="font-semibold">{p}</span>
            </li>
          ))}
        </ul>
      </section>

      <InlineContactForm
        soort="opdrachtgever"
        organisatie
        title="Start je wervingsvraag"
        text="Laat je gegevens achter en vertel kort wie je zoekt. We gaan gericht voor je aan de slag."
        button="Verstuur aanvraag"
      />

      <PageCta
        title="Op zoek naar een vaste kracht?"
        text="Vertel ons wie je zoekt, dan gaan we gericht voor je aan de slag."
        primary={{ href: "/voor-opdrachtgevers", label: "Start je aanvraag" }}
        secondary={{ href: "/contact", label: "Neem contact op" }}
      />
    </>
  );
}
