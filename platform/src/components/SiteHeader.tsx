import Link from "next/link";

const nav = [
  { href: "/vacatures", label: "Vacatures" },
  { href: "/voor-opdrachtgevers", label: "Voor opdrachtgevers" },
  { href: "/over-ons", label: "Over ons" },
  { href: "/verhalen", label: "Verhalen" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-[78px] max-w-[1180px] items-center justify-between gap-6 px-5 sm:px-10">
        <Link href="/" aria-label="DetaVia">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/logo_blue.svg" alt="DetaVia" className="h-[30px]" />
        </Link>
        <nav className="hidden items-center gap-7 font-semibold md:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="whitespace-nowrap border-b-2 border-transparent py-1.5 hover:border-cobalt">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2.5">
          <Link href="/voor-opdrachtgevers" className="hidden rounded-full bg-cobalt px-5 py-2.5 font-bold text-white sm:inline-block">
            Personeel nodig?
          </Link>
          <Link href="/vacatures" className="hidden rounded-full border-2 border-cobalt px-5 py-2 font-bold text-cobalt md:inline-block">
            Vacatures
          </Link>
          <a href="https://detavia.flexportal.eu/" target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 font-bold text-cobalt hover:bg-cobalt/5">
            Inloggen
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-3.5 w-3.5"><path d="M7 17L17 7M17 7H8M17 7v9" /></svg>
          </a>
        </div>
      </div>
    </header>
  );
}
