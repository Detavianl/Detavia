import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

async function count(table: string, filter?: (q: any) => any) {
  const supabase = await createClient();
  let q = supabase.from(table).select("*", { count: "exact", head: true });
  if (filter) q = filter(q);
  const { count } = await q;
  return count ?? 0;
}

export default async function Dashboard() {
  const [kandidaten, nieuw, gesprek, geplaatst, concepten, gepubliceerd, ongelezen, openVac] = await Promise.all([
    count("candidates"),
    count("applications", (q) => q.eq("stage", "nieuw")),
    count("applications", (q) => q.eq("stage", "gesprek")),
    count("applications", (q) => q.eq("stage", "geplaatst")),
    count("blog_posts", (q) => q.eq("status", "concept")),
    count("blog_posts", (q) => q.eq("status", "gepubliceerd")),
    count("contact_messages", (q) => q.eq("gelezen", false)),
    count("vacatures", (q) => q.eq("status", "open")),
  ]).catch(() => [0, 0, 0, 0, 0, 0, 0, 0]);

  const cards = [
    { label: "Kandidaten", value: kandidaten, href: "/admin/kandidaten" },
    { label: "Nieuw in ATS", value: nieuw, href: "/admin/ats" },
    { label: "Gesprekken", value: gesprek, href: "/admin/ats" },
    { label: "Geplaatst", value: geplaatst, href: "/admin/ats" },
    { label: "Open vacatures", value: openVac, href: "/admin/vacatures" },
    { label: "Blog concepten", value: concepten, href: "/admin/blog" },
    { label: "Gepubliceerd", value: gepubliceerd, href: "/admin/blog" },
    { label: "Ongelezen berichten", value: ongelezen, href: "/admin/berichten" },
  ];

  return (
    <div className="p-8">
      <h1 className="display text-3xl">Dashboard</h1>
      <p className="mt-1 text-muted">Overzicht van DetaVia.</p>
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="rounded-2xl border border-neutral-200 bg-white p-6 transition hover:border-cobalt">
            <div className="text-4xl font-extrabold text-cobalt">{c.value}</div>
            <div className="mt-1 text-sm font-semibold text-muted">{c.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
