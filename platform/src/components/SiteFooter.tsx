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
          <FootCol title="Ontdek" links={[["Vacatures", "/vacatures"], ["Verhalen", "/verhalen"], ["Over ons", "/over-ons"]]} />
          <FootCol title="DetaVia" links={[["Contact", "/contact"], ["Veelgesteld", "/contact#faq"]]} />
          <FootCol title="Account" links={[["Inloggen flexportaal", "https://detavia.flexportal.eu/"], ["Beheer", "/admin"]]} />
        </div>
        <div className="mt-10 flex flex-wrap justify-between gap-4 border-t border-neutral-200 pt-6 text-sm text-muted">
          <span>© 2026 DetaVia. Alle rechten voorbehouden.</span>
          <span>Algemene voorwaarden · Disclaimer · Privacy</span>
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
