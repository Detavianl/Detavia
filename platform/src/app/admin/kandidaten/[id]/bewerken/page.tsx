import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CandidateForm from "@/components/CandidateForm";
import { updateCandidate } from "../../actions";

export const dynamic = "force-dynamic";

export default async function KandidaatBewerken({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("candidates").select("*").eq("id", id).single();
  if (!data) notFound();
  return <CandidateForm candidate={data} action={updateCandidate} isEdit />;
}
