import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAdmin } from "@/lib/admin-context";
import { COMPANY_TYPE, COMPANY_STATUS, euro, DEAL_STAGES, VAKGEBIEDEN } from "@/lib/crm";
import ContactMoments from "@/components/ContactMoments";
import QuickNotes from "@/components/QuickNotes";
import AuditLog from "@/components/AuditLog";
import FollowupForm from "@/components/FollowupForm";
import CompanyStatusSelect from "@/components/CompanyStatusSelect";
import { isDemo, DEMO_COMPANIES, DEMO_CONTACTS, DEMO_DEALS, DEMO_VACATURES_ADMIN, DEMO_CONTACT_MOMENTS, DEMO_NOTES, DEMO_AUDIT, DEMO_TEAM } from "@/lib/demo";

export const dynamic = "force-dynamic";

export default async function BedrijfDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const demo = isDemo();
  const admin = await getAdmin();
  const adminNaam = admin?.naam || admin?.email || "Beheer";

  let co: any, contacten: any[] = [], deals: any[] = [], vacatures: any[] = [], audit: any[] = [], contactmomenten: any[] = [], notities: any[] = [], team: any[] = [];

  if (demo) {
    co = DEMO_COMPANIES.find((x) => x.id === id);
    if (!co) notFound();
    contacten = DEMO_CONTACTS.filter((c) => c.company_id === id);
    deals = DEMO_DEALS.filter((d) => d.company?.naam === co.naam);
    vacatures = DEMO_VACATURES_ADMIN.filter((v) => v.company_id === id);
    audit = DEMO_AUDIT[id] ?? [];
    contactmomenten = DEMO_CONTACT_MOMENTS[id] ?? [];
    notities = DEMO_NOTES[id] ?? [];
    team = DEMO_TEAM;
  } else {
    const supabase = await createClient();
    const res = await supabase.from("companies").select("*").eq("id", id).single();
    co = res.data; if (!co) notFound();
    const [ct, dl, vc, act, aud, tm] = await Promise.all([
      supabase.from("contacts").select("*").eq("company_id", id),
      supabase.from("deals").select("id, titel, waarde, stage").eq("company_id", id),
      supabase.from("vacatures").select("id, titel, vakgebied, plaats, status").eq("company_id", id),
      supabase.from("crm_activities").select("id, type, onderwerp, contact_id, created_at, created_by").eq("company_id", id).order("created_at", { ascending: false }),
      supabase.from("audit_log").select("actie, details, user_naam, created_at").eq("entity", "company").eq("entity_id", id).order("created_at", { ascending: false }).limit(20),
      supabase.from("admin_users").select("user_id, naam"),
    ]);
    contacten = ct.data ?? []; deals = dl.data ?? []; vacatures = vc.data ?? []; audit = aud.data ?? []; team = tm.data ?? [];
    const naam = (uid: string) => team.find((t: any) => t.user_id === uid)?.naam ?? "Beheer";
    const ctNaam = (cid: string) => contacten.find((x: any) => x.id === cid)?.naam ?? null;
    const acts = (act.data ?? []).map((a: any) => ({ ...a, gebruiker: a.created_by ? naam(a.created_by) : null }));
    contactmomenten = acts.filter((a: any) => a.type !== "notitie").map((a: any) => ({ type: a.type, tekst: a.onderwerp, met: a.contact_id ? ctNaam(a.contact_id) : null, created_at: a.created_at, gebruiker: a.gebruiker }));
    notities = acts.filter((a: any) => a.type === "notitie").map((a: any) => ({ id: a.id, tekst: a.onderwerp, created_at: a.created_at, gebruiker: a.gebruiker, mine: a.created_by === admin?.user_id }));
  }
  const stageLabel = (k: string) => DEAL_STAGES.find((s) => s.key === k)?.label ?? k;
  const openVac = vacatures.filter((v) => v.status === "open").length;
  const pipeline = deals.filter((d: any) => d.stage !== "gewonnen" && d.stage !== "verloren").reduce((a: number, d: any) => a + (d.waarde ?? 0), 0);

  return (
    <div className="p-8">
      <Link href="/admin/crm/bedrijven" className="text-sm font-semibold text-cobalt">← Opdrachtgevers</Link>

      {/* Kop met kerngegevens */}
      <div className="mt-3 rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="display text-3xl">{co.naam}</h1>
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm font-bold">{COMPANY_TYPE[co.type] ?? co.type}</span>
              <span className={`rounded-full px-3 py-1 text-sm font-bold ${co.status === "klant" ? "bg-green-100 text-green-700" : co.status === "prospect" ? "bg-yellow text-black" : "bg-neutral-100 text-muted"}`}>{COMPANY_STATUS[co.status] ?? co.status}</span>
              {!demo && <CompanyStatusSelect id={co.id} status={co.status} />}
            </div>
            <p className="mt-1 text-muted">{[co.plaats, co.branche].filter(Boolean).join(" · ") || "—"}{co.website ? " · " : ""}
              {co.website && <a href={co.website} target="_blank" rel="noopener noreferrer" className="text-cobalt">website</a>}</p>
          </div>
          <div className="flex gap-6 text-center">
            <Stat n={contacten.length} l="Contacten" />
            <Stat n={openVac} l="Open vacatures" />
            <Stat n={euro(pipeline)} l="Pipeline" />
          </div>
        </div>
        {co.notitie && <p className="mt-4 rounded-xl bg-neutral-50 p-3 text-sm text-muted">{co.notitie}</p>}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Section title="Eigenaar & opvolging">
          <FollowupForm entity="company" id={co.id} eigenaar={co.eigenaar ?? ""} actie={co.volgende_actie ?? ""} datum={co.volgende_actie_datum ?? ""} team={team} demo={demo} />
        </Section>

        {/* Contactpersonen */}
        <Section title="Contactpersonen" action={<Link href="/admin/crm/contacten/nieuw" className="text-sm font-bold text-cobalt">+ Nieuw</Link>}>
          <div className="grid gap-3">
            {contacten.map((c: any) => (
              <div key={c.id} className="rounded-xl border border-neutral-200 p-3">
                <p className="font-bold">{c.naam}</p>
                <p className="text-sm text-muted">{c.functie}</p>
                <p className="mt-1 text-sm">{c.email}{c.telefoon ? ` · ${c.telefoon}` : ""}</p>
              </div>
            ))}
            {contacten.length === 0 && <p className="text-sm text-muted">Geen contactpersonen.</p>}
          </div>
        </Section>

        {/* Vacatures */}
        <Section title="Vacatures" action={<Link href="/admin/vacatures/nieuw" className="text-sm font-bold text-cobalt">+ Nieuw</Link>}>
          <div className="grid gap-2">
            {vacatures.map((v: any) => (
              <Link key={v.id} href={`/admin/vacatures/${v.id}`} className="flex items-center justify-between rounded-xl border border-neutral-200 px-3 py-2.5 hover:border-cobalt">
                <span><span className="font-semibold">{v.titel}</span>
                  <span className="ml-2 text-xs text-muted">{VAKGEBIEDEN[v.vakgebied] ?? v.vakgebied}{v.plaats ? ` · ${v.plaats}` : ""}</span></span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${v.status === "open" ? "bg-green-100 text-green-700" : "bg-neutral-100 text-muted"}`}>{v.status}</span>
              </Link>
            ))}
            {vacatures.length === 0 && <p className="text-sm text-muted">Geen vacatures gekoppeld.</p>}
          </div>
        </Section>

        {/* Deals */}
        <Section title="Deals" action={<Link href="/admin/crm/deals/nieuw" className="text-sm font-bold text-cobalt">+ Nieuw</Link>}>
          <div className="grid gap-2">
            {deals.map((d: any) => (
              <div key={d.id} className="flex items-center justify-between rounded-xl border border-neutral-200 px-3 py-2.5 text-sm">
                <span className="font-semibold">{d.titel}</span>
                <span className="flex items-center gap-3"><span className="font-bold text-cobalt">{euro(d.waarde)}</span>
                  <span className="rounded-full bg-cobalt px-2 py-0.5 text-xs font-bold text-white">{stageLabel(d.stage)}</span></span>
              </div>
            ))}
            {deals.length === 0 && <p className="text-sm text-muted">Geen deals.</p>}
          </div>
        </Section>

        <Section title="Activiteiten">
          <p className="-mt-1 mb-3 text-xs text-muted">Automatisch vastgelegde gebeurtenissen (aanbod gedaan, gewonnen, verloren…).</p>
          <AuditLog entries={audit} />
        </Section>

        <Section title="Contactmomenten">
          <ContactMoments entity="company" entityId={id} contacts={contacten.map((c: any) => ({ id: c.id, naam: c.naam }))} items={contactmomenten} currentUser={adminNaam} demo={demo} />
        </Section>

        <Section title="Notities">
          <QuickNotes entity="company" entityId={id} items={notities} currentUser={adminNaam} demo={demo} />
        </Section>
      </div>
    </div>
  );
}

function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
function Stat({ n, l }: { n: string | number; l: string }) {
  return <div><div className="text-2xl font-extrabold text-cobalt">{n}</div><div className="text-xs font-semibold text-muted">{l}</div></div>;
}
