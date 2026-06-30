import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { VAKGEBIEDEN, STAGES, KANDIDAAT_STATUS } from "@/lib/ats";
import CvButton from "@/components/CvButton";
import ContactMoments from "@/components/ContactMoments";
import QuickNotes from "@/components/QuickNotes";
import AuditLog from "@/components/AuditLog";
import FollowupForm from "@/components/FollowupForm";
import DeleteCandidateButton from "@/components/DeleteCandidateButton";
import { getAdmin } from "@/lib/admin-context";
import { uploadDocument } from "../actions";
import { isDemo, DEMO_TEAM, DEMO_AUDIT, DEMO_CONTACT_MOMENTS, DEMO_NOTES } from "@/lib/demo";
import { demoCandidate, demoApplications, demoDocuments } from "@/lib/demo-store";

export const dynamic = "force-dynamic";

const DOC_SOORT: Record<string, string> = {
  cv: "Cv", motivatie: "Motivatie", diploma: "Diploma", referentie: "Referentie", id: "ID", overig: "Overig",
};

export default async function KandidaatDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const demo = isDemo();

  const admin = await getAdmin();
  const adminNaam = admin?.naam || admin?.email || "Beheer";

  let c: any, cvs: any[] = [], apps: any[] = [], team: any[] = [], audit: any[] = [], contactmomenten: any[] = [], notities: any[] = [];
  if (demo) {
    c = demoCandidate(id);
    if (!c) notFound();
    apps = demoApplications().filter((a) => a.candidate?.id === id).map((a) => ({ id: a.id, stage: a.stage, vacature: a.vacature }));
    team = DEMO_TEAM;
    audit = DEMO_AUDIT[id] ?? [];
    contactmomenten = DEMO_CONTACT_MOMENTS[id] ?? [];
    notities = DEMO_NOTES[id] ?? [];
    cvs = demoDocuments(id);
  } else {
    const supabase = await createClient();
    const res = await supabase.from("candidates").select("*").eq("id", id).single();
    c = res.data;
    if (!c) notFound();
    const [cvRes, appRes, actRes, teamRes, audRes] = await Promise.all([
      supabase.from("cvs").select("*").eq("candidate_id", id).order("uploaded_at", { ascending: false }),
      supabase.from("applications").select("id, stage, vacature:vacatures(titel)").eq("candidate_id", id),
      supabase.from("candidate_activities").select("id, type, inhoud, created_at, created_by").eq("candidate_id", id).order("created_at", { ascending: false }),
      supabase.from("admin_users").select("user_id, naam"),
      supabase.from("audit_log").select("actie, details, user_naam, created_at").eq("entity", "candidate").eq("entity_id", id).order("created_at", { ascending: false }).limit(20),
    ]);
    cvs = cvRes.data ?? []; apps = appRes.data ?? []; team = teamRes.data ?? []; audit = audRes.data ?? [];
    const naam = (uid: string) => team.find((t: any) => t.user_id === uid)?.naam ?? "Beheer";
    const acts = (actRes.data ?? []).map((a: any) => ({ ...a, gebruiker: a.created_by ? naam(a.created_by) : null }));
    contactmomenten = acts.filter((a: any) => a.type !== "notitie").map((a: any) => ({ type: a.type, tekst: a.inhoud, created_at: a.created_at, gebruiker: a.gebruiker }));
    notities = acts.filter((a: any) => a.type === "notitie").map((a: any) => ({ id: a.id, tekst: a.inhoud, created_at: a.created_at, gebruiker: a.gebruiker, mine: a.created_by === admin?.user_id }));
  }

  const stageLabel = (k: string) => STAGES.find((s) => s.key === k)?.label ?? k;
  const tarief = c.tarief_min || c.tarief_max ? `€ ${c.tarief_min ?? "?"} - € ${c.tarief_max ?? "?"} p/u` : "—";

  return (
    <div className="p-8">
      <Link href="/admin/kandidaten" className="text-sm font-semibold text-cobalt">← Kandidaten</Link>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="display text-3xl">{c.naam}</h1>
          {c.niveau && <span className="rounded-full bg-black px-3 py-1 text-sm font-bold capitalize text-white">{c.niveau}</span>}
          {c.vakgebied && <span className="rounded-full bg-arctic px-3 py-1 text-sm font-bold">{VAKGEBIEDEN[c.vakgebied] ?? c.vakgebied}</span>}
          <span className="rounded-full bg-yellow px-3 py-1 text-sm font-bold">{KANDIDAAT_STATUS[c.status] ?? c.status}</span>
        </div>
        {!demo && (
          <div className="flex items-center gap-2.5">
            <Link href={`/admin/kandidaten/${c.id}/bewerken`} className="rounded-full border-2 border-cobalt px-5 py-2 font-bold text-cobalt hover:bg-cobalt/5">Bewerken</Link>
            <DeleteCandidateButton id={c.id} naam={c.naam} />
          </div>
        )}
      </div>
      {(c.huidige_functie || c.huidige_werkgever) && (
        <p className="mt-1 text-muted">{[c.huidige_functie, c.huidige_werkgever].filter(Boolean).join(" · ")}</p>
      )}

      <div className="mt-8 flex flex-col gap-6 lg:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <Section title="Profiel">
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <Info label="E-mail" value={c.email} />
              <Info label="Telefoon" value={c.telefoon} />
              <Info label="Woonplaats" value={c.woonplaats} />
              <Info label="Regio / mobiliteit" value={c.regio} />
              <Info label="Opleidingsniveau" value={c.opleidingsniveau} />
              <Info label="Talen" value={c.talen} />
              <Info label="Rijbewijs" value={c.rijbewijs ? "Ja" : "Nee"} />
              <Info label="LinkedIn" value={c.linkedin} link />
              <Info label="Bron" value={c.bron} />
              <Info label="Gevonden via" value={c.gevonden_via} />
            </dl>
          </Section>

          <Section title="Beschikbaarheid & tarief">
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <Info label="Beschikbaar per" value={c.beschikbaar_per} />
              <Info label="Uren per week" value={c.uren_beschikbaar ? `${c.uren_beschikbaar} uur` : null} />
              <Info label="Uurtarief" value={tarief} />
              <Info label="Salarisindicatie" value={c.salaris_indicatie} />
            </dl>
          </Section>

          <Section title="Expertise">
            <div className="flex flex-wrap gap-2">
              {(c.expertise ?? []).length > 0 ? (c.expertise as string[]).map((t) => (
                <span key={t} className="rounded-full bg-neutral-100 px-3 py-1 text-sm font-semibold">{t}</span>
              )) : <span className="text-sm text-muted">—</span>}
            </div>
          </Section>

          <Section title="Activiteiten">
            <p className="-mt-2 mb-3 text-xs text-muted">Automatisch vastgelegde gebeurtenissen (gesolliciteerd, voorgesteld, aanbod gedaan, geplaatst…).</p>
            <AuditLog entries={audit} />
          </Section>

          <Section title="Contactmomenten">
            <ContactMoments entity="candidate" entityId={c.id} items={contactmomenten} currentUser={adminNaam} demo={demo} />
          </Section>

          <Section title="Notities">
            <QuickNotes entity="candidate" entityId={c.id} items={notities} currentUser={adminNaam} demo={demo} />
          </Section>
        </div>

        <div className="flex flex-col gap-6 lg:w-80 lg:shrink-0">
          <Section title="Eigenaar & opvolging">
            <FollowupForm id={c.id} eigenaar={c.eigenaar ?? ""} actie={c.volgende_actie ?? ""} datum={c.volgende_actie_datum ?? ""} team={team} demo={demo} />
          </Section>

          <Section title="Documenten">
            <p className="-mt-2 mb-3 text-xs text-muted">Cv&apos;s en meer (motivatie, diploma, referentie…).</p>
            <div className="grid gap-2">
              {cvs.map((cv: any) => (
                <div key={cv.id} className="flex items-center gap-2">
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[.7rem] font-bold capitalize">{DOC_SOORT[cv.soort] ?? cv.soort ?? "cv"}</span>
                  {cv.storage_path
                    ? <CvButton path={cv.storage_path} filename={cv.filename} />
                    : cv.url
                      ? <a href={cv.url} target="_blank" rel="noopener noreferrer" download={cv.filename} className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold hover:border-cobalt">📄 {cv.filename}</a>
                      : <span className="rounded-lg border border-neutral-200 px-3 py-2 text-sm font-semibold">📄 {cv.filename}</span>}
                </div>
              ))}
              {cvs.length === 0 && <p className="text-sm text-muted">Nog geen documenten.</p>}
            </div>

            <form action={uploadDocument.bind(null, c.id)} className="mt-4 flex flex-col gap-2 border-t border-neutral-100 pt-4">
              <select name="soort" className="w-full rounded-lg border-2 border-neutral-200 px-2 py-2 text-sm font-semibold">
                <option value="cv">Cv</option><option value="motivatie">Motivatiebrief</option>
                <option value="diploma">Diploma</option><option value="referentie">Referentie</option>
                <option value="id">ID-bewijs</option><option value="overig">Overig</option>
              </select>
              <input name="bestand" type="file" required className="w-full min-w-0 rounded-lg border-2 border-neutral-200 px-2 py-1.5 text-sm file:mr-2 file:rounded file:border-0 file:bg-neutral-100 file:px-2 file:py-1 file:text-xs file:font-semibold" />
              <button className="mt-1 self-start rounded-full bg-cobalt px-4 py-2 text-sm font-bold text-white">+ Document toevoegen</button>
            </form>
          </Section>

          <Section title="In de funnel">
            <div className="grid gap-2">
              {apps.map((a: any) => (
                <div key={a.id} className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2 text-sm">
                  <span>{a.vacature?.titel ?? "Open"}</span>
                  <span className="rounded-full bg-cobalt px-2 py-0.5 text-xs font-bold text-white">{stageLabel(a.stage)}</span>
                </div>
              ))}
              {apps.length === 0 && <p className="text-sm text-muted">Geen funnel-kaart.</p>}
              <Link href="/admin/ats" className="mt-1 text-sm font-bold text-cobalt">Naar het ATS-board →</Link>
            </div>
          </Section>

          <Section title="Laatste contact">
            <p className="text-sm">{c.laatste_contact ?? "—"}</p>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6">
      <h2 className="mb-3 text-lg font-bold">{title}</h2>
      {children}
    </section>
  );
}
function Info({ label, value, link }: { label: string; value?: string | null; link?: boolean }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted">{label}</dt>
      <dd className="break-words font-semibold">
        {value ? (link ? <a href={value} target="_blank" rel="noopener noreferrer" className="break-all text-cobalt">{value}</a> : value) : "—"}
      </dd>
    </div>
  );
}
