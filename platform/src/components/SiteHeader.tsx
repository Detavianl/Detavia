"use client";
import Link from "next/link";
import { useState, useRef } from "react";

type Item = { href: string; label: string; desc?: string };
type Menu = {
  label: string;
  feature: { kicker: string; title: string; text: string; cta: { href: string; label: string } };
  items: Item[];
};

const professionals: Menu = {
  label: "Professionals",
  feature: {
    kicker: "Voor professionals",
    title: "Werk met impact",
    text: "Vind een opdracht in het sociaal domein die past bij wie je bent.",
    cta: { href: "/vacatures", label: "Bekijk vacatures" },
  },
  items: [
    { href: "/vacatures", label: "Vacatures", desc: "Alle openstaande opdrachten" },
    { href: "/professionals/werken-bij-detavia", label: "Werken bij DetaVia", desc: "Wat jij van ons mag verwachten" },
    { href: "/professionals/academy", label: "DetaVia Academy", desc: "Blijf groeien in je vak" },
    { href: "/professionals/zzp", label: "Voor ZZP'ers", desc: "Zelfstandig, maar nooit alleen" },
    { href: "/solliciteren", label: "Open sollicitatie", desc: "Niets gevonden? Stuur je cv" },
  ],
};

const opdrachtgevers: Menu = {
  label: "Opdrachtgevers",
  feature: {
    kicker: "Voor opdrachtgevers",
    title: "Personeel nodig?",
    text: "Snel de juiste professional in het sociaal domein, volledig ontzorgd.",
    cta: { href: "/voor-opdrachtgevers", label: "Vraag een professional aan" },
  },
  items: [
    { href: "/voor-opdrachtgevers/onze-diensten", label: "Onze diensten", desc: "Detachering, werving en interim" },
    { href: "/voor-opdrachtgevers/vakgebieden", label: "Vakgebieden", desc: "Leerplicht, Werk, Inkomen, Participatie en meer" },
    { href: "/voor-opdrachtgevers/werving-selectie", label: "Werving & selectie", desc: "De juiste vaste kracht" },
    { href: "/voor-opdrachtgevers/certificering-cao", label: "Certificering & cao", desc: "Kwaliteit en zekerheid" },
    { href: "/contact", label: "Contact", desc: "Direct met ons in gesprek" },
  ],
};

