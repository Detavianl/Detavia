"use client";
import { markGelezen } from "@/app/admin/berichten/actions";

export default function GelezenToggle({ id, gelezen }: { id: string; gelezen: boolean }) {
  return (
    <button onClick={() => markGelezen(id, !gelezen)}
      className={`rounded-full px-3 py-1 text-xs font-bold ${gelezen ? "bg-neutral-100 text-muted" : "bg-cobalt text-white"}`}>
      {gelezen ? "Gelezen" : "Markeer gelezen"}
    </button>
  );
}
