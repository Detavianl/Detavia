import { createClient } from "@/lib/supabase/server";
import PlacementForm from "@/components/PlacementForm";
import { loadMargeConfig } from "@/lib/marge";
import { isDemo, DEMO_CANDIDATES, DEMO_COMPANIES } from "@/lib/demo";

export const dynamic = "force-dynamic";

export default async function NieuwePlaatsing() {
  let candidates: { id: string; naam: string; eigenaar: string | null }[];
  let companies: { id: string; naam: string }[];
  let recruiters: { id: string; naam: string }[] = [];
  if (isDemo()) {
    candidates = DEMO_CANDIDATES.map((c) => ({ id: c.id, naam: c.naam, eigenaar: c.eigenaar ?? null }));
    companies = DEMO_COMPANIES.map((c) => ({ id: c.id, naam: c.naam }));
  } else {
    const supabase = await createClient();
    const [{ data: cd }, { data: co }, { data: team }] = await Promise.all([
      supabase.from("candidates").select("id, naam, eigenaar").order("naam"),
      supabase.from("companies").select("id, naam").order("naam"),
      supabase.from("admin_users").select("user_id, naam, role").order("naam"),
    ]);
    candidates = cd ?? []; companies = co ?? [];
    recruiters = (team ?? [])
      .filter((t) => ["recruiter", "admin", "super_admin"].includes(t.role))
      .map((t) => ({ id: t.user_id, naam: t.naam }));
  }
  const config = await loadMargeConfig();
  return <PlacementForm candidates={candidates} companies={companies} recruiters={recruiters} config={config} />;
}
