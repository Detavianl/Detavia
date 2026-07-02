import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DeletePostButton from "@/components/DeletePostButton";
import { isDemo, DEMO_POSTS } from "@/lib/demo";

export const dynamic = "force-dynamic";

export default async function BlogAdmin() {
  let posts: any[];
  if (isDemo()) {
    posts = DEMO_POSTS;
  } else {
    const supabase = await createClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("id, titel, categorie, status, updated_at")
      .order("updated_at", { ascending: false });
    posts = data ?? [];
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div><h1 className="display text-3xl">Blog</h1><p className="mt-1 text-muted">{posts.length} artikelen</p></div>
        <Link href="/admin/blog/nieuw" className="rounded-full bg-cobalt px-5 py-2.5 font-bold text-white">Nieuw artikel</Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-muted">
            <tr><th className="px-5 py-3">Titel</th><th className="px-5 py-3">Categorie</th><th className="px-5 py-3">Status</th><th className="px-5 py-3"></th></tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                <td className="px-5 py-3"><Link href={`/admin/blog/${p.id}`} className="font-bold text-cobalt">{p.titel}</Link></td>
                <td className="px-5 py-3">{p.categorie}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${p.status === "gepubliceerd" ? "bg-green-100 text-green-700" : "bg-neutral-100 text-muted"}`}>{p.status}</span>
                </td>
                <td className="px-5 py-3 text-right"><DeletePostButton id={p.id} /></td>
              </tr>
            ))}
            {posts.length === 0 && <tr><td colSpan={4} className="px-5 py-10 text-center text-muted">Nog geen artikelen.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
