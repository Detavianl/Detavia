import { createClient } from "@/lib/supabase/server";
import PlacementForm from "@/components/PlacementForm";
import { loadMargeConfig } from "@/lib/marge";
import { isDemo, DEMO_CANDIDATES, DEMO_COMPANIES } from "@/lib/demo";

export const dynamic = "force-dynamic";

export default async function NieuwePlaatsing() {
  let candidates: { id: string; naam: string }[], companies: { id: string; naam: string }[];
  if (isDemo()) {
    candidates = DEMO_CANDIDATES.map((c) => ({ id: c.id, naam: c.naam }));
    companies = DEMO_COMPANIES.map((c) => ({ id: c.id, naam: c.naam }));
  } else {
    const supabase = await createClient();
    const [{ data: cd }, { data: co }] = await Promise.all([
      supabase.from("candidates").select("id, naam").order("naam"),
      supabase.from("companies").select("id, naam").order("naam"),
    ]);
    candidates = cd ?? []; companies = co ?? [];
  }
  const config = await loadMargeConfig();
  return <PlacementForm candidates={candidates} companies={companies} config={config} />;
}
