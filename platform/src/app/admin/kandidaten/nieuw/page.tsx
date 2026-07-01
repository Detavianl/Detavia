import CandidateForm from "@/components/CandidateForm";
import { createCandidate } from "../actions";
import { requireAdmin } from "@/lib/admin-context";
import { createClient } from "@/lib/supabase/server";
import { isDemo } from "@/lib/demo";

export const dynamic = "force-dynamic";

export default async function NieuweKandidaat() {
  const admin = await requireAdmin();
  const superAdmin = admin.role === "super_admin";
  let team: { user_id: string; naam: string }[] = [];
  if (superAdmin && !isDemo()) {
    const supabase = await createClient();
    const { data } = await supabase.from("admin_users").select("user_id, naam").order("naam");
    team = data ?? [];
  }
  return (
    <CandidateForm
      action={createCandidate}
      canEditOwner={superAdmin}
      team={team}
      eigenaar={admin.user_id}
      eigenaarNaam={admin.naam || admin.email}
    />
  );
}
