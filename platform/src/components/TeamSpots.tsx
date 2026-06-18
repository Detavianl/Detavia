// Sectie met plekken voor teamfoto's. De foto's zelf komen later; nu nette
// placeholders zodat de klant ziet waar ze landen.
type Spot = { naam: string; functie: string };

export default function TeamSpots({
  title = "Maak kennis met je contactpersonen",
  intro = "Korte lijnen en een vast gezicht. Dit zijn de mensen die met je meedenken.",
  spots = [
    { naam: "[ Naam ]", functie: "[ Functie ]" },
    { naam: "[ Naam ]", functie: "[ Functie ]" },
    { naam: "[ Naam ]", functie: "[ Functie ]" },
    { naam: "[ Naam ]", functie: "[ Functie ]" },
  ],
}: { title?: string; intro?: string; spots?: Spot[] }) {
  return (
    <section className="mx-auto max-w-[1180px] px-5 py-20 sm:px-10">
      <p className="text-xs font-bold uppercase tracking-[.16em] opacity-60">Het team</p>
      <h2 className="display mt-2 text-3xl sm:text-4xl">{title}</h2>
      <p className="mt-3 max-w-[52ch] text-lg text-muted">{intro}</p>
      <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-4">
        {spots.map((s, i) => (
          <div key={i} className="text-center">
            {/* Foto-spot: vervang dit vlak door een teamfoto */}
            <div className="relative mx-auto flex aspect-square w-full items-center justify-center overflow-hidden rounded-[22px] border-[1.5px] border-dashed border-cobalt/30 bg-cobalt/[0.05]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-10 w-10 text-cobalt/40">
                <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.5-6 8-6s8 2 8 6" />
              </svg>
              <span className="absolute bottom-2 text-[11px] font-semibold uppercase tracking-wider text-cobalt/40">Teamfoto</span>
            </div>
            <p className="mt-3 font-bold">{s.naam}</p>
            <p className="text-sm text-muted">{s.functie}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
