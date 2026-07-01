import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CandidateForm from "@/components/CandidateForm";
import { updateCandidate } from "../../actions";
import { requireAdmin } from "@/lib/admin-context";

export const dynamic = "force-dynamic";

export default async function KandidaatBewerken({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase.from("candidates").select("*").eq("id", id).single();
  if (!data) notFound();

  const superAdmin = admin.role === "super_admin";
  const { data: teamData } = await supabase.from("admin_users").select("user_id, naam").order("naam");
  const team = teamData ?? [];
  const eigenaarNaam = team.find((t) => t.user_id === data.eigenaar)?.naam ?? "";

  return (
    <CandidateForm
      candidate={data}
      action={updateCandidate}
      isEdit
      canEditOwner={superAdmin}
      team={team}
      eigenaar={data.eigenaar ?? ""}
      eigenaarNaam={eigenaarNaam}
    />
  );
}
