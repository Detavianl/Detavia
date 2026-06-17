import Link from "next/link";
import BlogEditor from "@/components/BlogEditor";
import { savePost } from "@/app/admin/blog/actions";
import { CATEGORIEEN } from "@/lib/blog";

type Post = { id?: string; titel?: string; categorie?: string; excerpt?: string; content_html?: string; status?: string };

export default function BlogForm({ post }: { post?: Post }) {
  return (
    <div className="p-8">
      <Link href="/admin/blog" className="text-sm font-semibold text-cobalt">← Blog</Link>
      <h1 className="display mt-2 text-3xl">{post?.id ? "Artikel bewerken" : "Nieuw artikel"}</h1>

      <form action={savePost} className="mt-8 grid max-w-3xl gap-5">
        {post?.id && <input type="hidden" name="id" value={post.id} />}
        <label className="grid gap-1.5">
          <span className="text-sm font-bold">Titel</span>
          <input name="titel" required defaultValue={post?.titel ?? ""} className="rounded-xl border-2 border-neutral-200 px-4 py-3 text-lg" />
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-1.5">
            <span className="text-sm font-bold">Categorie</span>
            <select name="categorie" defaultValue={post?.categorie ?? "Verhaal"} className="rounded-xl border-2 border-neutral-200 bg-white px-4 py-3">
              {CATEGORIEEN.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm font-bold">Status</span>
            <select name="status" defaultValue={post?.status ?? "concept"} className="rounded-xl border-2 border-neutral-200 bg-white px-4 py-3">
              <option value="concept">Concept</option>
              <option value="gepubliceerd">Gepubliceerd</option>
            </select>
          </label>
        </div>
        <label className="grid gap-1.5">
          <span className="text-sm font-bold">Samenvatting (excerpt)</span>
          <textarea name="excerpt" rows={2} defaultValue={post?.excerpt ?? ""} className="rounded-xl border-2 border-neutral-200 px-4 py-3" />
        </label>
        <div>
          <span className="mb-1.5 block text-sm font-bold">Inhoud</span>
          <BlogEditor initial={post?.content_html ?? ""} />
        </div>
        <button className="justify-self-start rounded-full bg-cobalt px-6 py-3 font-bold text-white">Opslaan</button>
      </form>
    </div>
  );
}
