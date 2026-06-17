"use client";
import { approveHoursAsClient, rejectHoursAsClient } from "@/app/opdrachtgever/actions";

export default function ClientHoursButtons({ id, demo }: { id: string; demo?: boolean }) {
  return (
    <div className="flex gap-2">
      <button onClick={() => { if (demo) { alert("Demo: niet bewaard."); return; } approveHoursAsClient(id); }}
        className="rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white">Goedkeuren</button>
      <button onClick={() => { if (demo) { alert("Demo: niet bewaard."); return; } if (confirm("Afkeuren?")) rejectHoursAsClient(id); }}
        className="rounded-full bg-neutral-200 px-3 py-1 text-xs font-bold">Afkeuren</button>
    </div>
  );
}
