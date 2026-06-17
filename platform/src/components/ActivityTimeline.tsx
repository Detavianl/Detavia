"use client";
import { useState } from "react";
import { addActivity } from "@/app/admin/kandidaten/actions";

const TYPES: [string, string][] = [
  ["notitie", "📝 Notitie"], ["telefoon", "📞 Telefoon"], ["email", "✉️ E-mail"],
  ["gesprek", "🤝 Gesprek"], ["voorstel", "📤 Voorstel"],
];
const LABEL: Record<string, string> = Object.fromEntries(TYPES);

export default function ActivityTimeline({ candidateId, items, demo }: {
  candidateId: string;
  items: { type: string; inhoud: string; created_at: string }[];
  demo?: boolean;
}) {
  const [type, setType] = useState("notitie");
  const [inhoud, setInhoud] = useState("");
  const [list, setList] = useState(items);
  const [bezig, setBezig] = useState(false);

  async function add() {
    if (!inhoud.trim()) return;
    setBezig(true);
    const entry = { type, inhoud, created_at: new Date().toISOString().slice(0, 10) };
    setList([entry, ...list]);
    if (!demo) await addActivity(candidateId, type, inhoud);
    setInhoud(""); setBezig(false);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-lg border-2 border-neutral-200 px-2 py-2 text-sm font-semibold">
          {TYPES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
        <input value={inhoud} onChange={(e) => setInhoud(e.target.value)} placeholder="Contactmoment vastleggen…"
          className="min-w-[200px] flex-1 rounded-lg border-2 border-neutral-200 px-3 py-2 text-sm" onKeyDown={(e) => e.key === "Enter" && add()} />
        <button onClick={add} disabled={bezig} className="rounded-full bg-cobalt px-4 py-2 text-sm font-bold text-white disabled:opacity-60">Toevoegen</button>
      </div>
      <ol className="mt-5 grid gap-3 border-l-2 border-neutral-100 pl-4">
        {list.map((a, i) => (
          <li key={i} className="relative">
            <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-cobalt" />
            <div className="flex items-center gap-2 text-xs text-muted">
              <span className="font-bold">{LABEL[a.type] ?? a.type}</span><span>·</span><span>{a.created_at}</span>
            </div>
            <p className="text-sm">{a.inhoud}</p>
          </li>
        ))}
        {list.length === 0 && <li className="text-sm text-muted">Nog geen contactmomenten.</li>}
      </ol>
      {demo && <p className="mt-3 text-xs text-muted">Demo: nieuwe items worden niet bewaard.</p>}
    </div>
  );
}
