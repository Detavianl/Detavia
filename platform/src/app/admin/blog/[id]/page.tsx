import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BlogForm from "@/components/BlogForm";

export const dynamic = "force-dynamic";

export default async function BewerkArtikel({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("blog_posts").select("*").eq("id", id).single();
  if (!data) notFound();
  return <BlogForm post={data} />;
}
