"use client";
import { useState, useTransition } from "react";
import { addNote } from "@/app/admin/activity-actions";

type Note = { tekst: string; created_at: string; gebruiker?: string | null };

function formatDatum(iso: string): string {
  try {
    return new Date(iso).toLocaleString("nl-NL", { dateStyle: "short", timeStyle: "short" });
  } catch {
    return iso;
  }
}

// Notities zoals in Workster: lijst bovenaan (auteur + datum/tijd + tekst),
// daaronder een tekstvlak met "Notitie toevoegen" en een tekenteller.
export default function QuickNotes({ entity, entityId, items, currentUser, demo }: {
  entity: "candidate" | "company" | "placement" | "invoice" | "vacature";
  entityId: string;
  items: Note[];
  currentUser: string;
  demo?: boolean;
}) {
  const [notes, setNotes] = useState<Note[]>(items);
  const [tekst, setTekst] = useState("");
  const [pending, start] = useTransition();

  function submit() {
    const t = tekst.trim();
    if (!t) return;
    setNotes((prev) => [{ tekst: t, created_at: new Date().toISOString(), gebruiker: currentUser }, ...prev]);
    setTekst("");
    start(async () => { if (!demo) await addNote(entity, entityId, t); });
  }

  return (
    <div>
      <p className="text-xs text-muted">
        {notes.length} {notes.length === 1 ? "notitie" : "notities"} · zichtbaar voor het hele team.
      </p>

      {/* Lijst */}
      {notes.length > 0 && (
        <ul className="mt-3 space-y-2.5">
          {notes.map((n, i) => (
            <li key={i} className="rounded-xl border border-neutral-200 bg-neutral-50 p-3.5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-bold">{n.gebruiker || "Teamlid"}</p>
                <p className="text-[11px] text-muted">{formatDatum(n.created_at)}</p>
              </div>
              <p className="mt-1.5 whitespace-pre-line text-sm text-ink/90">{n.tekst}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Toevoegen */}
      <div className="mt-4 border-t border-neutral-200 pt-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-muted">Nieuwe notitie</label>
        <textarea
          value={tekst}
          onChange={(e) => setTekst(e.target.value)}
          onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") submit(); }}
          rows={3}
          maxLength={4000}
          placeholder="Bv: Gebeld op 8 juni, kandidaat is geïnteresseerd, tweede gesprek volgende week."
          className="mt-2 w-full resize-y rounded-xl border-2 border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-cobalt"
        />
        <div className="mt-2.5 flex flex-wrap items-center gap-3">
          <button type="button" onClick={submit} disabled={pending || !tekst.trim()}
            className="rounded-full bg-cobalt px-5 py-2 text-sm font-bold text-white disabled:opacity-50">
            {pending ? "Opslaan…" : "Notitie toevoegen"}
          </button>
          <span className="text-xs text-muted">{tekst.length} / 4000</span>
          <span className="text-xs text-muted">Cmd/Ctrl + Enter</span>
        </div>
        {demo && <p className="mt-2 text-xs text-muted">Demo: nieuwe notities worden niet bewaard.</p>}
      </div>
    </div>
  );
}
