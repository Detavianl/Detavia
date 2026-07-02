"use client";
import { useState } from "react";
import { updateCompanyStatus } from "@/app/admin/crm/actions";
import { COMPANY_STATUS } from "@/lib/crm";

// Snel de status van een opdrachtgever wijzigen (prospect -> klant enz.).
export default function CompanyStatusSelect({ id, status }: { id: string; status: string }) {
  const [waarde, setWaarde] = useState(status);
  const [bezig, setBezig] = useState(false);
  return (
    <label className="inline-flex items-center gap-2">
      <span className="text-xs font-bold uppercase tracking-wide text-muted">Status</span>
      <select
        value={waarde}
        disabled={bezig}
        onChange={async (e) => {
          const nieuw = e.target.value;
          setWaarde(nieuw); setBezig(true);
          try { await updateCompanyStatus(id, nieuw); } finally { setBezig(false); }
        }}
        className="rounded-lg border-2 border-neutral-200 bg-white px-2 py-1 text-sm font-semibold disabled:opacity-60"
      >
        {Object.entries(COMPANY_STATUS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
      </select>
    </label>
  );
}
