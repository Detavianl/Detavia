"use client";
import { useState } from "react";
import { addActivity } from "@/app/admin/kandidaten/actions";
import { addCompanyActivity } from "@/app/admin/crm/actions";

const TYPES: [string, string][] = [
  ["notitie", "📝 Notitie"], ["telefoon", "📞 Telefoon"], ["email", "✉️ E-mail"],
  ["gesprek", "🤝 Gesprek"], ["voorstel", "📤 Voorstel"], ["afspraak", "📅 Afspraak"],
];
const LABEL: Record<string, string> = Object.fromEntries(TYPES);

type Item = { type: string; inhoud: string; created_at: string; gebruiker?: string | null };

export default function ActivityTimeline({ entity, entityId, items, currentUser, demo }: {
  entity: "candidate" | "company";
  entityId: string;
  items: Item[];
  currentUser: string;
  demo?: boolean;
}) {
  const [type, setType] = useState("notitie");
  const [inhoud, setInhoud] = useState("");
  const [list, setList] = useState<Item[]>(items);
  const [bezig, setBezig] = useState(false);

  async function add() {
    if (!inhoud.trim()) return;
    setBezig(true);
    const entry: Item = { type, inhoud, created_at: today(), gebruiker: currentUser };
    setList([entry, ...list]);
    if (!demo) {
      if (entity === "candidate") await addActivity(entityId, type, inhoud);
      else await addCompanyActivity(entityId, type, inhoud);
    }
    setInhoud(""); setBezig(false);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-lg border-2 border-neutral-200 px-2 py-2 text-sm font-semibold">
          {TYPES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
        <input value={inhoud} onChange={(e) => setInhoud(e.target.value)} placeholder="Contactmoment of notitie vastleggen…"
          className="min-w-[200px] flex-1 rounded-lg border-2 border-neutral-200 px-3 py-2 text-sm" onKeyDown={(e) => e.key === "Enter" && add()} />
        <button onClick={add} disabled={bezig} className="rounded-full bg-cobalt px-4 py-2 text-sm font-bold text-white disabled:opacity-60">Toevoegen</button>
      </div>
      <ol className="mt-5 grid gap-3 border-l-2 border-neutral-100 pl-4">
        {list.map((a, i) => (
          <li key={i} className="relative">
            <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-cobalt" />
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted">
              <span className="font-bold">{LABEL[a.type] ?? a.type}</span>
              <span>·</span><span>{a.created_at}</span>
              {a.gebruiker && <><span>·</span><span className="font-semibold">{a.gebruiker}</span></>}
            </div>
            <p className="text-sm">{a.inhoud}</p>
          </li>
        ))}
        {list.length === 0 && <li className="text-sm text-muted">Nog geen contactmomenten of notities.</li>}
      </ol>
      {demo && <p className="mt-3 text-xs text-muted">Demo: nieuwe items worden niet bewaard.</p>}
    </div>
  );
}

function today() {
  return new Date().toISOString().slice(0, 10);
}
