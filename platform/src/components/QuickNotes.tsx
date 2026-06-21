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
    const t = tekst.trim();
    if (!t) return;
    setBezig(true);
    setList([{ tekst: t, created_at: today(), gebruiker: currentUser }, ...list]);
    setTekst("");
    if (!demo) await addNote(entity, entityId, t);
    setBezig(false);
  }

  return (
    <div>
      {/* Notitie-tekstvlak (meerdere regels), met knop. Cmd/Ctrl+Enter = toevoegen. */}
      <div className="rounded-xl border-2 border-neutral-200 focus-within:border-cobalt">
        <textarea
          value={tekst}
          onChange={(e) => setTekst(e.target.value)}
          onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") add(); }}
          rows={3}
          placeholder="Schrijf een notitie… (meerdere regels mag)"
          className="w-full resize-y rounded-t-xl px-3 py-2.5 text-sm outline-none"
        />
        <div className="flex items-center justify-between gap-2 border-t border-neutral-100 px-3 py-2">
          <span className="text-xs text-muted">Cmd/Ctrl + Enter om toe te voegen</span>
          <button onClick={add} disabled={bezig || !tekst.trim()} className="rounded-full bg-cobalt px-4 py-1.5 text-sm font-bold text-white disabled:opacity-50">
            Notitie toevoegen
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        {list.map((nt, i) => (
          <div key={i} className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
            <p className="whitespace-pre-wrap text-sm">{nt.tekst}</p>
            <p className="mt-1.5 text-xs text-muted">{nt.created_at}{nt.gebruiker ? ` · ${nt.gebruiker}` : ""}</p>
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
