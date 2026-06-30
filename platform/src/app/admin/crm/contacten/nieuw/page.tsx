import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createContact } from "../../actions";
import { isDemo, DEMO_COMPANIES } from "@/lib/demo";

export const dynamic = "force-dynamic";

export default async function NieuwContact() {
  let companies: any[];
  if (isDemo()) companies = DEMO_COMPANIES;
  else { const supabase = await createClient(); const { data } = await supabase.from("companies").select("id, naam").order("naam"); companies = data ?? []; }

  return (
    <form action={createContact} className="mx-auto max-w-2xl p-8">
      <Link href="/admin/crm/contacten" className="text-sm font-semibold text-cobalt">← Contactpersonen</Link>
      <h1 className="display mt-2 text-3xl">Nieuw contact</h1>
      <div className="mt-8 grid gap-5">
        <Field label="Naam" name="naam" required />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Functie" name="functie" />
          <label className="grid min-w-0 gap-1.5"><span className="text-sm font-bold">Bedrijf</span>
            <select name="company_id" className="w-full rounded-xl border-2 border-neutral-200 bg-white px-4 py-3">
              <option value="">— kies bedrijf —</option>
              {companies.map((c) => <option key={c.id} value={c.id}>{c.naam}</option>)}
            </select></label>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="E-mail" name="email" type="email" />
          <Field label="Telefoon" name="telefoon" />
        </div>
        <Field label="LinkedIn" name="linkedin" placeholder="https://…" />
        <button className="justify-self-start rounded-full bg-cobalt px-6 py-3 font-bold text-white">Opslaan</button>
      </div>
    </form>
  );
}
function Field({ label, name, type = "text", required = false, placeholder }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return (<label className="grid min-w-0 gap-1.5"><span className="text-sm font-bold">{label}{required && " *"}</span>
    <input name={name} type={type} required={required} placeholder={placeholder} className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3" /></label>);
}
