import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { euro } from "@/lib/crm";
import QuickNotes from "@/components/QuickNotes";
import { loadNotes } from "@/lib/notes";
import { requireAdmin } from "@/lib/admin-context";
import { isDemo, DEMO_PLACEMENTS, DEMO_CANDIDATES } from "@/lib/demo";

export const dynamic = "force-dynamic";

export default async function PlaatsingDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const demo = isDemo();
  const admin = await requireAdmin();

  let p: any, kandidaat: string, recruiterNaam = "—";
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
    const recruiterId = data.recruiter_id ?? data.candidate?.eigenaar ?? null;
    // Recruiter mag alleen z'n eigen plaatsing zien (verdiensten privé).
    if ((admin?.role === "recruiter" || admin?.role === "jr_recruiter") && recruiterId !== admin.user_id) redirect("/geen-toegang");
    p = { ...data, company_naam: data.company?.naam ?? "" };
    kandidaat = data.candidate?.naam ?? "—";
    if (recruiterId) {
      const { data: r } = await supabase.from("admin_users").select("naam").eq("user_id", recruiterId).single();
      recruiterNaam = r?.naam ?? "—";
    }
  }

  const notes = demo ? [] : await loadNotes("placement", id);
  const isRecruiter = admin?.role === "recruiter" || admin?.role === "jr_recruiter";

  return (
    <div className="p-8">
      <Link href="/admin/plaatsingen" className="text-sm font-semibold text-cobalt">← Plaatsingen</Link>
      <div className="mt-2">
        <h1 className="display text-3xl">{p.functie}</h1>
        <p className="mt-1 text-muted">{kandidaat} · {p.company_naam}{p.start_datum ? ` · sinds ${p.start_datum}` : ""}</p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Kpi label="Uurtarief" value={`${euro(p.uurtarief)}/u`} />
        <Kpi label="Kostprijs" value={`${euro(p.kostprijs)}/u`} />
        <Kpi label="Marge" value={`${euro((p.uurtarief ?? 0) - (p.kostprijs ?? 0))}/u`} accent />
        {!isRecruiter && <Kpi label="Recruiter" value={recruiterNaam} />}
      </div>

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
