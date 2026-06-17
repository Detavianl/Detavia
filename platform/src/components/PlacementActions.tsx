"use client";
import { factureerUren, inviteProfessional } from "@/app/admin/plaatsingen/actions";
import { euro } from "@/lib/crm";

export default function PlacementActions({ placementId, candidateId, uren, bedrag, uitgenodigd, demo }: {
  placementId: string; candidateId: string; uren: number; bedrag: number; uitgenodigd: boolean; demo?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => { if (uren <= 0) { alert("Geen goedgekeurde, ongefactureerde uren."); return; } factureerUren(placementId); }}
        disabled={uren <= 0}
        className="rounded-full bg-cobalt px-5 py-2.5 font-bold text-white disabled:opacity-50">
        Factureer {uren} uur ({euro(bedrag)})
      </button>
      {!uitgenodigd && (
        <button
          onClick={() => { if (demo) { alert("Demo: in de live-versie krijgt de professional een uitnodiging per e-mail."); return; } inviteProfessional(candidateId); }}
          className="rounded-full border-2 border-cobalt px-5 py-2.5 font-bold text-cobalt">
          Nodig professional uit
        </button>
      )}
      {uitgenodigd && <span className="self-center rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">Heeft toegang tot portaal</span>}
    </div>
  );
}
