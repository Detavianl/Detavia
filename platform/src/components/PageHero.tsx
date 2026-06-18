// Standaard pagina-hero in DetaVia-stijl (cobalt vlak, witte tekst).
export default function PageHero({ kicker, title, intro }: { kicker: string; title: string; intro: string }) {
  return (
    <section className="bg-cobalt text-white">
      <div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-arctic">{kicker}</p>
        <h1 className="display mt-3 max-w-[20ch] text-4xl sm:text-6xl">{title}</h1>
        <p className="mt-5 max-w-[58ch] text-lg font-medium text-white/90">{intro}</p>
      </div>
    </section>
  );
}
