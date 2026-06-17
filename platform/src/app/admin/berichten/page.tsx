import { createClient } from "@/lib/supabase/server";
import GelezenToggle from "@/components/GelezenToggle";
import { isDemo, DEMO_MESSAGES } from "@/lib/demo";

export const dynamic = "force-dynamic";

export default async function Berichten() {
  let berichten: any[];
  if (isDemo()) {
    berichten = DEMO_MESSAGES;
  } else {
    const supabase = await createClient();
    const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    berichten = data ?? [];
  }

  return (
    <div className="p-8">
      <h1 className="display text-3xl">Berichten</h1>
      <p className="mt-1 text-muted">{berichten.filter((b) => !b.gelezen).length} ongelezen</p>
      <div className="mt-8 grid gap-3">
        {berichten.map((b) => (
          <div key={b.id} className={`rounded-2xl border bg-white p-5 ${b.gelezen ? "border-neutral-200" : "border-cobalt"}`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="font-bold">{b.naam}</span>
                <span className="ml-2 text-sm text-muted">{b.email}{b.telefoon ? ` · ${b.telefoon}` : ""}</span>
                <span className="ml-2 rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-semibold">{b.soort}</span>
              </div>
              <GelezenToggle id={b.id} gelezen={b.gelezen} />
            </div>
            {b.bericht && <p className="mt-3 whitespace-pre-wrap text-sm text-muted">{b.bericht}</p>}
          </div>
        ))}
        {berichten.length === 0 && <p className="text-muted">Nog geen berichten.</p>}
      </div>
    </div>
  );
}
