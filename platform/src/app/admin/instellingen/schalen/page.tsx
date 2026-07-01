import Link from "next/link";
import { requireAdmin } from "@/lib/admin-context";
import { loadSchalen } from "@/lib/schalen";
import SchalenEditor from "@/components/SchalenEditor";

export const dynamic = "force-dynamic";

export default async function SchalenPagina() {
  const admin = await requireAdmin();
  const schalen = await loadSchalen();
  const canEdit = admin.role === "super_admin";

  return (
    <div className="p-8">
      <Link href="/admin/plaatsingen" className="text-sm font-semibold text-cobalt">← Plaatsingen</Link>
      <h1 className="display mt-2 text-3xl">Schalen &amp; tredes</h1>
      <p className="mt-1 max-w-[70ch] text-muted">
        De CAO-salaristabel: schalen als kolommen, tredes als rijen, per cel het bruto maandbedrag. Werk deze elk half jaar bij.
        Bij een plaatsing kies je een schaal + trede en wordt het bijbehorende bedrag automatisch overgenomen.
      </p>
      <div className="mt-6">
        <SchalenEditor initial={schalen} canEdit={canEdit} />
      </div>
    </div>
  );
}