const simpleNav: Item[] = [
  { href: "/verhalen", label: "Verhalen" },
  { href: "/over-ons", label: "Over ons" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function enter(label: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(label);
  }
  function leave() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 120);
  }
  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-[88px] max-w-[1180px] items-center justify-between gap-6 px-5 sm:px-10">
        <Link href="/" aria-label="DetaVia" className="shrink-0" onClick={closeMobile}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/logo_blue.svg" alt="DetaVia" className="h-12 w-auto max-w-none" />
        </Link>

        <nav className="hidden items-center gap-6 font-semibold lg:flex">
          <Link href="/vacatures" className="whitespace-nowrap border-b-2 border-transparent py-1.5 hover:border-cobalt">Vacatures</Link>
          <Dropdown menu={professionals} open={open === professionals.label} onEnter={enter} onLeave={leave} />
          <Dropdown menu={opdrachtgevers} open={open === opdrachtgevers.label} onEnter={enter} onLeave={leave} />
          {simpleNav.map((n) => (
            <Link key={n.href} href={n.href} className="whitespace-nowrap border-b-2 border-transparent py-1.5 hover:border-cobalt">{n.label}</Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <Link href="/voor-opdrachtgevers" className="hidden whitespace-nowrap rounded-full bg-cobalt px-5 py-2.5 font-bold text-white sm:inline-block">
            Personeel nodig?
          </Link>
          <a href="https://detavia.flexportal.eu/" target="_blank" rel="noopener noreferrer"
             className="hidden items-center gap-1.5 rounded-xl px-3 py-2 font-bold text-cobalt hover:bg-cobalt/5 sm:inline-flex">
            Inloggen
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-3.5 w-3.5"><path d="M7 17L17 7M17 7H8M17 7v9" /></svg>
          </a>

          {/* Hamburger (mobiel/tablet) */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Menu sluiten" : "Menu openen"}
            aria-expanded={mobileOpen}
            className="flex h-11 w-11 items-center justify-center rounded-xl text-cobalt hover:bg-cobalt/5 lg:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-6 w-6">
              {mobileOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobiel menu */}
      {mobileOpen && (
        <div className="lg:hidden">
          <div className="max-h-[calc(100vh-88px)] overflow-y-auto border-t border-neutral-200 bg-white px-5 pb-8 pt-2 sm:px-10">
            <Link href="/vacatures" onClick={closeMobile} className="block border-b border-neutral-100 py-3.5 text-lg font-bold">Vacatures</Link>
            <MobileGroup menu={professionals} onNavigate={closeMobile} />
            <MobileGroup menu={opdrachtgevers} onNavigate={closeMobile} />
            {simpleNav.map((n) => (
              <Link key={n.href} href={n.href} onClick={closeMobile} className="block border-b border-neutral-100 py-3.5 text-lg font-bold">{n.label}</Link>
            ))}
            <div className="mt-5 grid gap-3">
              <Link href="/voor-opdrachtgevers" onClick={closeMobile} className="rounded-full bg-cobalt px-5 py-3.5 text-center font-bold text-white">Personeel nodig?</Link>
              <a href="https://detavia.flexportal.eu/" target="_blank" rel="noopener noreferrer" className="rounded-full border-2 border-cobalt px-5 py-3 text-center font-bold text-cobalt">Inloggen</a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function MobileGroup({ menu, onNavigate }: { menu: Menu; onNavigate: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-neutral-100">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-3.5 text-lg font-bold"
      >
        {menu.label}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`}><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {open && (
        <ul className="grid gap-0.5 pb-3 pl-1">
          {menu.items.map((it) => (
            <li key={it.href}>
              <Link href={it.href} onClick={onNavigate} className="block rounded-lg px-3 py-2.5 hover:bg-neutral-100">
                <span className="block font-semibold">{it.label}</span>
                {it.desc && <span className="block text-sm text-muted">{it.desc}</span>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Dropdown({ menu, open, onEnter, onLeave }: { menu: Menu; open: boolean; onEnter: (l: string) => void; onLeave: () => void }) {
  return (
    <div className="relative" onMouseEnter={() => onEnter(menu.label)} onMouseLeave={onLeave}>
      <button
        className="flex items-center gap-1 whitespace-nowrap border-b-2 border-transparent py-1.5 hover:border-cobalt aria-expanded:border-cobalt"
        aria-expanded={open}
      >
        {menu.label}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className={`h-3.5 w-3.5 transition ${open ? "rotate-180" : ""}`}><path d="M6 9l6 6 6-6" /></svg>
      </button>

      {open && (
        <div className="absolute left-1/2 top-full z-50 w-[640px] -translate-x-1/2 pt-3">
          <div className="grid grid-cols-[0.85fr_1.15fr] overflow-hidden rounded-[22px] border border-neutral-200 bg-white shadow-2xl">
            <div className="flex flex-col justify-between bg-cobalt p-6 text-white">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.16em] text-arctic">{menu.feature.kicker}</p>
                <p className="display mt-2 text-2xl leading-tight">{menu.feature.title}</p>
                <p className="mt-2 text-sm text-white/85">{menu.feature.text}</p>
              </div>
              <Link href={menu.feature.cta.href} className="mt-5 inline-block self-start rounded-full bg-yellow px-5 py-2.5 text-sm font-bold text-black">
                {menu.feature.cta.label}
              </Link>
            </div>
            <ul className="grid gap-1 p-4">
              {menu.items.map((it) => (
                <li key={it.href}>
                  <Link href={it.href} className="block rounded-xl px-4 py-3 transition hover:bg-neutral-100">
                    <span className="block font-bold">{it.label}</span>
                    {it.desc && <span className="block text-sm text-muted">{it.desc}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
