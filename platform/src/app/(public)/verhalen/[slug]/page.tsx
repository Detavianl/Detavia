import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function VerhaalDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post: any = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("blog_posts").select("*").eq("slug", slug).eq("status", "gepubliceerd").single();
    post = data;
  } catch { /* niet gekoppeld */ }
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-[760px] px-5 py-16 sm:px-10">
      <Link href="/verhalen" className="text-sm font-semibold text-cobalt">← Verhalen</Link>
      <span className="mt-6 block text-xs font-bold uppercase tracking-wider text-cobalt">{post.categorie}</span>
      <h1 className="display mt-2 text-4xl sm:text-5xl">{post.titel}</h1>
      {post.cover_path && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.cover_path} alt="" className="mt-8 aspect-[16/9] w-full rounded-[22px] object-cover" />
      )}
      <div className="prose-detavia mt-8" dangerouslySetInnerHTML={{ __html: post.content_html }} />
    </article>
  );
}
