import PageHero from "@/components/PageHero";
import PageCta from "@/components/PageCta";
import InlineContactForm from "@/components/InlineContactForm";

export const metadata = {
  title: "DetaVia Academy",
  description: "Blijf groeien in het sociaal domein met trainingen, intervisie en kennissessies van de DetaVia Academy.",
};

const aanbod = [
  { t: "Vakinhoudelijke trainingen", d: "Up-to-date blijven op Wmo, Jeugd, Participatie en Schuldhulp, met trainers uit de praktijk." },
  { t: "Intervisie", d: "Leer van vakgenoten. In kleine groepen bespreek je casuistiek en haal je nieuwe inzichten op." },
  { t: "Kennissessies & webinars", d: "Korte sessies over actuele thema's en wetswijzigingen in het sociaal domein." },
  { t: "Persoonlijke ontwikkeling", d: "Coaching en loopbaanbegeleiding, zodat je niet alleen vakinhoudelijk maar ook persoonlijk groeit." },
];

export default function Academy() {
  return (
    <>
      <PageHero
        kicker="DetaVia Academy"
        title="Blijf groeien in je vak"
        intro="Het sociaal domein verandert continu. Met de DetaVia Academy houd je je kennis scherp en blijf je je ontwikkelen, vakinhoudelijk en persoonlijk."
      />

      <section className="mx-auto max-w-[1180px] px-5 py-20 sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[.16em] opacity-60">Ons aanbod</p>
        <h2 className="display mt-2 text-3xl sm:text-4xl">Leren en ontwikkelen</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {aanbod.map((a) => (
            <div key={a.t} className="rounded-[22px] border-[1.5px] border-neutral-200 p-7">
              <h3 className="text-xl font-bold">{a.t}</h3>
              <p className="mt-2 text-muted">{a.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-neutral-50">
        <div className="mx-auto grid max-w-[1180px] items-center gap-10 px-5 py-20 sm:px-10 md:grid-cols-2">
          <div>
            <h2 className="display text-3xl sm:text-4xl">Ontwikkeling hoort bij detacheren</h2>
            <p className="mt-4 max-w-[46ch] text-lg text-muted">Wie via DetaVia werkt, krijgt toegang tot de Academy. Want goede professionals blijven leren, en daar profiteren zij en de opdrachtgever van.</p>
          </div>
          <ul className="grid gap-3">
            {["Toegankelijk voor alle gedetacheerde professionals", "Trainers met praktijkervaring in het sociaal domein", "Aandacht voor zowel kennis als veerkracht"].map((p) => (
              <li key={p} className="flex items-start gap-3 rounded-[18px] bg-white p-4 shadow-sm">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-yellow text-sm font-extrabold">✓</span>
                <span className="font-semibold">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <InlineContactForm
        soort="professional"
        title="Meer weten over de Academy?"
        text="Laat je gegevens achter, dan vertellen we je graag wat de DetaVia Academy voor jouw ontwikkeling kan betekenen."
        button="Neem contact op"
      />

      <PageCta
        title="Werken en groeien bij DetaVia"
        text="Benieuwd hoe de Academy past bij jouw loopbaan? Bekijk de vacatures of neem contact op."
        primary={{ href: "/vacatures", label: "Bekijk vacatures" }}
        secondary={{ href: "/contact", label: "Neem contact op" }}
      />
    </>
  );
}
