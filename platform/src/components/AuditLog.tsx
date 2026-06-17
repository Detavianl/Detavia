type Entry = { actie: string; details?: string | null; user_naam: string; created_at: string };

const ICON: Record<string, string> = {
  aangemaakt: "✨", gewijzigd: "✏️", verwijderd: "🗑️", "fase gewijzigd": "↔️",
};

export default function AuditLog({ entries }: { entries: Entry[] }) {
  if (!entries.length) return <p className="text-sm text-muted">Nog geen wijzigingen vastgelegd.</p>;
  return (
    <ol className="grid gap-2.5">
      {entries.map((e, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm">
          <span className="mt-0.5">{ICON[e.actie] ?? "•"}</span>
          <div>
            <span className="font-semibold capitalize">{e.actie}</span>
            {e.details ? <span className="text-muted"> — {e.details}</span> : null}
            <div className="text-xs text-muted">{fmt(e.created_at)} · {e.user_naam}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}

function fmt(ts: string) {
  // toont datum + tijd indien aanwezig
  return ts.length > 10 ? ts.slice(0, 16).replace("T", " ") : ts;
}
