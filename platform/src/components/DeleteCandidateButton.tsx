"use client";
import { useTransition } from "react";
import { deleteCandidate } from "@/app/admin/kandidaten/actions";

export default function DeleteCandidateButton({ id, naam, klein }: { id: string; naam: string; klein?: boolean }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => { if (confirm(`Kandidaat "${naam}" definitief verwijderen? Dit kan niet ongedaan worden gemaakt.`)) start(() => deleteCandidate(id)); }}
      className={klein
        ? "text-xs font-bold text-red-500 hover:underline disabled:opacity-50"
        : "rounded-full border-2 border-red-300 px-5 py-2 font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"}
    >
      {pending ? "Bezig…" : "Verwijderen"}
    </button>
  );
}
