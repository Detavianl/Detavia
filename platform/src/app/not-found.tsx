import Link from "next/link";

export const metadata = { title: "Pagina niet gevonden" };

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cobalt px-5 py-16 text-center text-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/img/logo_white.svg" alt="DetaVia" className="h-12 w-auto max-w-none" />
      <p className="display mt-10 text-7xl text-yellow sm:text-8xl">404</p>
      <h1 className="display mt-3 max-w-[18ch] text-3xl sm:text-4xl">Deze pagina hebben we niet kunnen vinden</h1>
      <p className="mt-4 max-w-[46ch] text-lg text-white/85">
        Misschien is de link verouderd of verplaatst. Geen zorgen, we helpen je graag weer op weg.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
        <Link href="/" className="rounded-full bg-yellow px-6 py-3.5 font-bold text-black transition hover:-translate-y-0.5">Naar de homepage</Link>
        <Link href="/vacatures" className="rounded-full border-2 border-white px-6 py-3.5 font-bold text-white">Bekijk vacatures</Link>
      </div>
      <p className="mt-6 text-sm text-white/70">
        Of <Link href="/contact" className="font-bold underline">neem contact met ons op</Link>.
      </p>
    </main>
  );
}
