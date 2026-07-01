"use client";
import { useState } from "react";
import { updateFollowup } from "@/app/admin/kandidaten/actions";
import { updateCompanyFollowup } from "@/app/admin/crm/actions";

type Team = { user_id: string; naam: string };

export default function FollowupForm({ id, eigenaar, actie, datum, team, demo, entity = "candidate", canEditOwner = true }: {
  id: string; eigenaar: string; actie: string; datum: string; team: Team[]; demo?: boolean;
  entity?: "candidate" | "company"; canEditOwner?: boolean;
}) {
  const [e, setE] = useState(eigenaar);
  const [a, setA] = useState(actie);
  const [d, setD] = useState(datum);
  const [status, setStatus] = useState("");

  async function save() {
    setStatus("Opslaan…");
    if (!demo) {
      if (entity === "company") await updateCompanyFollowup(id, e, a, d);
      else await updateFollowup(id, e, a, d);
    }
    setStatus("Opgeslagen ✓");
    setTimeout(() => setStatus(""), 1500);
  }

  return (
    <div className="grid gap-3">
      <label className="grid gap-1.5">
        <span className="text-xs font-bold uppercase tracking-wide text-muted">Eigenaar</span>
        <select value={e} onChange={(ev) => setE(ev.target.value)} disabled={!canEditOwner} className="rounded-lg border-2 border-neutral-200 px-3 py-2 disabled:bg-neutral-50 disabled:text-muted">
          <option value="">— niemand —</option>
          {team.map((t) => <option key={t.user_id} value={t.user_id}>{t.naam}</option>)}
        </select>
        {!canEditOwner && <span className="text-xs text-muted">Alleen een super-admin kan de eigenaar wijzigen.</span>}
      </label>
      <label className="grid gap-1.5">
        <span className="text-xs font-bold uppercase tracking-wide text-muted">Volgende actie</span>
        <input value={a} onChange={(ev) => setA(ev.target.value)} placeholder="bijv. Terugbellen over opdracht X"
          className="rounded-lg border-2 border-neutral-200 px-3 py-2" />
      </label>
      <label className="grid gap-1.5">
        <span className="text-xs font-bold uppercase tracking-wide text-muted">Op datum</span>
        <input type="date" value={d} onChange={(ev) => setD(ev.target.value)} className="rounded-lg border-2 border-neutral-200 px-3 py-2" />
      </label>
      <div className="flex items-center gap-3">
        <button onClick={save} className="rounded-full bg-cobalt px-4 py-2 text-sm font-bold text-white">Opslaan</button>
        <span className="text-sm text-muted">{status}</span>
      </div>
      {demo && <p className="text-xs text-muted">Demo: niet bewaard.</p>}
    </div>
  );
}
