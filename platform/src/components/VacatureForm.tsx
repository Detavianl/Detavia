import Link from "next/link";
import { saveVacature, deactivateVacature } from "@/app/admin/vacatures/actions";
import { VAKGEBIEDEN } from "@/lib/ats";

type V = {
  id?: string; titel?: string; vakgebied?: string; plaats?: string;
  uren_min?: number; uren_max?: number; salaris_min?: number | null; salaris_max?: number | null;
  type?: string; top?: boolean; omschrijving?: string; status?: string; company_id?: string | null;
  taken?: string; eisen?: string[] | null; opdrachtgever?: string; startdatum?: string; duur?: string;
  salaris_periode?: string; inactief_op?: string | null;
};

export default function VacatureForm({ vacature, companies = [] }: { vacature?: V; companies?: { id: string; naam: string }[] }) {
  const v = vacature ?? {};
  return (
    <div className="p-8">
      <Link href="/admin/vacatures" className="text-sm font-semibold text-cobalt">← Vacatures</Link>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="display text-3xl">{v.id ? "Vacature bewerken" : "Nieuwe vacature"}</h1>
        {v.id && (v.status ?? "open") === "open" && (
          <form action={deactivateVacature.bind(null, v.id)}>
            <button className="rounded-full border-2 border-red-300 px-5 py-2 font-bold text-red-600 hover:bg-red-50">Op inactief zetten</button>
          </form>
        )}
        {v.id && v.status === "gesloten" && (
          <span className="rounded-full bg-neutral-200 px-4 py-1.5 text-sm font-bold text-neutral-600">Inactief</span>
        )}
      </div>
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
        <label className="grid gap-1.5"><span className="text-sm font-bold">Bedrijf (opdrachtgever)</span>
          <select name="company_id" defaultValue={v.company_id ?? ""} className="rounded-xl border-2 border-neutral-200 bg-white px-4 py-3">
            <option value="">— geen / nog onbekend —</option>
            {companies.map((c) => <option key={c.id} value={c.id}>{c.naam}</option>)}
          </select></label>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Uren min (per week)" name="uren_min" type="number" defaultValue={v.uren_min ?? 32} />
          <Field label="Uren max (per week)" name="uren_max" type="number" defaultValue={v.uren_max ?? 36} />
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Salaris min (€)" name="salaris_min" type="number" step="0.01" defaultValue={v.salaris_min ?? ""} />
          <Field label="Salaris max (€)" name="salaris_max" type="number" step="0.01" defaultValue={v.salaris_max ?? ""} />
          <label className="grid gap-1.5"><span className="text-sm font-bold">Salaris per</span>
            <select name="salaris_periode" defaultValue={v.salaris_periode ?? "maand"} className="rounded-xl border-2 border-neutral-200 bg-white px-4 py-3">
              <option value="uur">per uur</option>
              <option value="week">per week</option>
              <option value="4weken">per 4 weken</option>
              <option value="maand">per maand</option>
            </select></label>
        </div>
        <p className="-mt-2 text-xs text-neutral-500">Laat salaris leeg voor &quot;Tarief in overleg&quot;. Bij een uurtarief mag je centen gebruiken (bv. 62,50).</p>
        <div className="grid gap-5 sm:grid-cols-3">
          <label className="grid gap-1.5"><span className="text-sm font-bold">Type</span>
            <select name="type" defaultValue={v.type ?? "Detachering"} className="rounded-xl border-2 border-neutral-200 bg-white px-4 py-3">
              <option>Detachering</option><option>ZZP</option><option>Werving & selectie</option>
            </select></label>
          <label className="grid gap-1.5"><span className="text-sm font-bold">Status</span>
            <select name="status" defaultValue={v.status ?? "open"} className="rounded-xl border-2 border-neutral-200 bg-white px-4 py-3">
              <option value="open">Open (zichtbaar)</option><option value="gesloten">Gesloten (inactief)</option>
            </select></label>
          <label className="grid gap-1.5"><span className="text-sm font-bold">Automatisch inactief op</span>
            <input name="inactief_op" type="date" defaultValue={v.inactief_op ?? ""} className="rounded-xl border-2 border-neutral-200 px-4 py-3" />
            <span className="text-xs text-neutral-500">Optioneel. Vanaf deze datum verdwijnt de vacature.</span></label>
        </div>
        <label className="grid gap-1.5"><span className="text-sm font-bold">Korte omschrijving</span>
          <span className="text-xs text-neutral-500">Korte intro die in het overzicht en bovenaan de vacature staat.</span>
          <textarea name="omschrijving" rows={3} defaultValue={v.omschrijving} className="rounded-xl border-2 border-neutral-200 px-4 py-3" /></label>

        <label className="grid gap-1.5"><span className="text-sm font-bold">Wat ga je doen?</span>
          <span className="text-xs text-neutral-500">De uitgebreide taakomschrijving op de detailpagina.</span>
          <textarea name="taken" rows={5} defaultValue={v.taken} className="rounded-xl border-2 border-neutral-200 px-4 py-3" /></label>

        <label className="grid gap-1.5"><span className="text-sm font-bold">Wat je meebrengt (eisen)</span>
          <span className="text-xs text-neutral-500">Eén eis per regel. Verschijnen als lijst met vinkjes.</span>
          <textarea name="eisen" rows={6} defaultValue={(v.eisen ?? []).join("\n")} className="rounded-xl border-2 border-neutral-200 px-4 py-3" placeholder={"Een afgeronde hbo-opleiding\nMinimaal 1 jaar ervaring in het sociaal domein\n..."} /></label>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Opdrachtgever (weergavenaam)" name="opdrachtgever" defaultValue={v.opdrachtgever} />
          <Field label="Startdatum" name="startdatum" defaultValue={v.startdatum} />
          <Field label="Duur" name="duur" defaultValue={v.duur} />
        </div>

        <label className="flex items-center gap-2 font-semibold">
          <input type="checkbox" name="top" defaultChecked={v.top} className="h-5 w-5 accent-cobalt" /> Topvacature (uitgelicht)
        </label>
        <button className="justify-self-start rounded-full bg-cobalt px-6 py-3 font-bold text-white">Opslaan</button>
      </form>
    </div>
  );
}

function Field({ label, name, type = "text", defaultValue, required, step }: { label: string; name: string; type?: string; defaultValue?: string | number | null; required?: boolean; step?: string }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-bold">{label}</span>
      <input name={name} type={type} step={step} required={required} defaultValue={defaultValue ?? ""} className="rounded-xl border-2 border-neutral-200 px-4 py-3" />
    </label>
  );
}
