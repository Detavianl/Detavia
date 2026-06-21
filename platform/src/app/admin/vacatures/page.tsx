import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { VAKGEBIEDEN } from "@/lib/ats";
import DeleteVacatureButton from "@/components/DeleteVacatureButton";
import { isDemo, DEMO_VACATURES_ADMIN } from "@/lib/demo";

export const dynamic = "force-dynamic";

export default async function VacaturesAdmin() {
  let vacatures: any[];
  if (isDemo()) {
    vacatures = DEMO_VACATURES_ADMIN;
  } else {
    const supabase = await createClient();
    const { data } = await supabase.from("vacatures").select("id, titel, vakgebied, plaats, status, top").order("created_at", { ascending: false });
    vacatures = data ?? [];
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div><h1 className="display text-3xl">Vacatures</h1><p className="mt-1 text-muted">{vacatures.length} vacatures</p></div>
        <div className="flex gap-2.5">
          <Link href="/admin/vacatures/import" className="rounded-full border-2 border-cobalt px-5 py-2 font-bold text-cobalt">Importeren (XML)</Link>
          <Link href="/admin/vacatures/nieuw" className="rounded-full bg-cobalt px-5 py-2.5 font-bold text-white">Nieuwe vacature</Link>
        </div>
      </div>
      <div className="mt-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-muted">
            <tr><th className="px-5 py-3">Titel</th><th className="px-5 py-3">Vakgebied</th><th className="px-5 py-3">Plaats</th><th className="px-5 py-3">Status</th><th className="px-5 py-3"></th></tr>
          </thead>
          <tbody>
            {vacatures.map((v) => (
              <tr key={v.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                <td className="px-5 py-3"><Link href={`/admin/vacatures/${v.id}`} className="font-bold text-cobalt">{v.titel}</Link>{v.top && <span className="ml-2 rounded-full bg-yellow px-2 py-0.5 text-xs font-bold">Top</span>}</td>
                <td className="px-5 py-3">{VAKGEBIEDEN[v.vakgebied] ?? v.vakgebied}</td>
                <td className="px-5 py-3">{v.plaats || "—"}</td>
                <td className="px-5 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-bold ${v.status === "open" ? "bg-green-100 text-green-700" : "bg-neutral-100 text-muted"}`}>{v.status}</span></td>
                <td className="px-5 py-3 text-right"><DeleteVacatureButton id={v.id} /></td>
              </tr>
            ))}
            {vacatures.length === 0 && <tr><td colSpan={5} className="px-5 py-10 text-center text-muted">Nog geen vacatures.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
