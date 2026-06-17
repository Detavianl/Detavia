import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isDemo, DEMO_POSTS, DEMO_MESSAGES, DEMO_VACATURES_ADMIN } from "@/lib/demo";
import { demoCandidates, demoApplications } from "@/lib/demo-store";

async function count(table: string, filter?: (q: any) => any) {
  const supabase = await createClient();
  let q = supabase.from(table).select("*", { count: "exact", head: true });
  if (filter) q = filter(q);
  const { count } = await q;
  return count ?? 0;
}

export default async function Dashboard() {
  const [kandidaten, nieuw, gesprek, geplaatst, concepten, gepubliceerd, ongelezen, openVac] = isDemo()
    ? [
        demoCandidates().length,
        demoApplications().filter((a) => a.stage === "nieuw").length,
        demoApplications().filter((a) => a.stage === "kennismaking").length,
        demoApplications().filter((a) => a.stage === "geplaatst").length,
        DEMO_POSTS.filter((p) => p.status === "concept").length,
        DEMO_POSTS.filter((p) => p.status === "gepubliceerd").length,
        DEMO_MESSAGES.filter((m) => !m.gelezen).length,
        DEMO_VACATURES_ADMIN.filter((v) => v.status === "open").length,
      ]
    : await Promise.all([
        count("candidates"),
        count("applications", (q) => q.eq("stage", "nieuw")),
        count("applications", (q) => q.eq("stage", "gesprek")),
        count("applications", (q) => q.eq("stage", "geplaatst")),
        count("blog_posts", (q) => q.eq("status", "concept")),
        count("blog_posts", (q) => q.eq("status", "gepubliceerd")),
        count("contact_messages", (q) => q.eq("gelezen", false)),
        count("vacatures", (q) => q.eq("status", "open")),
      ]).catch(() => [0, 0, 0, 0, 0, 0, 0, 0]);

  // Taken / opvolging: kandidaten met een volgende actie
  let taken: { id: string; naam: string; actie: string; datum: string | null }[] = [];
  if (isDemo()) {
    taken = demoCandidates()
      .filter((c: any) => c.volgende_actie)
      .map((c: any) => ({ id: c.id, naam: c.naam, actie: c.volgende_actie, datum: c.volgende_actie_datum ?? null }));
  } else {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("candidates")
        .select("id, naam, volgende_actie, volgende_actie_datum")
        .not("volgende_actie", "is", null)
        .order("volgende_actie_datum", { ascending: true })
        .limit(20);
      taken = (data ?? []).map((c: any) => ({ id: c.id, naam: c.naam, actie: c.volgende_actie, datum: c.volgende_actie_datum }));
    } catch { taken = []; }
  }
  taken.sort((a, b) => (a.datum ?? "9999").localeCompare(b.datum ?? "9999"));
  const vandaag = new Date().toISOString().slice(0, 10);

  const cards = [
    { label: "Kandidaten", value: kandidaten, href: "/admin/kandidaten" },
    { label: "Nieuw in ATS", value: nieuw, href: "/admin/ats" },
    { label: "Kennismaking", value: gesprek, href: "/admin/ats" },
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

      <section className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Taken &amp; opvolging</h2>
          <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-bold text-muted">{taken.length}</span>
        </div>
        {taken.length === 0 ? (
          <p className="text-sm text-muted">Geen openstaande acties. Stel een volgende actie in op een kandidaat (Eigenaar &amp; opvolging).</p>
        ) : (
          <ul className="grid gap-2">
            {taken.map((t) => {
              const overdue = t.datum && t.datum < vandaag;
              const today = t.datum === vandaag;
              return (
                <li key={t.id}>
                  <Link href={`/admin/kandidaten/${t.id}`} className="flex items-center justify-between gap-4 rounded-xl border border-neutral-200 px-4 py-3 hover:border-cobalt">
                    <span className="min-w-0">
                      <span className="font-semibold">{t.actie}</span>
                      <span className="ml-2 text-sm text-muted">· {t.naam}</span>
                    </span>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${overdue ? "bg-red-100 text-red-700" : today ? "bg-yellow text-black" : "bg-neutral-100 text-muted"}`}>
                      {t.datum ?? "geen datum"}{overdue ? " · te laat" : today ? " · vandaag" : ""}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
