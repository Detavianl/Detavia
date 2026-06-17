"use client";
import { inviteClient } from "@/app/admin/crm/actions";

export default function InviteClientButton({ contactId, uitgenodigd, demo }: { contactId: string; uitgenodigd?: boolean; demo?: boolean }) {
  if (uitgenodigd) return <span className="text-xs font-bold text-green-700">Heeft portaal-toegang</span>;
  return (
    <button
      onClick={() => { if (demo) { alert("Demo: in de live-versie krijgt de opdrachtgever een uitnodiging per e-mail om uren goed te keuren."); return; } inviteClient(contactId); }}
      className="text-xs font-bold text-cobalt hover:underline">
      Nodig uit voor goedkeuren
    </button>
  );
}
