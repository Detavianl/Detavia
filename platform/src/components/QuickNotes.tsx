"use client";
import { useState } from "react";
import { addNote } from "@/app/admin/activity-actions";

type Note = { tekst: string; created_at: string; gebruiker?: string | null };

export default function QuickNotes({ entity, entityId, items, currentUser, demo }: {
  entity: "candidate" | "company";
  entityId: string;
  items: Note[];
  currentUser: string;
  demo?: boolean;
}) {
  const [tekst, setTekst] = useState("");
  const [list, setList] = useState<Note[]>(items);
  const [bezig, setBezig] = useState(false);

  async function add() {
    if (!tekst.trim()) return;
    setBezig(true);
    setList([{ tekst, created_at: today(), gebruiker: currentUser }, ...list]);
    if (!demo) await addNote(entity, entityId, tekst);
    setTekst(""); setBezig(false);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <input value={tekst} onChange={(e) => setTekst(e.target.value)} placeholder="Snelle notitie (bv. meeting verplaatst, no-show)…"
          className="min-w-[200px] flex-1 rounded-lg border-2 border-neutral-200 px-3 py-2 text-sm" onKeyDown={(e) => e.key === "Enter" && add()} />
        <button onClick={add} disabled={bezig} className="rounded-full bg-cobalt px-4 py-2 text-sm font-bold text-white disabled:opacity-60">Notitie</button>
      </div>
      <div className="mt-4 grid gap-2">
        {list.map((nt, i) => (
          <div key={i} className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
            <p className="text-sm">{nt.tekst}</p>
            <p className="mt-1 text-xs text-muted">{nt.created_at}{nt.gebruiker ? ` · ${nt.gebruiker}` : ""}</p>
          </div>
        ))}
        {list.length === 0 && <p className="text-sm text-muted">Nog geen notities.</p>}
      </div>
      {demo && <p className="mt-3 text-xs text-muted">Demo: nieuwe notities worden niet bewaard.</p>}
    </div>
  );
}

function today() {
  return new Date().toISOString().slice(0, 10);
}
