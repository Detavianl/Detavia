import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { euro } from "@/lib/crm";
import QuickNotes from "@/components/QuickNotes";
import SubmitButton from "@/components/SubmitButton";
import { loadNotes } from "@/lib/notes";
import { requireAdmin, RECRUITER_ROLES } from "@/lib/admin-context";
import { updatePlacement } from "../actions";
import { isDemo, DEMO_PLACEMENTS, DEMO_CANDIDATES } from "@/lib/demo";

export const dynamic = "force-dynamic";

export default async function PlaatsingDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const demo = isDemo();
  const admin = await requireAdmin();

  let p: any, kandidaat: string, recruiterNaam = "—", recruiterId: string | null = null;
  let companies: { id: string; naam: string }[] = [];
  let recruiters: { id: string; naam: string }[] = [];
  if (demo) {
    p = DEMO_PLACEMENTS.find((x) => x.id === id);
    if (!p) notFound();
    kandidaat = DEMO_CANDIDATES.find((c) => c.id === p.candidate_id)?.naam ?? "—";
    p.company_naam = p.company_naam ?? "";
  } else {
    const supabase = await createClient();
    const { data } = await supabase.from("placements")
      .select("*, candidate:candidates(id, naam, eigenaar), company:companies(naam)").eq("id", id).single();
    if (!data) notFound();
    recruiterId = data.recruiter_id ?? data.candidate?.eigenaar ?? null;
    // Recruiter mag alleen z'n eigen plaatsing zien (verdiensten privé).
    if ((admin?.role === "recruiter" || admin?.role === "jr_recruiter") && recruiterId !== admin.user_id) redirect("/geen-toegang");
    p = { ...data, company_naam: data.company?.naam ?? "" };
    kandidaat = data.candidate?.naam ?? "—";
    const [{ data: co }, { data: team }] = await Promise.all([
      supabase.from("companies").select("id, naam").order("naam"),
      supabase.from("admin_users").select("user_id, naam, role").order("naam"),
    ]);
    companies = co ?? [];
    recruiters = (team ?? []).filter((t) => RECRUITER_ROLES.includes(t.role)).map((t) => ({ id: t.user_id, naam: t.naam }));
    recruiterNaam = (team ?? []).find((t) => t.user_id === recruiterId)?.naam ?? "—";
  }

  const notes = demo ? [] : await loadNotes("placement", id);
  const isRecruiter = admin?.role === "recruiter" || admin?.role === "jr_recruiter";
  const toonMarge = admin?.role !== "jr_recruiter";
  const canEditRecruiter = admin?.role === "super_admin";

  return (
    <div className="p-8">
      <Link href="/admin/plaatsingen" className="text-sm font-semibold text-cobalt">← Plaatsingen</Link>
      <div className="mt-2">
        <h1 className="display text-3xl">{p.functie}</h1>
        <p className="mt-1 text-muted">{kandidaat} · {p.company_naam}{p.start_datum ? ` · sinds ${p.start_datum}` : ""}</p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {toonMarge && <Kpi label="Uurtarief" value={`${euro(p.uurtarief)}/u`} />}
        {toonMarge && <Kpi label="Kostprijs" value={`${euro(p.kostprijs)}/u`} />}
        {toonMarge && <Kpi label="Marge" value={`${euro((p.uurtarief ?? 0) - (p.kostprijs ?? 0))}/u`} accent />}
        {!isRecruiter && <Kpi label="Recruiter" value={recruiterNaam} />}
        <Kpi label="Uren/week" value={p.uren_per_week ? String(p.uren_per_week) : "—"} />
      </div>

      {!demo && (
        <form action={updatePlacement} className="mt-8 max-w-2xl rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-bold">Plaatsing wijzigen</h2>
          <input type="hidden" name="id" value={id} />
          <div className="grid gap-4">
            <Veld label="Functie" name="functie" defaultValue={p.functie ?? ""} />
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid min-w-0 gap-1.5"><span className="text-sm font-bold">Opdrachtgever</span>
                <select name="company_id" defaultValue={p.company_id ?? ""} className="w-full rounded-xl border-2 border-neutral-200 bg-white px-4 py-2.5">
                  <option value="">—</option>
                  {companies.map((c) => <option key={c.id} value={c.id}>{c.naam}</option>)}
                </select></label>
              {canEditRecruiter && (
                <label className="grid min-w-0 gap-1.5"><span className="text-sm font-bold">Recruiter</span>
                  <select name="recruiter_id" defaultValue={recruiterId ?? ""} className="w-full rounded-xl border-2 border-neutral-200 bg-white px-4 py-2.5">
                    <option value="">— geen —</option>
                    {recruiters.map((r) => <option key={r.id} value={r.id}>{r.naam}</option>)}
                  </select></label>
              )}
            </div>
            {toonMarge && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Veld label="Uurtarief (€/uur)" name="uurtarief" type="number" step="0.01" defaultValue={p.uurtarief ?? ""} />
                <Veld label="Kostprijs (€/uur)" name="kostprijs" type="number" step="0.01" defaultValue={p.kostprijs ?? ""} />
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-[1fr_1fr_1fr]">
              <Veld label="Uren per week" name="uren_per_week" type="number" step="0.5" defaultValue={p.uren_per_week ?? ""} />
              <Veld label="Startdatum" name="start_datum" type="date" defaultValue={p.start_datum ?? ""} />
              <Veld label="Einddatum" name="eind_datum" type="date" defaultValue={p.eind_datum ?? ""} />
            </div>
            <SubmitButton className="justify-self-start rounded-full bg-cobalt px-6 py-3 font-bold text-white">Wijzigingen opslaan</SubmitButton>
          </div>
        </form>
      )}

      <section className="mt-8 max-w-2xl rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-3 text-lg font-bold">Notities</h2>
        <QuickNotes entity="placement" entityId={id} items={notes} currentUser={admin.naam} demo={demo} />
      </section>
    </div>
  );
}

function Kpi({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return <div className="rounded-2xl border border-neutral-200 bg-white p-5"><div className={`text-xl font-extrabold ${accent ? "text-cobalt" : ""}`}>{value}</div><div className="mt-1 text-sm font-semibold text-muted">{label}</div></div>;
}

function Veld({ label, name, type = "text", step, defaultValue }: { label: string; name: string; type?: string; step?: string; defaultValue?: string | number }) {
  return (
    <label className="grid min-w-0 gap-1.5"><span className="text-sm font-bold">{label}</span>
      <input name={name} type={type} step={step} defaultValue={defaultValue} className="w-full rounded-xl border-2 border-neutral-200 px-4 py-2.5" /></label>
  );
}
