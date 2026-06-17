"use client";
import { sendInvoice, markInvoicePaid } from "@/app/admin/facturen/actions";

export default function InvoiceActions({ id, status, demo }: { id: string; status: string; demo?: boolean }) {
  async function verstuur() {
    if (demo) { alert("Demo: in de live-versie wordt de factuur als PDF naar de opdrachtgever gemaild (via Resend)."); return; }
    await sendInvoice(id);
  }
  async function betaald() {
    if (demo) { alert("Demo: niet bewaard."); return; }
    await markInvoicePaid(id);
  }
  return (
    <div className="flex flex-wrap gap-2">
      <a href={`/admin/facturen/${id}/pdf`} target="_blank" rel="noopener noreferrer"
        className="rounded-full border-2 border-neutral-200 bg-white px-5 py-2.5 font-bold hover:border-cobalt">📄 Bekijk / download PDF</a>
      {status !== "betaald" && (
        <button onClick={verstuur} className="rounded-full bg-cobalt px-5 py-2.5 font-bold text-white">
          {status === "verzonden" ? "Opnieuw versturen" : "Versturen"}
        </button>
      )}
      {status === "verzonden" && (
        <button onClick={betaald} className="rounded-full bg-black px-5 py-2.5 font-bold text-white">Markeer als betaald</button>
      )}
    </div>
  );
}
