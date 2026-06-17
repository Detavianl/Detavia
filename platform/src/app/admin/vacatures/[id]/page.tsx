import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import VacatureForm from "@/components/VacatureForm";

export const dynamic = "force-dynamic";

export default async function BewerkVacature({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("vacatures").select("*").eq("id", id).single();
  if (!data) notFound();
  return <VacatureForm vacature={data} />;
}
