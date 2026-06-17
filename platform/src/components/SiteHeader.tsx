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
    { href: "/solliciteren", label: "Open sollicitatie", desc: "Niets gevonden? Stuur je cv" },
    { href: "/verhalen", label: "Verhalen & kennis", desc: "Ervaringen uit het vak" },
    { href: "/over-ons", label: "Over DetaVia", desc: "Wie we zijn en waar we voor staan" },
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
    { href: "/voor-opdrachtgevers#wat-we-doen", label: "Wat we doen", desc: "Detacheren in het sociaal domein" },
    { href: "/voor-opdrachtgevers#vakgebieden", label: "Vakgebieden", desc: "Wmo, Jeugd, Participatie en meer" },
    { href: "/voor-opdrachtgevers#diensten", label: "Onze diensten", desc: "Detachering, werving en interim" },
    { href: "/voor-opdrachtgevers#cao", label: "Certificering & CAO", desc: "Kwaliteit en zekerheid" },
    { href: "/contact", label: "Contact", desc: "Direct met ons in gesprek" },
  ],
};

const simpleNav: Item[] = [
  { href: "/over-ons", label: "Over ons" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function enter(label: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(label);
  }
  function leave() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 120);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-[78px] max-w-[1180px] items-center justify-between gap-6 px-5 sm:px-10">
        <Link href="/" aria-label="DetaVia">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/logo_blue.svg" alt="DetaVia" className="h-11" />
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
          <Link href="/vacatures" className="hidden rounded-full border-2 border-cobalt px-5 py-2 font-bold text-cobalt xl:inline-block">
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
