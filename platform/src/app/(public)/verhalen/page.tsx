import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = pageMeta({ title: "Verhalen & blog", description: "Ervaringsverhalen, praktijkvoorbeelden en kennis uit het sociaal domein, verteld door de professionals en opdrachtgevers van DetaVia.", path: "/verhalen" });
export const dynamic = "force-dynamic";

type Post = { slug: string; titel: string; categorie: string; excerpt: string; cover_path: string | null; published_at: string | null };

async function loadPosts(): Promise<Post[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("slug, titel, categorie, excerpt, cover_path, published_at")
      .eq("status", "gepubliceerd")
      .order("published_at", { ascending: false });
    return (data ?? []) as Post[];
  } catch {
    return [];
  }
}

export default async function Verhalen() {
  const posts = await loadPosts();
  return (
    <>
      <section className="relative overflow-hidden bg-cobalt text-white">
        <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-10">
          <p className="text-sm font-semibold opacity-70">Home / Verhalen</p>
          <h1 className="display mt-3 text-4xl sm:text-6xl">Verhalen uit het sociaal domein</h1>
          <p className="mt-4 max-w-[54ch] text-lg">Ervaringen van onze professionals, praktijkverhalen en inzichten die het vak vooruit helpen.</p>
        </div>
      </section>
      <section className="mx-auto max-w-[1180px] px-5 py-20 sm:px-10">
        {posts.length === 0 ? (
          <p className="text-muted">Binnenkort verschijnen hier de eerste verhalen. Ze worden vanuit het beheer (blog) geplaatst.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <Link key={p.slug} href={`/verhalen/${p.slug}`} className="flex flex-col overflow-hidden rounded-[22px] border-[1.5px] border-neutral-200 transition hover:-translate-y-1 hover:shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.cover_path ?? "/img/office-worker-960x640.jpg"} alt="" className="aspect-[16/10] w-full object-cover" />
                <div className="flex flex-1 flex-col gap-2.5 p-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-cobalt">{p.categorie}</span>
                  <h3 className="text-xl font-bold leading-tight">{p.titel}</h3>
                  <p className="flex-1 text-sm text-muted">{p.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
