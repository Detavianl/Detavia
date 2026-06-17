import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { COMPANY_TYPE, COMPANY_STATUS, euro, DEAL_STAGES } from "@/lib/crm";
import { isDemo, DEMO_COMPANIES, DEMO_CONTACTS, DEMO_DEALS } from "@/lib/demo";

export const dynamic = "force-dynamic";

export default async function BedrijfDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let co: any, contacten: any[] = [], deals: any[] = [];

  if (isDemo()) {
    co = DEMO_COMPANIES.find((x) => x.id === id);
    if (!co) notFound();
    contacten = DEMO_CONTACTS.filter((c) => c.company_id === id);
    deals = DEMO_DEALS.filter((d) => d.company?.naam === co.naam);
  } else {
    const supabase = await createClient();
    const res = await supabase.from("companies").select("*").eq("id", id).single();
    co = res.data; if (!co) notFound();
    const [ct, dl] = await Promise.all([
      supabase.from("contacts").select("*").eq("company_id", id),
      supabase.from("deals").select("id, titel, waarde, stage").eq("company_id", id),
    ]);
    contacten = ct.data ?? []; deals = dl.data ?? [];
  }
  const stageLabel = (k: string) => DEAL_STAGES.find((s) => s.key === k)?.label ?? k;

  return (
    <div className="p-8">
      <Link href="/admin/crm/bedrijven" className="text-sm font-semibold text-cobalt">← Bedrijven</Link>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="display text-3xl">{co.naam}</h1>
        <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm font-bold">{COMPANY_TYPE[co.type] ?? co.type}</span>
        <span className="rounded-full bg-yellow px-3 py-1 text-sm font-bold">{COMPANY_STATUS[co.status] ?? co.status}</span>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="grid gap-6">
          <Section title="Gegevens">
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <Info label="Plaats" value={co.plaats} />
              <Info label="Branche" value={co.branche} />
              <Info label="Website" value={co.website} link />
            </dl>
            {co.notitie && <p className="mt-4 text-sm text-muted">{co.notitie}</p>}
          </Section>

          <Section title="Deals">
            <div className="grid gap-2">
              {deals.map((d: any) => (
                <div key={d.id} className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2 text-sm">
                  <span className="font-semibold">{d.titel}</span>
                  <span className="flex items-center gap-3"><span className="text-cobalt font-bold">{euro(d.waarde)}</span>
                    <span className="rounded-full bg-cobalt px-2 py-0.5 text-xs font-bold text-white">{stageLabel(d.stage)}</span></span>
                </div>
              ))}
              {deals.length === 0 && <p className="text-sm text-muted">Geen deals.</p>}
              <Link href="/admin/crm/deals/nieuw" className="mt-1 text-sm font-bold text-cobalt">+ Nieuwe deal</Link>
            </div>
          </Section>
        </div>

        <Section title="Contactpersonen">
          <div className="grid gap-3">
            {contacten.map((c: any) => (
              <div key={c.id} className="rounded-lg border border-neutral-200 p-3">
                <p className="font-bold">{c.naam}</p>
                <p className="text-sm text-muted">{c.functie}</p>
                <p className="mt-1 text-sm">{c.email}{c.telefoon ? ` · ${c.telefoon}` : ""}</p>
              </div>
            ))}
            {contacten.length === 0 && <p className="text-sm text-muted">Geen contactpersonen.</p>}
            <Link href="/admin/crm/contacten/nieuw" className="text-sm font-bold text-cobalt">+ Nieuw contact</Link>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-2xl border border-neutral-200 bg-white p-6"><h2 className="mb-3 text-lg font-bold">{title}</h2>{children}</section>;
}
function Info({ label, value, link }: { label: string; value?: string | null; link?: boolean }) {
  return (<div><dt className="text-xs uppercase tracking-wide text-muted">{label}</dt>
    <dd className="font-semibold">{value ? (link ? <a href={value} target="_blank" rel="noopener noreferrer" className="text-cobalt">{value}</a> : value) : "—"}</dd></div>);
}
