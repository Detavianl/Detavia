import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { VAKGEBIEDEN, STAGES } from "@/lib/ats";
import CvButton from "@/components/CvButton";
import NoteForm from "@/components/NoteForm";

export const dynamic = "force-dynamic";

export default async function KandidaatDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: c } = await supabase.from("candidates").select("*").eq("id", id).single();
  if (!c) notFound();

  const [{ data: cvs }, { data: apps }] = await Promise.all([
    supabase.from("cvs").select("*").eq("candidate_id", id).order("uploaded_at", { ascending: false }),
    supabase.from("applications").select("id, stage, vacature:vacatures(titel)").eq("candidate_id", id),
  ]);

  const stageLabel = (k: string) => STAGES.find((s) => s.key === k)?.label ?? k;

  return (
    <div className="p-8">
      <Link href="/admin/kandidaten" className="text-sm font-semibold text-cobalt">← Kandidaten</Link>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="display text-3xl">{c.naam}</h1>
        {c.vakgebied && <span className="rounded-full bg-arctic px-3 py-1 text-sm font-bold">{VAKGEBIEDEN[c.vakgebied] ?? c.vakgebied}</span>}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-6">
          <section className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="mb-3 text-lg font-bold">Gegevens</h2>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <Info label="E-mail" value={c.email} />
              <Info label="Telefoon" value={c.telefoon} />
              <Info label="Woonplaats" value={c.woonplaats} />
              <Info label="LinkedIn" value={c.linkedin} link />
              <Info label="Bron" value={c.bron} />
            </dl>
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="mb-3 text-lg font-bold">Notitie</h2>
            <NoteForm id={c.id} initial={c.notitie ?? ""} />
          </section>
        </div>

        <div className="grid gap-6">
          <section className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="mb-3 text-lg font-bold">CV&apos;s</h2>
            <div className="grid gap-2">
              {(cvs ?? []).map((cv) => <CvButton key={cv.id} path={cv.storage_path} filename={cv.filename} />)}
              {(!cvs || cvs.length === 0) && <p className="text-sm text-muted">Nog geen cv geüpload.</p>}
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="mb-3 text-lg font-bold">In de ATS</h2>
            <div className="grid gap-2">
              {(apps ?? []).map((a: any) => (
                <div key={a.id} className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2 text-sm">
                  <span>{a.vacature?.titel ?? "Open sollicitatie"}</span>
                  <span className="rounded-full bg-cobalt px-2 py-0.5 text-xs font-bold text-white">{stageLabel(a.stage)}</span>
                </div>
              ))}
              {(!apps || apps.length === 0) && <p className="text-sm text-muted">Geen ATS-kaart.</p>}
              <Link href="/admin/ats" className="mt-1 text-sm font-bold text-cobalt">Naar het ATS-board →</Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value, link }: { label: string; value?: string | null; link?: boolean }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted">{label}</dt>
      <dd className="font-semibold">
        {value ? (link ? <a href={value} target="_blank" rel="noopener noreferrer" className="text-cobalt">{value}</a> : value) : "—"}
      </dd>
    </div>
  );
}
