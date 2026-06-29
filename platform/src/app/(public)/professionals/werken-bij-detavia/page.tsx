import { pageMeta } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import PageCta from "@/components/PageCta";
import TeamSpots from "@/components/TeamSpots";
import InlineContactForm from "@/components/InlineContactForm";

export const metadata = pageMeta({ title: "Werken bij DetaVia", description: "Detacheren in het sociaal domein met persoonlijke begeleiding, opdrachten die passen en goede voorwaarden volgens cao.", path: "/professionals/werken-bij-detavia" });

const voordelen = [
  { t: "Opdrachten die bij je passen", d: "We luisteren eerst. Daarna matchen we je aan een opdracht die aansluit bij je kennis, ambitie en privesituatie." },
  { t: "Een vaste contactpersoon", d: "Geen nummer in een systeem. Je hebt een vaste consultant die je kent en met je meedenkt, voor, tijdens en na je opdracht." },
  { t: "Goede voorwaarden", d: "Een eerlijk salaris volgens cao, een passend contract en alles netjes geregeld qua verzekeringen en pensioen." },
  { t: "Ruimte om te groeien", d: "Via de DetaVia Academy blijf je leren: trainingen, intervisie en kennissessies met vakgenoten." },
];

const stappen = [
  { t: "Kennismaking", d: "We leren je kennen: wat kun je, wat wil je, en waar voel je je thuis?" },
  { t: "De juiste match", d: "We stellen je voor aan opdrachten die echt passen, geen hagel maar maatwerk." },
  { t: "Aan de slag", d: "Je begint bij de opdrachtgever, wij regelen de rest." },
  { t: "Blijvend contact", d: "We houden vinger aan de pols en denken mee over je volgende stap." },
];

export default function WerkenBijDetavia() {
  return (
    <>
      <PageHero
        kicker="Werken bij DetaVia"
        title="Werk met impact, mens centraal"
        intro="Bij DetaVia werk je aan opdrachten die er echt toe doen in het sociaal domein. Wij detacheren je met persoonlijke aandacht en zorgen dat jij kunt doen waar je goed in bent."
      />

      <section className="mx-auto max-w-[1180px] px-5 py-20 sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[.16em] opacity-60">Wat je van ons mag verwachten</p>
        <h2 className="display mt-2 text-3xl sm:text-4xl">Jij en DetaVia</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {voordelen.map((v) => (
            <div key={v.t} className="rounded-[22px] border-[1.5px] border-neutral-200 p-7">
              <h3 className="text-xl font-bold">{v.t}</h3>
              <p className="mt-2 text-muted">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

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

      <TeamSpots intro="Korte lijnen en een vast gezicht. Dit zijn de consultants die met je meedenken over je loopbaan." />

      <InlineContactForm
        soort="professional"
        title="Even kennismaken?"
        text="Laat je gegevens achter, dan nemen we contact op om kennis te maken en te kijken welke opdrachten bij je passen."
        button="Plan een kennismaking"
      />

      <PageCta
        title="Klaar voor je volgende opdracht?"
        text="Bekijk de openstaande vacatures of stuur een open sollicitatie, dan denken we met je mee."
        primary={{ href: "/vacatures", label: "Bekijk vacatures" }}
        secondary={{ href: "/solliciteren", label: "Open sollicitatie" }}
      />
    </>
  );
}
