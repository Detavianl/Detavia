import Link from "next/link";

const opdrachtgevers = [
  { naam: "Gemeente Alphen aan den Rijn", file: "Gemeente-Alphen-aan-den-Rijn.svg" },
  { naam: "Gemeente Dronten", file: "Gemeente-Dronten.svg" },
  { naam: "Gemeente Rijswijk", file: "Gemeente-Rijswijk.svg" },
  { naam: "Gemeente Soest", file: "Gemeente-Soest.svg" },
  { naam: "Gemeente Wijk bij Duurstede", file: "Gemeente-Wijk-bij-Duurstede.svg" },
  { naam: "Gemeente Zeist", file: "Gemeente-Zeist.svg" },
  { naam: "Provinciehuis Flevoland", file: "Provincie-huis-Flevoland.svg" },
  { naam: "Ferm Werk", file: "Ferm-Werk.svg" },
  { naam: "Werkbedrijf De Binnenbaan", file: "Werkbedrijf-De-Binnenbaan.svg" },
  { naam: "Uitvoeringsorganisatie BBS", file: "Uitvoeringsorganisatie-BBS.svg" },
];

// Eén groep = de set dubbel, zodat de groep breder is dan elk scherm en er nooit
// een gat valt. Twee identieke groepen schuiven met -50% voor een naadloze loop.
const groep = [...opdrachtgevers, ...opdrachtgevers];

export default function OpdrachtgeverMarquee() {
  return (
    <section className="mt-20 border-y border-neutral-200 bg-white py-14">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-10">
        <p className="text-center text-xs font-bold uppercase tracking-[.16em] text-cobalt">Vertrouwd door</p>
        <h2 className="display mt-2 text-center text-2xl sm:text-3xl">Gemeenten en organisaties in het sociaal domein</h2>
      </div>
      <div className="marquee-pause relative mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)]">
        <div className="flex w-max animate-marquee">
          {[0, 1].map((g) => (
            <ul key={g} className="flex shrink-0 items-center gap-14 pr-14" aria-hidden={g === 1}>
              {groep.map((o, i) => (
                <li key={i} className="flex shrink-0 items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/img/opdrachtgevers/${o.file}`}
                    alt={o.naam}
                    title={o.naam}
                    className="h-12 w-auto max-w-none transition duration-300 hover:scale-105"
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {/* CTA voor opdrachtgevers, rijdt mee op het vertrouwen van de logo's */}
      <div className="mx-auto mt-12 max-w-[1180px] px-5 text-center sm:px-10">
        <h3 className="text-xl font-bold sm:text-2xl">Sluit je aan bij deze organisaties</h3>
        <p className="mx-auto mt-2 max-w-[46ch] text-muted">Ook personeel nodig in het sociaal domein? Wij denken met je mee en ontzorgen volledig.</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
          <Link href="/voor-opdrachtgevers" className="rounded-full bg-cobalt px-6 py-3 font-bold text-white transition hover:-translate-y-0.5">Vraag een professional aan</Link>
          <Link href="/contact" className="font-bold text-cobalt hover:underline">Of neem contact op</Link>
        </div>
      </div>
    </section>
  );
}
