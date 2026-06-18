import PageHero from "@/components/PageHero";
import PageCta from "@/components/PageCta";

export const metadata = {
  title: "Voor ZZP'ers",
  description: "Als zelfstandige aan de slag in het sociaal domein via DetaVia. Mooie opdrachten, een warm netwerk en volledige ontzorging.",
};

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

      <PageCta
        title="Op zoek naar een mooie opdracht?"
        text="Bekijk de openstaande opdrachten of laat je gegevens achter, dan nemen we contact met je op."
        primary={{ href: "/vacatures", label: "Bekijk opdrachten" }}
        secondary={{ href: "/solliciteren", label: "Stel je voor" }}
      />
    </>
  );
}
