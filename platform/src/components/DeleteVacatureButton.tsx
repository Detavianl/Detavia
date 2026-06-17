"use client";
import { deleteVacature } from "@/app/admin/vacatures/actions";

export default function DeleteVacatureButton({ id }: { id: string }) {
  return (
    <button onClick={() => { if (confirm("Deze vacature verwijderen?")) deleteVacature(id); }}
      className="text-sm font-semibold text-red-600 hover:underline">Verwijderen</button>
  );
}
