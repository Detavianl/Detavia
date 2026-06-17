import Link from "next/link";
import { saveVacature } from "@/app/admin/vacatures/actions";
import { VAKGEBIEDEN } from "@/lib/ats";

type V = {
  id?: string; titel?: string; vakgebied?: string; plaats?: string;
  uren_min?: number; uren_max?: number; salaris_min?: number | null; salaris_max?: number | null;
  type?: string; top?: boolean; omschrijving?: string; status?: string;
};

export default function VacatureForm({ vacature }: { vacature?: V }) {
  const v = vacature ?? {};
  return (
    <div className="p-8">
      <Link href="/admin/vacatures" className="text-sm font-semibold text-cobalt">← Vacatures</Link>
      <h1 className="display mt-2 text-3xl">{v.id ? "Vacature bewerken" : "Nieuwe vacature"}</h1>
      <form action={saveVacature} className="mt-8 grid max-w-2xl gap-5">
        {v.id && <input type="hidden" name="id" value={v.id} />}
        <Field label="Titel" name="titel" defaultValue={v.titel} required />
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-1.5"><span className="text-sm font-bold">Vakgebied</span>
            <select name="vakgebied" defaultValue={v.vakgebied ?? "wmo"} className="rounded-xl border-2 border-neutral-200 bg-white px-4 py-3">
              {Object.entries(VAKGEBIEDEN).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </select></label>
          <Field label="Plaats" name="plaats" defaultValue={v.plaats} />
        </div>
        <div className="grid gap-5 sm:grid-cols-4">
          <Field label="Uren min" name="uren_min" type="number" defaultValue={v.uren_min ?? 32} />
          <Field label="Uren max" name="uren_max" type="number" defaultValue={v.uren_max ?? 36} />
          <Field label="Salaris min (€/mnd)" name="salaris_min" type="number" defaultValue={v.salaris_min ?? ""} />
          <Field label="Salaris max (€/mnd)" name="salaris_max" type="number" defaultValue={v.salaris_max ?? ""} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-1.5"><span className="text-sm font-bold">Type</span>
            <select name="type" defaultValue={v.type ?? "Detachering"} className="rounded-xl border-2 border-neutral-200 bg-white px-4 py-3">
              <option>Detachering</option><option>ZZP</option><option>Werving & selectie</option>
            </select></label>
          <label className="grid gap-1.5"><span className="text-sm font-bold">Status</span>
            <select name="status" defaultValue={v.status ?? "open"} className="rounded-xl border-2 border-neutral-200 bg-white px-4 py-3">
              <option value="open">Open</option><option value="gesloten">Gesloten</option>
            </select></label>
        </div>
        <label className="grid gap-1.5"><span className="text-sm font-bold">Omschrijving</span>
          <textarea name="omschrijving" rows={4} defaultValue={v.omschrijving} className="rounded-xl border-2 border-neutral-200 px-4 py-3" /></label>
        <label className="flex items-center gap-2 font-semibold">
          <input type="checkbox" name="top" defaultChecked={v.top} className="h-5 w-5 accent-cobalt" /> Topvacature (uitgelicht)
        </label>
        <button className="justify-self-start rounded-full bg-cobalt px-6 py-3 font-bold text-white">Opslaan</button>
      </form>
    </div>
  );
}

function Field({ label, name, type = "text", defaultValue, required }: { label: string; name: string; type?: string; defaultValue?: string | number | null; required?: boolean }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-bold">{label}</span>
      <input name={name} type={type} required={required} defaultValue={defaultValue ?? ""} className="rounded-xl border-2 border-neutral-200 px-4 py-3" />
    </label>
  );
}
