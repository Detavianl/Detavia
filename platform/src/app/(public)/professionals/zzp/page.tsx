import { pageMeta } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import PageCta from "@/components/PageCta";
import TeamSpots from "@/components/TeamSpots";
import InlineContactForm from "@/components/InlineContactForm";

export const metadata = pageMeta({ title: "Voor ZZP'ers", description: "Als zelfstandige aan de slag in het sociaal domein via DetaVia. Mooie opdrachten, een warm netwerk en volledige ontzorging.", path: "/professionals/zzp" });

const punten = [
  { t: "Opdrachten die passen", d: "Wij kennen de markt in het sociaal domein en koppelen je aan opdrachten die aansluiten bij jouw expertise en tarief." },
  { t: "Zelfstandig, niet alleen", d: "Je houdt je vrijheid als ondernemer, maar staat er nooit alleen voor. Je vaste contactpersoon denkt mee." },
  { t: "Snel en duidelijk geregeld", d: "Heldere afspraken, een nette overeenkomst en op tijd betaald. Geen gedoe, gewoon goed geregeld." },
  { t: "Toegang tot ons netwerk", d: "Profiteer van ons netwerk van gemeenten en organisaties en van kennisdeling met vakgenoten." },
];

export default function Zzp() {
  return (
    <>
      <PageHero
        kicker="Voor ZZP'ers"
        title="Zelfstandig, maar nooit alleen"
        intro="Ben je zelfstandig professional in het sociaal domein? DetaVia verbindt je met opdrachten die passen en ontzorgt je waar het kan, zodat jij kunt doen waar je goed in bent."
      />

      <section className="mx-auto max-w-[1180px] px-5 py-20 sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[.16em] opacity-60">Waarom via DetaVia</p>
        <h2 className="display mt-2 text-3xl sm:text-4xl">Ondernemen met een partner aan je zijde</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {punten.map((p) => (
            <div key={p.t} className="rounded-[22px] border-[1.5px] border-neutral-200 p-7">
              <h3 className="text-xl font-bold">{p.t}</h3>
              <p className="mt-2 text-muted">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-cobalt text-white">
        <div className="mx-auto grid max-w-[1180px] items-center gap-10 px-5 py-20 sm:px-10 md:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] opacity-70">Veilig zzp'en</p>
            <h2 className="display mt-2 text-3xl sm:text-4xl">Veilig zzp'en bij DetaVia</h2>
            <p className="mt-4 max-w-[48ch] text-lg text-white/85">Als zelfstandige aan de slag in het sociaal domein, zonder gedoe of risico. Bij DetaVia regelen we de samenwerking zo dat je veilig en zorgeloos als zzp'er kunt werken. Geen schijnzelfstandigheid, wel duidelijke afspraken en een vast aanspreekpunt.</p>
          </div>
          <ul className="grid gap-3">
            {["Werken volgens een goedgekeurde modelovereenkomst", "Helder over de wet DBA, geen risico op schijnzelfstandigheid", "Correcte, tijdige betaling en heldere voorwaarden", "Een vast aanspreekpunt dat met je meedenkt"].map((p) => (
              <li key={p} className="flex items-start gap-3 rounded-[18px] bg-white/10 p-4 ring-1 ring-white/15">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-yellow text-sm font-extrabold text-black">✓</span>
                <span className="font-semibold">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <TeamSpots
        title="Je vaste aanspreekpunt"
        intro="Als zelfstandige werk je samen met een vaste consultant die de markt kent en je opdrachten op maat aanbiedt."
        spots={[
          { naam: "[ Naam ]", functie: "[ Consultant ZZP ]" },
          { naam: "[ Naam ]", functie: "[ Consultant ZZP ]" },
          { naam: "[ Naam ]", functie: "[ Recruiter ]" },
          { naam: "[ Naam ]", functie: "[ Recruiter ]" },
        ]}
      />

      <InlineContactForm
        soort="professional"
        title="Even kennismaken?"
        text="Laat je gegevens achter, dan bellen we je voor een persoonlijke kennismaking en bespreken we welke opdrachten passen."
        button="Plan een kennismaking"
      />

      <PageCta
        title="Op zoek naar een mooie opdracht?"
        text="Bekijk de openstaande opdrachten of laat je gegevens achter, dan nemen we contact met je op."
        primary={{ href: "/vacatures", label: "Bekijk opdrachten" }}
        secondary={{ href: "/solliciteren", label: "Stel je voor" }}
      />
    </>
  );
}
