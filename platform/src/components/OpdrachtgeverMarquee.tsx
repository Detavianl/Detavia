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

// Bewegende logobalk van opdrachtgevers. Pure CSS-animatie (zie globals.css),
// lijst dubbel gerenderd voor een naadloze loop.
export default function OpdrachtgeverMarquee() {
  const rij = [...opdrachtgevers, ...opdrachtgevers];
  return (
    <section className="mt-20 border-y border-neutral-200 bg-white py-14">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-10">
        <p className="text-center text-xs font-bold uppercase tracking-[.16em] text-cobalt">Vertrouwd door</p>
        <h2 className="display mt-2 text-center text-2xl sm:text-3xl">Gemeenten en organisaties in het sociaal domein</h2>
      </div>
      <div className="marquee-pause relative mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_7%,#000_93%,transparent)]">
        <ul className="flex w-max animate-marquee items-center gap-14 pr-14">
          {rij.map((o, i) => (
            <li key={i} className="shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/img/opdrachtgevers/${o.file}`}
                alt={o.naam}
                title={o.naam}
                className="h-12 w-auto max-w-none opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
