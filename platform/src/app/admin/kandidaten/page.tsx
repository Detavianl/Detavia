import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { VAKGEBIEDEN } from "@/lib/ats";
import { isDemo, DEMO_CANDIDATES } from "@/lib/demo";

export const dynamic = "force-dynamic";

export default async function KandidatenPage() {
  let candidates: any[];
  if (isDemo()) {
    candidates = DEMO_CANDIDATES;
  } else {
    const supabase = await createClient();
    const { data } = await supabase
      .from("candidates")
      .select("id, naam, email, woonplaats, vakgebied, bron, created_at")
      .order("created_at", { ascending: false });
    candidates = data ?? [];
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display text-3xl">Kandidaten</h1>
          <p className="mt-1 text-muted">{candidates.length} kandidaten</p>
        </div>
        <Link href="/admin/kandidaten/nieuw" className="rounded-full bg-cobalt px-5 py-2.5 font-bold text-white">Nieuwe kandidaat</Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-5 py-3">Naam</th><th className="px-5 py-3">Vakgebied</th>
              <th className="px-5 py-3">Woonplaats</th><th className="px-5 py-3">Bron</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => (
              <tr key={c.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                <td className="px-5 py-3"><Link href={`/admin/kandidaten/${c.id}`} className="font-bold text-cobalt">{c.naam}</Link>
                  <div className="text-xs text-muted">{c.email}</div></td>
                <td className="px-5 py-3">{c.vakgebied ? VAKGEBIEDEN[c.vakgebied] ?? c.vakgebied : "—"}</td>
                <td className="px-5 py-3">{c.woonplaats || "—"}</td>
                <td className="px-5 py-3"><span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-semibold">{c.bron}</span></td>
              </tr>
            ))}
            {candidates.length === 0 && (
              <tr><td colSpan={4} className="px-5 py-10 text-center text-muted">Nog geen kandidaten. Voeg er handmatig een toe of wacht op sollicitaties.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
