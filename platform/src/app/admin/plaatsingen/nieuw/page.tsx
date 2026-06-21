import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createPlacement } from "../actions";
import { isDemo, DEMO_CANDIDATES, DEMO_COMPANIES } from "@/lib/demo";

export const dynamic = "force-dynamic";

export default async function NieuwePlaatsing() {
  let candidates: any[], companies: any[];
  if (isDemo()) { candidates = DEMO_CANDIDATES.map((c) => ({ id: c.id, naam: c.naam })); companies = DEMO_COMPANIES.map((c) => ({ id: c.id, naam: c.naam })); }
  else {
    const supabase = await createClient();
    const [{ data: cd }, { data: co }] = await Promise.all([
      supabase.from("candidates").select("id, naam").order("naam"),
      supabase.from("companies").select("id, naam").order("naam"),
    ]);
    candidates = cd ?? []; companies = co ?? [];
  }

  return (
    <form action={createPlacement} className="mx-auto max-w-2xl p-8">
      <Link href="/admin/plaatsingen" className="text-sm font-semibold text-cobalt">← Plaatsingen</Link>
      <h1 className="display mt-2 text-3xl">Nieuwe plaatsing</h1>
      <div className="mt-8 grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Sel label="Professional" name="candidate_id" options={candidates} />
          <Sel label="Opdrachtgever" name="company_id" options={companies} leeg />
        </div>
        <Field label="Functie" name="functie" placeholder="bv. Adviseur Sociaal Domein" />
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Uurtarief naar opdrachtgever (€)" name="uurtarief" type="number" placeholder="100" />
          <Field label="Kostprijs / uurloon (€)" name="kostprijs" type="number" placeholder="75" />
          <Field label="DetaVia-fee (% van marge)" name="detavia_fee_pct" type="number" placeholder="31" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Startdatum" name="start_datum" type="date" />
          <Field label="Einddatum (optioneel)" name="eind_datum" type="date" />
        </div>
        <p className="text-xs text-muted">Marge = uurtarief − kostprijs. DetaVia houdt de fee (standaard 31%), de recruiter (eigenaar van de kandidaat) krijgt de rest per uur. De professional ziet alleen z'n plaatsing en uren, niet de bedragen.</p>
        <button className="justify-self-start rounded-full bg-cobalt px-6 py-3 font-bold text-white">Opslaan</button>
      </div>
    </form>
  );
}

function Field({ label, name, type = "text", placeholder }: { label: string; name: string; type?: string; placeholder?: string }) {
  return <label className="grid gap-1.5"><span className="text-sm font-bold">{label}</span><input name={name} type={type} placeholder={placeholder} className="rounded-xl border-2 border-neutral-200 px-4 py-3" /></label>;
}
function Sel({ label, name, options, leeg }: { label: string; name: string; options: { id: string; naam: string }[]; leeg?: boolean }) {
  return <label className="grid gap-1.5"><span className="text-sm font-bold">{label}</span>
    <select name={name} className="rounded-xl border-2 border-neutral-200 bg-white px-4 py-3">
      {leeg && <option value="">—</option>}
      {options.map((o) => <option key={o.id} value={o.id}>{o.naam}</option>)}
    </select></label>;
}
