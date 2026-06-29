import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200 py-14">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/logo_black.svg" alt="DetaVia" className="mb-4 h-8" />
            <p className="max-w-[34ch] text-muted">Jouw betrouwbare carrièrepartner in het sociaal domein.</p>
          </div>
          <FootCol title="Voor kandidaten" links={[["Vacatures", "/vacatures"], ["Open sollicitatie", "/solliciteren"], ["Verhalen", "/verhalen"]]} />
          <FootCol title="Voor opdrachtgevers" links={[["Vraag een professional aan", "/voor-opdrachtgevers"], ["Over ons", "/over-ons"], ["Contact", "/contact"]]} />
          <FootCol title="Account" links={[["Inloggen flexportaal", "https://detavia.flexportal.eu/"], ["Beheer", "/admin"]]} />
        </div>
        <div className="mt-10 flex flex-wrap justify-between gap-4 border-t border-neutral-200 pt-6 text-sm text-muted">
          <span>© 2026 DetaVia. Alle rechten voorbehouden.</span>
          <span className="flex flex-wrap gap-x-1.5 gap-y-1">
            <Link href="/algemene-voorwaarden" className="hover:text-cobalt">Algemene voorwaarden</Link>
            <span aria-hidden>·</span>
            <Link href="/disclaimer-privacy-en-gebruikersvoorwaarden" className="hover:text-cobalt">Disclaimer, privacy &amp; gebruikersvoorwaarden</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}

function FootCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="mb-3.5 text-xs font-bold uppercase tracking-wider opacity-55">{title}</h4>
      <ul className="grid gap-2">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link href={href} className="hover:text-cobalt">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
