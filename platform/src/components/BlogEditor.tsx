"use client";
import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";

export default function BlogEditor({ initial = "" }: { initial?: string }) {
  const [html, setHtml] = useState(initial);
  const editor = useEditor({
    extensions: [StarterKit, Link.configure({ openOnClick: false })],
    content: initial,
    immediatelyRender: false,
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
    editorProps: { attributes: { class: "prose-detavia min-h-[300px] focus:outline-none" } },
  });

  if (!editor) return <div className="min-h-[340px] rounded-xl border-2 border-neutral-200" />;

  const Btn = ({ on, active, children }: { on: () => void; active?: boolean; children: React.ReactNode }) => (
    <button type="button" onClick={on}
      className={`rounded px-2.5 py-1 text-sm font-bold ${active ? "bg-cobalt text-white" : "bg-neutral-100"}`}>{children}</button>
  );

  return (
    <div className="rounded-xl border-2 border-neutral-200">
      <div className="flex flex-wrap gap-1.5 border-b border-neutral-200 p-2">
        <Btn on={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>B</Btn>
        <Btn on={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}><i>I</i></Btn>
        <Btn on={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}>H2</Btn>
        <Btn on={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}>H3</Btn>
        <Btn on={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>• Lijst</Btn>
        <Btn on={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}>&ldquo;</Btn>
        <Btn on={() => {
          const url = window.prompt("Link-URL:");
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }} active={editor.isActive("link")}>Link</Btn>
      </div>
      <div className="p-4"><EditorContent editor={editor} /></div>
      <input type="hidden" name="content_html" value={html} />
    </div>
  );
}
