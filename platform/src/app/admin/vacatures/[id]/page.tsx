import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import VacatureForm from "@/components/VacatureForm";

export const dynamic = "force-dynamic";

export default async function BewerkVacature({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data }, { data: companies }] = await Promise.all([
    supabase.from("vacatures").select("*").eq("id", id).single(),
    supabase.from("companies").select("id, naam").order("naam"),
  ]);
  if (!data) notFound();
  return <VacatureForm vacature={data} companies={companies ?? []} />;
}
