"use client";
import { useState } from "react";
import { addContactMoment } from "@/app/admin/activity-actions";

const TYPES: [string, string][] = [
  ["telefoon", "📞 Telefoon"], ["email", "✉️ E-mail"], ["gesprek", "🤝 Gesprek"], ["afspraak", "📅 Afspraak"],
];
const LABEL: Record<string, string> = Object.fromEntries(TYPES);

type Item = { type: string; tekst: string; met?: string | null; created_at: string; gebruiker?: string | null };

export default function ContactMoments({ entity, entityId, contacts, items, currentUser, demo }: {
  entity: "candidate" | "company";
  entityId: string;
  contacts?: { id: string; naam: string }[];
  items: Item[];
  currentUser: string;
  demo?: boolean;
}) {
  const [type, setType] = useState("telefoon");
  const [contactId, setContactId] = useState("");
  const [tekst, setTekst] = useState("");
  const [list, setList] = useState<Item[]>(items);
  const [bezig, setBezig] = useState(false);

  async function add() {
    if (!tekst.trim()) return;
    setBezig(true);
    const met = contacts?.find((c) => c.id === contactId)?.naam ?? null;
    setList([{ type, tekst, met, created_at: today(), gebruiker: currentUser }, ...list]);
    if (!demo) await addContactMoment(entity, entityId, contactId || null, type, tekst);
    setTekst(""); setBezig(false);
  }

  return (
    <div>
      <div className="grid gap-2">
        <div className="flex flex-wrap gap-2">
          <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-lg border-2 border-neutral-200 px-2 py-2 text-sm font-semibold">
            {TYPES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
          {contacts && contacts.length > 0 && (
            <select value={contactId} onChange={(e) => setContactId(e.target.value)} className="rounded-lg border-2 border-neutral-200 px-2 py-2 text-sm font-semibold">
              <option value="">met wie?</option>
              {contacts.map((c) => <option key={c.id} value={c.id}>{c.naam}</option>)}
            </select>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <input value={tekst} onChange={(e) => setTekst(e.target.value)} placeholder="Wat is er besproken?"
            className="min-w-[200px] flex-1 rounded-lg border-2 border-neutral-200 px-3 py-2 text-sm" onKeyDown={(e) => e.key === "Enter" && add()} />
          <button onClick={add} disabled={bezig} className="rounded-full bg-cobalt px-4 py-2 text-sm font-bold text-white disabled:opacity-60">Vastleggen</button>
        </div>
      </div>
      <ol className="mt-5 grid gap-3 border-l-2 border-neutral-100 pl-4">
        {list.map((a, i) => (
          <li key={i} className="relative">
            <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-cobalt" />
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted">
              <span className="font-bold">{LABEL[a.type] ?? a.type}</span>
              {a.met && <><span>·</span><span>met {a.met}</span></>}
              <span>·</span><span>{a.created_at}</span>
              {a.gebruiker && <><span>·</span><span className="font-semibold">{a.gebruiker}</span></>}
            </div>
            <p className="text-sm">{a.tekst}</p>
          </li>
        ))}
        {list.length === 0 && <li className="text-sm text-muted">Nog geen contactmomenten.</li>}
      </ol>
      {demo && <p className="mt-3 text-xs text-muted">Demo: nieuwe items worden niet bewaard.</p>}
    </div>
  );
}

function today() {
  return new Date().toISOString().slice(0, 10);
}
