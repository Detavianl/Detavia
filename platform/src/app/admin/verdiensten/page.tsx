import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-context";
import { isDemo } from "@/lib/demo";
import { loadMargeConfig, berekenMarge } from "@/lib/marge";
import VerdienstenTabel, { type VerdienstRow } from "@/components/VerdienstenTabel";

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

  const tabelRows: VerdienstRow[] = rows.map((r) => {
    const m = berekenMarge(r.uurtarief, r.kostprijs, config);
    return {
      id: r.id,
      kandidaat: r.candidate?.naam ?? "—",
      recruiterNaam: naam(recOf(r)),
      weggezet: `${r.functie}${r.company?.naam ? ` · ${r.company.naam}` : ""}`,
      verkoop: m.verkoop, inkoop: m.inkoop, brutoMarge: m.brutoMarge,
      overhead: m.overhead, nettowinst: m.nettowinst, recruiter: m.recruiter, teLaag: m.teLaag,
    };
  });

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

      <VerdienstenTabel rows={tabelRows} isRecruiter={isRecruiter} />
    </div>
  );
}
