"use client";
import { deleteHours } from "@/app/portaal/actions";

export default function DeleteHoursButton({ id }: { id: string }) {
  return (
    <button onClick={() => { if (confirm("Deze urenregel verwijderen?")) deleteHours(id); }}
      className="text-xs font-semibold text-red-600 hover:underline">Verwijderen</button>
  );
}
