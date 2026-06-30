import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { pageMeta } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("blog_posts").select("titel, excerpt").eq("slug", slug).eq("status", "gepubliceerd").single();
    if (data) return pageMeta({ title: data.titel, description: data.excerpt || `${data.titel} - een verhaal van DetaVia.`, path: `/verhalen/${slug}` });
  } catch { /* niet gekoppeld */ }
  return { title: "Verhaal niet gevonden" };
}

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
        <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-[22px]">
          <Image src={post.cover_path} alt="" fill sizes="(max-width: 768px) 100vw, 760px" className="object-cover" />
        </div>
      )}
      <div className="prose-detavia mt-8" dangerouslySetInnerHTML={{ __html: post.content_html }} />
    </article>
  );
}
