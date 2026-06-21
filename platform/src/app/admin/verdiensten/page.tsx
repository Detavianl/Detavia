import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-context";
import { isDemo } from "@/lib/demo";
import { verdeelMarge, euro2 } from "@/lib/verdiensten";

export const dynamic = "force-dynamic";

type Row = {
  id: string; functie: string; uurtarief: number | null; kostprijs: number | null;
  detavia_fee_pct: number | null; status: string | null;
  candidate: { id: string; naam: string; eigenaar: string | null } | null;
  company: { naam: string } | null;
};

export default async function VerdienstenPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const admin = await requireAdmin();
  const isRecruiter = admin.role === "recruiter";
  const sp = await searchParams;

  if (isDemo()) {
    return <div className="p-8"><h1 className="display text-3xl">Verdiensten</h1><p className="mt-2 text-muted">Beschikbaar zodra Supabase gekoppeld is (live).</p></div>;
  }

  const supabase = await createClient();
  const [{ data: pl }, { data: team }] = await Promise.all([
    supabase.from("placements").select("id, functie, uurtarief, kostprijs, detavia_fee_pct, status, candidate:candidates(id, naam, eigenaar), company:companies(naam)"),
    supabase.from("admin_users").select("user_id, naam, role"),
  ]);
  const naam = (uid: string | null) => team?.find((t) => t.user_id === uid)?.naam ?? "—";
  const recruiters = (team ?? []).filter((t) => t.role === "recruiter" || t.role === "admin" || t.role === "super_admin");

  let rows = (pl ?? []) as unknown as Row[];
  // Recruiter ziet alleen eigen kandidaten; super-admin/admin zien alles (met filter).
  if (isRecruiter) rows = rows.filter((r) => r.candidate?.eigenaar === admin.user_id);
  else if (sp.recruiter) rows = rows.filter((r) => r.candidate?.eigenaar === sp.recruiter);

  // Goedgekeurde uren per plaatsing.
  const ids = rows.map((r) => r.id);
  const urenPer: Record<string, number> = {};
  if (ids.length) {
    const { data: hrs } = await supabase.from("hours").select("placement_id, uren, status").in("placement_id", ids).eq("status", "goedgekeurd");
    for (const h of hrs ?? []) urenPer[h.placement_id] = (urenPer[h.placement_id] ?? 0) + Number(h.uren);
  }

  let totRecruiter = 0, totDetavia = 0;
  const data = rows.map((r) => {
    const v = verdeelMarge(r.uurtarief, r.kostprijs, r.detavia_fee_pct);
    const uren = urenPer[r.id] ?? 0;
    const recruiterTot = Math.round(v.recruiter * uren * 100) / 100;
    const detaviaTot = Math.round(v.detavia * uren * 100) / 100;
    totRecruiter += recruiterTot; totDetavia += detaviaTot;
    return { r, v, uren, recruiterTot, detaviaTot };
  });

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-3xl">{isRecruiter ? "Mijn verdiensten" : "Verdiensten"}</h1>
          <p className="mt-1 text-muted">{isRecruiter ? "Per kandidaat: wat jij meeverdient." : "Per kandidaat en recruiter. DetaVia houdt een fee van de marge, de recruiter krijgt de rest."}</p>
        </div>
        {!isRecruiter && (
          <form className="flex items-center gap-2">
            <label className="text-sm font-semibold">Recruiter</label>
            <select name="recruiter" defaultValue={sp.recruiter ?? ""} className="rounded-xl border-2 border-neutral-200 bg-white px-3 py-2 text-sm font-semibold">
              <option value="">Iedereen</option>
              {recruiters.map((t) => <option key={t.user_id} value={t.user_id}>{t.naam}</option>)}
            </select>
            <button className="rounded-full bg-cobalt px-4 py-2 text-sm font-bold text-white">Toon</button>
          </form>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Kpi label="Plaatsingen" value={String(data.length)} />
        <Kpi label={isRecruiter ? "Jouw verdienste (goedgekeurde uren)" : "Recruiters samen"} value={euro2(totRecruiter)} accent />
        {!isRecruiter && <Kpi label="DetaVia (goedgekeurde uren)" value={euro2(totDetavia)} />}
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Kandidaat</th>
              {!isRecruiter && <th className="px-4 py-3">Recruiter</th>}
              <th className="px-4 py-3">Weggezet bij</th>
              <th className="px-4 py-3 text-right">Kandidaat /u</th>
              <th className="px-4 py-3 text-right">Tarief /u</th>
              <th className="px-4 py-3 text-right">Marge /u</th>
              <th className="px-4 py-3 text-right">DetaVia /u</th>
              <th className="px-4 py-3 text-right">Recruiter /u</th>
              <th className="px-4 py-3 text-right">Uren</th>
              <th className="px-4 py-3 text-right">Recruiter totaal</th>
            </tr>
          </thead>
          <tbody>
            {data.map(({ r, v, uren, recruiterTot }) => (
              <tr key={r.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                <td className="px-4 py-3"><Link href={`/admin/plaatsingen/${r.id}`} className="font-bold text-cobalt">{r.candidate?.naam ?? "—"}</Link></td>
                {!isRecruiter && <td className="px-4 py-3">{naam(r.candidate?.eigenaar ?? null)}</td>}
                <td className="px-4 py-3">{r.functie}{r.company?.naam ? ` · ${r.company.naam}` : ""}</td>
                <td className="px-4 py-3 text-right">{euro2(v.kost)}</td>
                <td className="px-4 py-3 text-right">{euro2(v.tarief)}</td>
                <td className="px-4 py-3 text-right">{euro2(v.marge)}</td>
                <td className="px-4 py-3 text-right text-muted">{euro2(v.detavia)} <span className="text-[10px]">({v.pct}%)</span></td>
                <td className="px-4 py-3 text-right font-bold text-cobalt">{euro2(v.recruiter)}</td>
                <td className="px-4 py-3 text-right">{uren || "—"}</td>
                <td className="px-4 py-3 text-right font-extrabold">{euro2(recruiterTot)}</td>
              </tr>
            ))}
            {data.length === 0 && <tr><td colSpan={isRecruiter ? 9 : 10} className="px-5 py-10 text-center text-muted">Nog geen plaatsingen.</td></tr>}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-muted">Recruiter /u = marge − DetaVia-fee. &quot;Recruiter totaal&quot; = recruiter /u × goedgekeurde uren. De fee per plaatsing stel je in bij de plaatsing.</p>
    </div>
  );
}

function Kpi({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return <div className="rounded-2xl border border-neutral-200 bg-white p-5"><div className={`text-xl font-extrabold ${accent ? "text-cobalt" : ""}`}>{value}</div><div className="mt-1 text-sm font-semibold text-muted">{label}</div></div>;
}
