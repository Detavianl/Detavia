import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import VacatureForm from "@/components/VacatureForm";
import QuickNotes from "@/components/QuickNotes";
import { loadNotes } from "@/lib/notes";
import { requireAdmin } from "@/lib/admin-context";

export const dynamic = "force-dynamic";

export default async function BewerkVacature({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = await requireAdmin();
  const supabase = await createClient();
  const [{ data }, { data: companies }, notes] = await Promise.all([
    supabase.from("vacatures").select("*").eq("id", id).single(),
    supabase.from("companies").select("id, naam").order("naam"),
    loadNotes("vacature", id),
  ]);
  if (!data) notFound();
  return (
    <>
      <VacatureForm vacature={data} companies={companies ?? []} />
      <section className="mx-8 mb-8 max-w-2xl rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-3 text-lg font-bold">Interne notities</h2>
        <QuickNotes entity="vacature" entityId={id} items={notes} currentUser={admin.naam} demo={false} />
      </section>
    </>
  );
}
