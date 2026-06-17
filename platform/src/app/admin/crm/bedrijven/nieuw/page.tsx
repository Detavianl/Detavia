import Link from "next/link";
import { createCompany } from "../../actions";
import { COMPANY_TYPE, COMPANY_STATUS } from "@/lib/crm";

export default function NieuwBedrijf() {
  return (
    <form action={createCompany} className="mx-auto max-w-2xl p-8">
      <Link href="/admin/crm/bedrijven" className="text-sm font-semibold text-cobalt">← Bedrijven</Link>
      <h1 className="display mt-2 text-3xl">Nieuw bedrijf</h1>
      <div className="mt-8 grid gap-5">
        <Field label="Naam" name="naam" required />
        <div className="grid gap-5 sm:grid-cols-2">
          <Select label="Type" name="type" options={Object.entries(COMPANY_TYPE)} />
          <Select label="Status" name="status" options={Object.entries(COMPANY_STATUS)} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Plaats" name="plaats" />
          <Field label="Branche" name="branche" />
        </div>
        <Field label="Website" name="website" placeholder="https://…" />
        <label className="grid gap-1.5"><span className="text-sm font-bold">Notitie</span>
          <textarea name="notitie" rows={3} className="rounded-xl border-2 border-neutral-200 px-4 py-3" /></label>
        <button className="justify-self-start rounded-full bg-cobalt px-6 py-3 font-bold text-white">Opslaan</button>
      </div>
    </form>
  );
}
function Field({ label, name, required = false, placeholder }: { label: string; name: string; required?: boolean; placeholder?: string }) {
  return (<label className="grid gap-1.5"><span className="text-sm font-bold">{label}{required && " *"}</span>
    <input name={name} required={required} placeholder={placeholder} className="rounded-xl border-2 border-neutral-200 px-4 py-3" /></label>);
}
function Select({ label, name, options }: { label: string; name: string; options: [string, string][] }) {
  return (<label className="grid gap-1.5"><span className="text-sm font-bold">{label}</span>
    <select name={name} className="rounded-xl border-2 border-neutral-200 bg-white px-4 py-3">{options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>);
}
