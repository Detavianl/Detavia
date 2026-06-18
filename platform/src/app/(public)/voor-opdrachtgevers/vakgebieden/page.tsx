import PageHero from "@/components/PageHero";
import PageCta from "@/components/PageCta";

export const metadata = {
  title: "Vakgebieden",
  description: "Specialisten in het hele sociaal domein: Wmo, Jeugd, Participatie, Schuldhulpverlening, Inkomen en Beleid & advies.",
};

const vakgebieden = [
  { t: "Wmo", d: "Consulenten en kwaliteitsmedewerkers voor de Wet maatschappelijke ondersteuning." },
  { t: "Jeugd", d: "Jeugdconsulenten en gedragswetenschappers met oog voor het gezin." },
  { t: "Participatie", d: "Klantmanagers en re-integratieadviseurs richting werk en meedoen." },
  { t: "Schuldhulpverlening", d: "Schuldhulpverleners en budgetcoaches voor financiele rust." },
  { t: "Inkomen", d: "Inkomensconsulenten en handhavers binnen het sociaal domein." },
  { t: "Beleid & advies", d: "Beleidsadviseurs en projectleiders voor het sociaal domein." },
];

export default function Vakgebieden() {
  return (
    <>
      <PageHero
        kicker="Vakgebieden"
        title="Specialisten in het hele sociaal domein"
        intro="Van Wmo tot beleid: wij kennen elk vakgebied binnen het sociaal domein en weten welke professional past bij jouw vraag."
      />

      <section className="mx-auto max-w-[1180px] px-5 py-20 sm:px-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {vakgebieden.map((v) => (
            <div key={v.t} className="rounded-[22px] border-[1.5px] border-neutral-200 p-7">
              <h3 className="text-xl font-bold">{v.t}</h3>
              <p className="mt-2 text-muted">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      <PageCta
        title="Een professional nodig in jouw vakgebied?"
        text="Vertel ons wie en wat je zoekt, dan dragen we snel passende professionals voor."
        primary={{ href: "/voor-opdrachtgevers", label: "Vraag een professional aan" }}
        secondary={{ href: "/contact", label: "Neem contact op" }}
      />
    </>
  );
}
