"use client";
import { useState } from "react";
import { updateCandidateNote } from "@/app/admin/kandidaten/actions";

export default function NoteForm({ id, initial }: { id: string; initial: string }) {
  const [value, setValue] = useState(initial);
  const [status, setStatus] = useState("");
  async function save() {
    setStatus("Opslaan…");
    await updateCandidateNote(id, value);
    setStatus("Opgeslagen ✓");
    setTimeout(() => setStatus(""), 1500);
  }
  return (
    <div>
      <textarea value={value} onChange={(e) => setValue(e.target.value)} rows={4}
        className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3" placeholder="Interne notitie…" />
      <div className="mt-2 flex items-center gap-3">
        <button onClick={save} className="rounded-full bg-cobalt px-4 py-2 text-sm font-bold text-white">Notitie opslaan</button>
        <span className="text-sm text-muted">{status}</span>
      </div>
    </div>
  );
}
