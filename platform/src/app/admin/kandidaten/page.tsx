import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import TalentpoolTable from "@/components/TalentpoolTable";
import { isDemo } from "@/lib/demo";
import { demoCandidates } from "@/lib/demo-store";

export const dynamic = "force-dynamic";

export default async function KandidatenPage() {
  let candidates: any[];
  if (isDemo()) {
    candidates = demoCandidates();
  } else {
    const supabase = await createClient();
    const { data } = await supabase
      .from("candidates")
      .select("id, naam, huidige_functie, vakgebied, niveau, status, tarief_min, tarief_max, rating, expertise, beschikbaar_per, uren_beschikbaar, regio, woonplaats, rijbewijs, opleidingsniveau, created_at")
      .order("created_at", { ascending: false });
    candidates = data ?? [];
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display text-3xl">Talentpool</h1>
          <p className="mt-1 text-muted">{candidates.length} kandidaten</p>
        </div>
        <Link href="/admin/kandidaten/nieuw" className="rounded-full bg-cobalt px-5 py-2.5 font-bold text-white">Nieuwe kandidaat</Link>
      </div>
      <div className="mt-8">
        <TalentpoolTable candidates={candidates} />
      </div>
    </div>
  );
}
