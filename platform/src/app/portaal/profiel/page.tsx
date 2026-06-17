import { requireProfessional } from "@/lib/professional-context";
import { createClient } from "@/lib/supabase/server";
import { updateOwnProfile, uploadOwnDocument } from "../actions";
import { isDemo, DEMO_CANDIDATES } from "@/lib/demo";
import { demoDocuments } from "@/lib/demo-store";
import CvButton from "@/components/CvButton";

export const dynamic = "force-dynamic";

export default async function ProfielPage() {
  const prof = await requireProfessional();
  let c: any, docs: any[];
  if (isDemo()) {
    c = DEMO_CANDIDATES.find((x) => x.id === prof.id) ?? {};
    docs = demoDocuments(prof.id);
  } else {
    const supabase = await createClient();
    const [{ data: cand }, { data: cvs }] = await Promise.all([
      supabase.from("candidates").select("*").eq("id", prof.id).single(),
      supabase.from("cvs").select("*").eq("candidate_id", prof.id).order("uploaded_at", { ascending: false }),
    ]);
    c = cand ?? {}; docs = cvs ?? [];
  }

  return (
    <div>
      <h1 className="display text-3xl">Mijn profiel</h1>
      <p className="mt-1 text-muted">Houd je gegevens en cv up-to-date. Je recruiter ziet dit ook.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <form action={updateOwnProfile} className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="text-lg font-bold">Gegevens</h2>
          <Field label="Naam"><input value={c.naam ?? ""} disabled className="w-full rounded-xl border-2 border-neutral-200 bg-neutral-100 px-4 py-3 text-muted" /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Telefoon"><input name="telefoon" defaultValue={c.telefoon ?? ""} className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3" /></Field>
            <Field label="Woonplaats"><input name="woonplaats" defaultValue={c.woonplaats ?? ""} className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3" /></Field>
          </div>
          <Field label="LinkedIn"><input name="linkedin" defaultValue={c.linkedin ?? ""} placeholder="https://…" className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3" /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Talen"><input name="talen" defaultValue={c.talen ?? ""} className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3" /></Field>
            <Field label="Beschikbaar per"><input name="beschikbaar_per" type="date" defaultValue={c.beschikbaar_per ?? ""} className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3" /></Field>
          </div>
          <button className="self-start rounded-full bg-cobalt px-6 py-3 font-bold text-white">Opslaan</button>
          {isDemo() && <p className="text-xs text-muted">Demo: niet bewaard.</p>}
        </form>

        <section className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="text-lg font-bold">Mijn cv &amp; documenten</h2>
          <div className="grid gap-2">
            {docs.map((d: any) => (
              <div key={d.id} className="flex items-center gap-2">
                <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[.7rem] font-bold capitalize">{d.soort ?? "cv"}</span>
                {d.storage_path ? <CvButton path={d.storage_path} filename={d.filename} />
                  : d.url ? <a href={d.url} target="_blank" rel="noopener noreferrer" download={d.filename} className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold hover:border-cobalt">📄 {d.filename}</a>
                  : <span className="rounded-lg border border-neutral-200 px-3 py-2 text-sm font-semibold">📄 {d.filename}</span>}
              </div>
            ))}
            {docs.length === 0 && <p className="text-sm text-muted">Nog geen documenten.</p>}
          </div>
          <form action={uploadOwnDocument} className="mt-2 flex flex-col gap-2 border-t border-neutral-100 pt-4">
            <select name="soort" className="rounded-lg border-2 border-neutral-200 px-2 py-2 text-sm font-semibold">
              <option value="cv">Cv</option><option value="motivatie">Motivatiebrief</option><option value="diploma">Diploma</option><option value="overig">Overig</option>
            </select>
            <input name="bestand" type="file" required className="w-full min-w-0 rounded-lg border-2 border-neutral-200 px-2 py-1.5 text-sm file:mr-2 file:rounded file:border-0 file:bg-neutral-100 file:px-2 file:py-1 file:text-xs file:font-semibold" />
            <button className="self-start rounded-full bg-cobalt px-4 py-2 text-sm font-bold text-white">+ Document toevoegen</button>
          </form>
        </section>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-1.5"><span className="text-sm font-bold">{label}</span>{children}</label>;
}
