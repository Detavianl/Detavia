import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isDemo, DEMO_CONTACTS, DEMO_COMPANIES } from "@/lib/demo";

export const dynamic = "force-dynamic";

export default async function ContactenPage() {
  let contacten: any[];
  if (isDemo()) {
    const naam = (id: string) => DEMO_COMPANIES.find((c) => c.id === id)?.naam ?? "—";
    contacten = DEMO_CONTACTS.map((c) => ({ ...c, company: { naam: naam(c.company_id) } }));
  } else {
    const supabase = await createClient();
    const { data } = await supabase.from("contacts").select("id, naam, functie, email, telefoon, company:companies(naam)").order("naam");
    contacten = data ?? [];
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div><h1 className="display text-3xl">Contactpersonen</h1><p className="mt-1 text-muted">{contacten.length} contacten</p></div>
        <Link href="/admin/crm/contacten/nieuw" className="rounded-full bg-cobalt px-5 py-2.5 font-bold text-white">Nieuw contact</Link>
      </div>
      <div className="mt-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-muted">
            <tr><th className="px-5 py-3">Naam</th><th className="px-5 py-3">Functie</th><th className="px-5 py-3">Opdrachtgever</th><th className="px-5 py-3">Contact</th></tr>
          </thead>
          <tbody>
            {contacten.map((c) => (
              <tr key={c.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                <td className="px-5 py-3 font-bold">{c.naam}</td>
                <td className="px-5 py-3">{c.functie || "—"}</td>
                <td className="px-5 py-3">{c.company?.naam ?? "—"}</td>
                <td className="px-5 py-3">{c.email}{c.telefoon ? <span className="text-muted"> · {c.telefoon}</span> : ""}</td>
              </tr>
            ))}
            {contacten.length === 0 && <tr><td colSpan={4} className="px-5 py-10 text-center text-muted">Nog geen contactpersonen.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
