import Link from "next/link";
import { requireRole } from "@/lib/admin-context";
import { loadMargeConfig } from "@/lib/marge";
import { saveMargeConfig } from "./actions";

export const dynamic = "force-dynamic";

export default async function MargeInstellingen({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  await requireRole("super_admin");
  const c = await loadMargeConfig();
  const sp = await searchParams;
  const overhead = c.ziekteverzuim_pct + c.administratie_pct + c.juridisch_pct + c.verzekeringen_pct;

  return (
    <div className="p-8">
      <Link href="/admin/verdiensten" className="text-sm font-semibold text-cobalt">← Verdiensten</Link>
      <h1 className="display mt-2 text-3xl">Marge-instellingen</h1>
      <p className="mt-1 max-w-[60ch] text-muted">Deze percentages bepalen de opbouw van het verkooptarief. Alleen jij (super-admin) kunt ze aanpassen. De recruitervergoeding is wat overblijft na overhead en nettowinst.</p>

      {sp.ok && <div className="mt-5 max-w-xl rounded-xl bg-green-50 p-3 text-sm font-semibold text-green-800">Opgeslagen.</div>}

      <form action={saveMargeConfig} className="mt-6 max-w-xl">
        <section className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="text-lg font-bold">Overheadkosten (% van verkooptarief)</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Ziekteverzuim & loondoorbetaling" name="ziekteverzuim_pct" value={c.ziekteverzuim_pct} />
            <Field label="Administratie, facturatie & payroll" name="administratie_pct" value={c.administratie_pct} />
            <Field label="Juridisch / compliance / contractbeheer" name="juridisch_pct" value={c.juridisch_pct} />
            <Field label="Verzekeringen (WA, beroepsaansprakelijkheid)" name="verzekeringen_pct" value={c.verzekeringen_pct} />
          </div>
          <p className="mt-3 text-sm text-muted">Subtotaal overhead: <b>{overhead.toLocaleString("nl-NL")}%</b></p>
        </section>

        <section className="mt-5 rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="text-lg font-bold">Nettowinst (gegarandeerd minimum)</h2>
          <div className="mt-4 max-w-[240px]">
            <Field label="Nettowinst / bedrijfscontinuïteit (%)" name="nettowinst_pct" value={c.nettowinst_pct} />
          </div>
          <p className="mt-3 text-sm text-muted">Krijgt voorrang: de recruitervergoeding is wat overblijft na overhead en deze nettowinst.</p>
        </section>

        <button className="mt-6 rounded-full bg-cobalt px-6 py-3 font-bold text-white">Opslaan</button>
      </form>
    </div>
  );
}

function Field({ label, name, value }: { label: string; name: string; value: number }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-bold">{label}</span>
      <div className="flex items-center gap-2">
        <input name={name} type="number" step="0.1" min="0" defaultValue={value} className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3" />
        <span className="font-bold text-muted">%</span>
      </div>
    </label>
  );
}
