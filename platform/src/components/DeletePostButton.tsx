"use client";
import { deletePost } from "@/app/admin/blog/actions";

export default function DeletePostButton({ id }: { id: string }) {
  return (
    <button
      onClick={() => { if (confirm("Dit artikel verwijderen?")) deletePost(id); }}
      className="text-sm font-semibold text-red-600 hover:underline">
      Verwijderen
    </button>
  );
}
