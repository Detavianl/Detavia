import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createDeal } from "../../actions";
import { VAKGEBIEDEN, DEAL_STAGES } from "@/lib/crm";
import { isDemo, DEMO_COMPANIES } from "@/lib/demo";

export const dynamic = "force-dynamic";

export default async function NieuweDeal() {
  let companies: any[];
  if (isDemo()) companies = DEMO_COMPANIES;
  else { const supabase = await createClient(); const { data } = await supabase.from("companies").select("id, naam").order("naam"); companies = data ?? []; }

  return (
    <form action={createDeal} className="mx-auto max-w-2xl p-8">
      <Link href="/admin/crm/deals" className="text-sm font-semibold text-cobalt">← Deals</Link>
      <h1 className="display mt-2 text-3xl">Nieuwe deal</h1>
      <div className="mt-8 grid gap-5">
        <Field label="Titel" name="titel" required placeholder="bijv. 2 leerplichtambtenaren Q3" />
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-1.5"><span className="text-sm font-bold">Bedrijf</span>
            <select name="company_id" className="rounded-xl border-2 border-neutral-200 bg-white px-4 py-3">
              <option value="">— kies bedrijf —</option>
              {companies.map((c) => <option key={c.id} value={c.id}>{c.naam}</option>)}
            </select></label>
          <label className="grid gap-1.5"><span className="text-sm font-bold">Vakgebied</span>
            <select name="vakgebied" className="rounded-xl border-2 border-neutral-200 bg-white px-4 py-3">
              <option value="">—</option>
              {Object.entries(VAKGEBIEDEN).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select></label>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Waarde (€)" name="waarde" type="number" placeholder="96000" />
          <Field label="Kans (%)" name="kans" type="number" placeholder="20" />
          <Field label="Verwachte sluiting" name="verwachte_sluiting" type="date" />
        </div>
        <label className="grid gap-1.5"><span className="text-sm font-bold">Fase</span>
          <select name="stage" className="rounded-xl border-2 border-neutral-200 bg-white px-4 py-3">
            {DEAL_STAGES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select></label>
        <label className="grid gap-1.5"><span className="text-sm font-bold">Notitie</span>
          <textarea name="notitie" rows={3} className="rounded-xl border-2 border-neutral-200 px-4 py-3" /></label>
        <button className="justify-self-start rounded-full bg-cobalt px-6 py-3 font-bold text-white">Opslaan</button>
      </div>
    </form>
  );
}

function Field({ label, name, type = "text", required = false, placeholder }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-bold">{label}{required && " *"}</span>
      <input name={name} type={type} required={required} placeholder={placeholder} className="rounded-xl border-2 border-neutral-200 px-4 py-3" />
    </label>
  );
}
