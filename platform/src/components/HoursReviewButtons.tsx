"use client";
import { approveHours, rejectHours } from "@/app/admin/uren/actions";

export default function HoursReviewButtons({ id }: { id: string }) {
  return (
    <div className="flex gap-2">
      <button onClick={() => approveHours(id)} className="rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white">Goedkeuren</button>
      <button onClick={() => { if (confirm("Afkeuren?")) rejectHours(id); }} className="rounded-full bg-neutral-200 px-3 py-1 text-xs font-bold">Afkeuren</button>
    </div>
  );
}
