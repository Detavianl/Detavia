import { createClient } from "@/lib/supabase/server";
import AtsBoard from "@/components/AtsBoard";
import type { AtsCard } from "@/lib/ats";
import { isDemo } from "@/lib/demo";
import { demoApplications } from "@/lib/demo-store";

export const dynamic = "force-dynamic";

export default async function AtsPage() {
  let cards: AtsCard[];
  if (isDemo()) {
    cards = demoApplications();
  } else {
    const supabase = await createClient();
    const { data } = await supabase
      .from("applications")
      .select("id, stage, positie, notitie, candidate:candidates(id, naam, vakgebied, woonplaats), vacature:vacatures(titel)")
      .order("positie", { ascending: true });
    cards = (data ?? []) as unknown as AtsCard[];
  }

  return (
    <div className="p-8">
      <h1 className="display text-3xl">ATS</h1>
      <p className="mt-1 text-muted">Sleep kandidaten door de pijplijn.</p>
      <div className="mt-8">
        <AtsBoard initial={cards} />
      </div>
    </div>
  );
}
