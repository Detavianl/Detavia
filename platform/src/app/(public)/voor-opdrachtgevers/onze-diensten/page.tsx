import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import PageCta from "@/components/PageCta";
import TeamCards from "@/components/TeamCards";
import InlineContactForm from "@/components/InlineContactForm";

export const metadata = pageMeta({ title: "Onze diensten", description: "Detachering, werving & selectie en interim. DetaVia ontzorgt opdrachtgevers in het sociaal domein op de manier die past.", path: "/voor-opdrachtgevers/onze-diensten" });

const diensten = [
  { t: "Detachering", d: "Onze professional, jouw opdracht. Wij blijven werkgever en regelen contract, begeleiding en facturatie. Jij houdt grip op de opdracht.", href: "/voor-opdrachtgevers" },
  { t: "Werving & selectie", d: "Op zoek naar een vaste kracht? Wij vinden en selecteren de juiste kandidaat voor een vaste plek in jouw team.", href: "/voor-opdrachtgevers/werving-selectie" },
  { t: "Interim & projecten", d: "Snel ervaren capaciteit nodig bij piek, uitval of een tijdelijk project? Wij schakelen snel met de juiste mensen.", href: "/voor-opdrachtgevers" },
];

export default function OnzeDiensten() {
  return (
    <>
      <PageHero
        kicker="Onze diensten"
        title="Op de manier die jou past"
        intro="Of je nu tijdelijk capaciteit nodig hebt of een vaste kracht zoekt, DetaVia regelt het binnen het sociaal domein. Volledig ontzorgd, met mensen die het vak kennen."
      />

      <section className="mx-auto max-w-[1180px] px-5 py-20 sm:px-10">
        <div className="grid gap-5 md:grid-cols-3">
          {diensten.map((d) => (
            <Link key={d.t} href={d.href} className="flex flex-col rounded-[22px] border-[1.5px] border-neutral-200 p-7 transition hover:-translate-y-1 hover:border-cobalt">
              <h3 className="text-xl font-bold">{d.t}</h3>
              <p className="mt-2 flex-1 text-muted">{d.d}</p>
              <span className="mt-4 font-bold text-cobalt">Meer weten →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-neutral-50">
        <div className="mx-auto grid max-w-[1180px] items-center gap-10 px-5 py-20 sm:px-10 md:grid-cols-2">
          <div>
            <h2 className="display text-3xl sm:text-4xl">Specialist, geen generalist</h2>
            <p className="mt-4 max-w-[46ch] text-lg text-muted">Wij doen uitsluitend het sociaal domein. Die volledige focus betekent dat we de praktijk, de wetgeving en de mensen kennen, en dus sneller de juiste match maken.</p>
          </div>
          <ul className="grid gap-3">
            {["Diepe kennis van Leerplicht, Werk, Inkomen, Participatie en Schuldhulp", "Een warm netwerk van professionals", "Korte lijnen en een vaste contactpersoon", "Alles netjes geregeld volgens cao"].map((p) => (
              <li key={p} className="flex items-start gap-3 rounded-[18px] bg-white p-4 shadow-sm">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-yellow text-sm font-extrabold">✓</span>
                <span className="font-semibold">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <TeamCards
        title="Je accountteam"
        intro="Vaste contactpersonen die jouw organisatie en de markt kennen, zo schakelen we snel."
      />

      <InlineContactForm
        soort="opdrachtgever"
        organisatie
        title="Vraag een professional aan"
        text="Laat je gegevens achter en vertel kort wat je zoekt. We nemen snel persoonlijk contact met je op."
        button="Verstuur aanvraag"
      />

      <PageCta
        title="Benieuwd wat we voor je kunnen doen?"
        text="Vertel ons wat je zoekt, dan denken we vrijblijvend met je mee."
        primary={{ href: "/voor-opdrachtgevers", label: "Vraag een professional aan" }}
        secondary={{ href: "/contact", label: "Neem contact op" }}
      />
    </>
  );
}
