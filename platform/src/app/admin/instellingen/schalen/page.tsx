import Link from "next/link";
import { requireAdmin } from "@/lib/admin-context";
import { loadTredes } from "@/lib/schalen";
import SchalenEditor from "@/components/SchalenEditor";

export const dynamic = "force-dynamic";

export default async function SchalenPagina() {
  const admin = await requireAdmin();
  const tredes = await loadTredes();
  const canEdit = admin.role === "super_admin";

  return (
    <div className="p-8">
      <Link href="/admin/plaatsingen" className="text-sm font-semibold text-cobalt">← Plaatsingen</Link>
      <h1 className="display mt-2 text-3xl">Schalen &amp; tredes</h1>
      <p className="mt-1 max-w-[75ch] text-muted">
        De salaristabel per trede, met de volledige kostenopbouw. Werk deze elk half jaar bij (plakken vanuit Excel kan).
        Bij een plaatsing kies je de trede; het inkooptarief per uur wordt dan automatisch overgenomen.
      </p>
      <div className="mt-6">
        <SchalenEditor initial={tredes} canEdit={canEdit} />
      </div>
    </div>
  );
}
