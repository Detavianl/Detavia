import { createClient } from "@/lib/supabase/server";
import AtsBoard from "@/components/AtsBoard";
import type { AtsCard } from "@/lib/ats";
import { isDemo, DEMO_COMPANIES } from "@/lib/demo";
import { demoApplications } from "@/lib/demo-store";
import { loadMargeConfig } from "@/lib/marge";
import { DEFAULT_CONFIG } from "@/lib/marge-calc";
import { loadTredes } from "@/lib/schalen";
import type { Trede } from "@/lib/schalen-util";
import { getAdmin } from "@/lib/admin-context";

export const dynamic = "force-dynamic";

export default async function AtsPage() {
  const admin = await getAdmin();
  let cards: AtsCard[];
  let companies: { id: string; naam: string }[] = [];
  let recruiters: { id: string; naam: string }[] = [];
  let config = DEFAULT_CONFIG;
  let tredes: Trede[] = [];

  if (isDemo()) {
    cards = demoApplications();
    companies = DEMO_COMPANIES.map((c) => ({ id: c.id, naam: c.naam }));
  } else {
    const supabase = await createClient();
    const [{ data }, { data: co }, { data: team }] = await Promise.all([
      supabase
        .from("applications")
        .select("id, stage, positie, notitie, candidate:candidates(id, naam, vakgebied, woonplaats, eigenaar), vacature:vacatures(id, titel, company_id, recruiter_id)")
        .order("positie", { ascending: true }),
      supabase.from("companies").select("id, naam").order("naam"),
      supabase.from("admin_users").select("user_id, naam, role").order("naam"),
    ]);
    cards = (data ?? []) as unknown as AtsCard[];
    companies = co ?? [];
    recruiters = (team ?? [])
      .filter((t) => ["recruiter", "admin", "super_admin"].includes(t.role))
      .map((t) => ({ id: t.user_id, naam: t.naam }));
    config = await loadMargeConfig();
    tredes = await loadTredes();
  }

  return (
    <div className="p-8">
      <h1 className="display text-3xl">ATS</h1>
      <p className="mt-1 text-muted">Sleep kandidaten door de pijplijn.</p>
      <div className="mt-8">
        <AtsBoard initial={cards} companies={companies} recruiters={recruiters} config={config} tredes={tredes} currentUserId={admin?.user_id ?? ""} currentUserNaam={admin?.naam || admin?.email || ""} canEditRecruiter={admin?.role === "super_admin"} toonMarge={admin?.role !== "jr_recruiter"} />
      </div>
    </div>
  );
}
