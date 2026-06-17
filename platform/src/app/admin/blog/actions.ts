"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-context";
import { slugify, sanitizeBlog } from "@/lib/blog";

export async function savePost(formData: FormData) {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "").trim();
  const titel = String(formData.get("titel") ?? "").trim();
  if (!titel) throw new Error("Titel is verplicht");

  const fields = {
    titel,
    categorie: String(formData.get("categorie") ?? "Verhaal"),
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    content_html: sanitizeBlog(String(formData.get("content_html") ?? "")),
    status: String(formData.get("status") ?? "concept"),
  };

  if (id) {
    const { error } = await supabase.from("blog_posts").update({
      ...fields,
      published_at: fields.status === "gepubliceerd" ? new Date().toISOString() : null,
    }).eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/blog");
    revalidatePath("/verhalen");
    redirect("/admin/blog");
  } else {
    const slug = `${slugify(titel)}-${Math.random().toString(36).slice(2, 7)}`;
    const { error } = await supabase.from("blog_posts").insert({
      ...fields, slug, author_id: admin.user_id,
      published_at: fields.status === "gepubliceerd" ? new Date().toISOString() : null,
    });
    if (error) throw new Error(error.message);
    revalidatePath("/admin/blog");
    revalidatePath("/verhalen");
    redirect("/admin/blog");
  }
}

export async function deletePost(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/blog");
  revalidatePath("/verhalen");
}
