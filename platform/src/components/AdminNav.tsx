"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items: [string, string][] = [
  ["/admin", "Dashboard"],
  ["/admin/ats", "ATS"],
  ["/admin/funnel", "Funnel"],
  ["/admin/kandidaten", "Talentpool"],
  ["/admin/vacatures", "Vacatures"],
  ["/admin/blog", "Blog"],
  ["/admin/berichten", "Berichten"],
  ["/admin/team", "Team"],
];

export default function AdminNav() {
  const path = usePathname();
  return (
    <nav className="grid gap-1">
      {items.map(([href, label]) => {
        const active = href === "/admin" ? path === "/admin" : path.startsWith(href);
        return (
          <Link key={href} href={href}
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${active ? "bg-cobalt text-white" : "text-muted hover:bg-neutral-100"}`}>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
