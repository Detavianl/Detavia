import VacatureForm from "@/components/VacatureForm";
import { createClient } from "@/lib/supabase/server";
import { isDemo, DEMO_COMPANIES } from "@/lib/demo";

export const dynamic = "force-dynamic";

export default async function NieuweVacature() {
  let companies: any[];
  if (isDemo()) companies = DEMO_COMPANIES;
  else { const supabase = await createClient(); const { data } = await supabase.from("companies").select("id, naam").order("naam"); companies = data ?? []; }
  return <VacatureForm companies={companies} />;
}
