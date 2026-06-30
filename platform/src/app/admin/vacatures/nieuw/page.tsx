import VacatureForm from "@/components/VacatureForm";
import { createClient } from "@/lib/supabase/server";
import { isDemo, DEMO_COMPANIES } from "@/lib/demo";

export const dynamic = "force-dynamic";

export default async function NieuweVacature() {
  let companies: { id: string; naam: string }[] = [];
  let recruiters: { id: string; naam: string }[] = [];
  if (isDemo()) {
    companies = DEMO_COMPANIES.map((c) => ({ id: c.id, naam: c.naam }));
  } else {
    const supabase = await createClient();
    const [{ data: co }, { data: team }] = await Promise.all([
      supabase.from("companies").select("id, naam").order("naam"),
      supabase.from("admin_users").select("user_id, naam, role").order("naam"),
    ]);
    companies = co ?? [];
    recruiters = (team ?? []).filter((t) => ["recruiter", "admin", "super_admin"].includes(t.role)).map((t) => ({ id: t.user_id, naam: t.naam }));
  }
  return <VacatureForm companies={companies} recruiters={recruiters} />;
}
