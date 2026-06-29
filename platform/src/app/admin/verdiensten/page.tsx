import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-context";
import { isDemo } from "@/lib/demo";
import { loadMargeConfig, berekenMarge, euro2 } from "@/lib/marge";

export const dynamic = "force-dynamic";

type Row = {
  id: string; functie: string; uurtarief: number | null; kostprijs: number | null; status: string | null; recruiter_id: string | null;
  candidate: { id: string; naam: string; eigenaar: string | null } | null;
  company: { naam: string } | null;
};

export default async function VerdienstenPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const admin = await requireAdmin();
  const isRecruiter = admin.role === "recruiter";
  const isSuper = admin.role === "super_admin";
  const sp = await searchParams;

  if (isDemo()) {
    return <div className="p-8"><h1 className="display text-3xl">Verdiensten</h1><p className="mt-2 text-muted">Beschikbaar zodra Supabase gekoppeld is (live).</p></div>;
  }

  const supabase = await createClient();
  const config = await loadMargeConfig();
  const [{ data: pl }, { data: team }] = await Promise.all([
    supabase.from("placements").select("id, functie, uurtarief, kostprijs, status, recruiter_id, candidate:candidates(id, naam, eigenaar), company:companies(naam)"),
    supabase.from("admin_users").select("user_id, naam, role"),
  ]);
  const naam = (uid: string | null) => team?.find((t) => t.user_id === uid)?.naam ?? "—";
  const recruiters = (team ?? []).filter((t) => ["recruiter", "admin", "super_admin"].includes(t.role));

  // Afrekenen op de recruiter van de plaatsing (valt terug op de eigenaar van de kandidaat).
  const recOf = (r: Row) => r.recruiter_id ?? r.candidate?.eigenaar ?? null;

  let rows = (pl ?? []) as unknown as Row[];
  if (isRecruiter) rows = rows.filter((r) => recOf(r) === admin.user_id);
  else if (sp.recruiter) rows = rows.filter((r) => recOf(r) === sp.recruiter);

  const data = rows.map((r) => ({ r, m: berekenMarge(r.uurtarief, r.kostprijs, config) }));
  const gem = (sel: (x: { m: ReturnType<typeof berekenMarge> }) => number) => (data.length ? data.reduce((a, x) => a + sel(x), 0) / data.length : 0);

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-3xl">{isRecruiter ? "Mijn verdiensten" : "Verdiensten"}</h1>
          <p className="mt-1 text-muted">{isRecruiter ? "Per kandidaat: wat jij per uur meeverdient." : `Opbouw per plaatsing (per uur). Overhead ${(config.ziekteverzuim_pct + config.administratie_pct + config.juridisch_pct + config.verzekeringen_pct).toLocaleString("nl-NL")}% + nettowinst ${config.nettowinst_pct.toLocaleString("nl-NL")}%; de recruiter krijgt de rest.`}</p>
        </div>
        <div className="flex items-center gap-3">
          {isSuper && <Link href="/admin/instellingen/marge" className="text-sm font-bold text-cobalt hover:underline">Marge-instellingen</Link>}
          {!isRecruiter && (
            <form className="flex items-center gap-2">
              <select name="recruiter" defaultValue={sp.recruiter ?? ""} className="rounded-xl border-2 border-neutral-200 bg-white px-3 py-2 text-sm font-semibold">
                <option value="">Alle recruiters</option>
                {recruiters.map((t) => <option key={t.user_id} value={t.user_id}>{t.naam}</option>)}
              </select>
              <button className="rounded-full bg-cobalt px-4 py-2 text-sm font-bold text-white">Toon</button>
            </form>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Kpi label="Plaatsingen" value={String(data.length)} />
        <Kpi label="Gem. recruitervergoeding /u" value={euro2(gem((x) => x.m.recruiter))} accent />
        {!isRecruiter && <Kpi label="Gem. nettowinst /u" value={euro2(gem((x) => x.m.nettowinst))} />}
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Kandidaat</th>
              {!isRecruiter && <th className="px-4 py-3">Recruiter</th>}
              <th className="px-4 py-3">Weggezet bij</th>
              <th className="px-4 py-3 text-right">Verkoop /u</th>
              <th className="px-4 py-3 text-right">Inkoop /u</th>
              <th className="px-4 py-3 text-right">Bruto marge</th>
              <th className="px-4 py-3 text-right">Overhead</th>
              <th className="px-4 py-3 text-right">Nettowinst</th>
              <th className="px-4 py-3 text-right">Recruiter /u</th>
            </tr>
          </thead>
          <tbody>
            {data.map(({ r, m }) => (
              <tr key={r.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                <td className="px-4 py-3"><Link href={`/admin/plaatsingen/${r.id}`} className="font-bold text-cobalt">{r.candidate?.naam ?? "—"}</Link></td>
                {!isRecruiter && <td className="px-4 py-3">{naam(recOf(r))}</td>}
                <td className="px-4 py-3">{r.functie}{r.company?.naam ? ` · ${r.company.naam}` : ""}</td>
                <td className="px-4 py-3 text-right">{euro2(m.verkoop)}</td>
                <td className="px-4 py-3 text-right">{euro2(m.inkoop)}</td>
                <td className="px-4 py-3 text-right">{euro2(m.brutoMarge)}</td>
                <td className="px-4 py-3 text-right text-muted">{euro2(m.overhead)}</td>
                <td className="px-4 py-3 text-right text-muted">{euro2(m.nettowinst)}</td>
                <td className="px-4 py-3 text-right font-bold text-cobalt">{m.teLaag ? <span className="text-red-500">€ 0,00</span> : euro2(m.recruiter)}</td>
              </tr>
            ))}
            {data.length === 0 && <tr><td colSpan={isRecruiter ? 8 : 9} className="px-5 py-10 text-center text-muted">Nog geen plaatsingen.</td></tr>}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-muted">Recruiter /u = bruto marge − overhead − nettowinst (minimaal € 0). Bij een te lage marge krijgt de recruiter € 0. Bedragen zijn per gewerkt uur.</p>
    </div>
  );
}

function Kpi({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return <div className="rounded-2xl border border-neutral-200 bg-white p-5"><div className={`text-xl font-extrabold ${accent ? "text-cobalt" : ""}`}>{value}</div><div className="mt-1 text-sm font-semibold text-muted">{label}</div></div>;
}
