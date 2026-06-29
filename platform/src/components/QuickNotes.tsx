"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addNote, editNote, deleteNote } from "@/app/admin/activity-actions";

type Entity = "candidate" | "company" | "placement" | "vacature";
type Note = { id?: string; tekst: string; created_at: string; gebruiker?: string | null; mine?: boolean };

function formatDatum(iso: string): string {
  try {
    return new Date(iso).toLocaleString("nl-NL", { dateStyle: "short", timeStyle: "short" });
  } catch {
    return iso;
  }
}

export default function QuickNotes({ entity, entityId, items, currentUser, demo }: {
  entity: Entity;
  entityId: string;
  items: Note[];
  currentUser: string;
  demo?: boolean;
}) {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>(items);
  const [tekst, setTekst] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editTekst, setEditTekst] = useState("");
  const [pending, start] = useTransition();

  function add() {
    const t = tekst.trim();
    if (!t) return;
    setNotes((prev) => [{ tekst: t, created_at: new Date().toISOString(), gebruiker: currentUser, mine: true }, ...prev]);
    setTekst("");
    start(async () => { if (!demo) { await addNote(entity, entityId, t); router.refresh(); } });
  }

  function bewaarEdit(id: string) {
    const t = editTekst.trim();
    if (!t) return;
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, tekst: t } : n)));
    setEditId(null);
    start(async () => { if (!demo) { await editNote(entity, entityId, id, t); router.refresh(); } });
  }

  function verwijder(id: string) {
    if (!confirm("Deze notitie verwijderen?")) return;
    setNotes((prev) => prev.filter((n) => n.id !== id));
    start(async () => { if (!demo) { await deleteNote(entity, entityId, id); router.refresh(); } });
  }

  return (
    <div>
      <p className="text-xs text-muted">{notes.length} {notes.length === 1 ? "notitie" : "notities"} · zichtbaar voor het hele team.</p>

      {notes.length > 0 && (
        <ul className="mt-3 space-y-2.5">
          {notes.map((n, i) => (
            <li key={n.id ?? i} className="rounded-xl border border-neutral-200 bg-neutral-50 p-3.5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-bold">{n.gebruiker || "Teamlid"}</p>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-muted">{formatDatum(n.created_at)}</span>
                  {n.mine && n.id && editId !== n.id && (
                    <span className="flex gap-2 text-[11px] font-bold">
                      <button onClick={() => { setEditId(n.id!); setEditTekst(n.tekst); }} className="text-cobalt hover:underline">Bewerk</button>
                      <button onClick={() => verwijder(n.id!)} className="text-red-500 hover:underline">Verwijder</button>
                    </span>
                  )}
                </div>
              </div>
              {editId === n.id ? (
                <div className="mt-2">
                  <textarea value={editTekst} onChange={(e) => setEditTekst(e.target.value)} rows={3}
                    className="w-full resize-y rounded-lg border-2 border-neutral-200 px-3 py-2 text-sm outline-none focus:border-cobalt" />
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => bewaarEdit(n.id!)} disabled={pending} className="rounded-full bg-cobalt px-4 py-1.5 text-xs font-bold text-white disabled:opacity-50">Opslaan</button>
                    <button onClick={() => setEditId(null)} className="rounded-full border-2 border-neutral-200 px-4 py-1.5 text-xs font-bold">Annuleren</button>
                  </div>
                </div>
              ) : (
                <p className="mt-1.5 whitespace-pre-line text-sm text-ink/90">{n.tekst}</p>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 border-t border-neutral-200 pt-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-muted">Nieuwe notitie</label>
        <textarea
          value={tekst}
          onChange={(e) => setTekst(e.target.value)}
          onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") add(); }}
          rows={3}
          maxLength={4000}
          placeholder="Bv: Gebeld op 8 juni, kandidaat is geïnteresseerd, tweede gesprek volgende week."
          className="mt-2 w-full resize-y rounded-xl border-2 border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-cobalt"
        />
        <div className="mt-2.5 flex flex-wrap items-center gap-3">
          <button type="button" onClick={add} disabled={pending || !tekst.trim()}
            className="rounded-full bg-cobalt px-5 py-2 text-sm font-bold text-white disabled:opacity-50">Notitie toevoegen</button>
          <span className="text-xs text-muted">{tekst.length} / 4000</span>
          <span className="text-xs text-muted">Cmd/Ctrl + Enter</span>
        </div>
        {demo && <p className="mt-2 text-xs text-muted">Demo: nieuwe notities worden niet bewaard.</p>}
      </div>
    </div>
  );
}
