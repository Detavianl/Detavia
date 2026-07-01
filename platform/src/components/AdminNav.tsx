"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { href: string; label: string } | { header: string };

const items: Item[] = [
  { href: "/admin", label: "Dashboard" },
  { header: "Werving" },
  { href: "/admin/ats", label: "ATS" },
  { href: "/admin/funnel", label: "Funnel" },
  { href: "/admin/kandidaten", label: "Talentpool" },
  { href: "/admin/plaatsingen", label: "Plaatsingen" },
  { href: "/admin/verdiensten", label: "Verdiensten" },
  { href: "/admin/instellingen/schalen", label: "Schalen & tredes" },
  { header: "CRM" },
  { href: "/admin/crm/deals", label: "Deals" },
  { href: "/admin/crm/bedrijven", label: "Bedrijven" },
  { href: "/admin/crm/contacten", label: "Contactpersonen" },
  { header: "Content & overig" },
  { href: "/admin/mailer", label: "AI-mailer" },
  { href: "/admin/mailer-preview", label: "Mailer-preview" },
  { href: "/admin/vacatures", label: "Vacatures" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/berichten", label: "Berichten" },
  { href: "/admin/team", label: "Team" },
];

export default function AdminNav() {
  const path = usePathname();
  return (
    <nav className="grid gap-1">
      {items.map((it, i) =>
        "header" in it ? (
          <p key={i} className="mt-3 px-3 pb-1 text-[.65rem] font-bold uppercase tracking-wider text-neutral-400">{it.header}</p>
        ) : (
          <Link key={it.href} href={it.href}
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${
              (it.href === "/admin" ? path === "/admin" : path.startsWith(it.href)) ? "bg-cobalt text-white" : "text-muted hover:bg-neutral-100"
            }`}>
            {it.label}
          </Link>
        ),
      )}
    </nav>
  );
}
