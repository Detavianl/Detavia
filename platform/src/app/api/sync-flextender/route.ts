import { createAdminClient } from "@/lib/supabase/admin";
import { fetchFlextenderRows, structureerViaAI, hashVan, type AiStructuur } from "@/lib/flextender";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Toegestaan als de Authorization-bearer de service-role key of CRON_SECRET is.
function authorized(req: Request) {
  const bearer = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "").trim();
  const srk = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();
  const cron = (process.env.CRON_SECRET ?? "").trim();
  return (srk.length > 10 && bearer === srk) || (cron.length > 6 && bearer === cron);
}

async function sync() {
  const rows = await fetchFlextenderRows();
  const supabase = createAdminClient();

  // Bestaande AI-output + bron-hash ophalen om alleen nieuw/gewijzigd te verwerken.
  const avnrs = rows.map((r) => r.avnummer);
  const { data: bestaand } = avnrs.length
    ? await supabase.from("flextender_opdrachten").select("avnummer, bron_hash, ai_json").in("avnummer", avnrs)
    : { data: [] as { avnummer: number; bron_hash: string | null; ai_json: AiStructuur | null }[] };
  const oud = new Map((bestaand ?? []).map((b) => [b.avnummer, b]));

  // Per opdracht: hergebruik AI als de bron niet wijzigde, anders opnieuw genereren.
  const items = rows.map((r) => ({ r, hash: hashVan("v2|" + (r.opdracht ?? "") + "|" + (r.omschrijving ?? "")) }));
  let aiNieuw = 0;
  const CONC = 6;
  for (let i = 0; i < items.length; i += CONC) {
    await Promise.all(
      items.slice(i, i + CONC).map(async ({ r, hash }) => {
        const prev = oud.get(r.avnummer);
        if (prev?.ai_json && prev.bron_hash === hash) { r.ai_json = prev.ai_json; return; }
        const ai = await structureerViaAI(r.opdracht, r.omschrijving ?? "");
        if (ai) { r.ai_json = ai; aiNieuw++; }
        else if (prev?.ai_json) { r.ai_json = prev.ai_json; }
      }),
    );
  }

  let gesynct = 0;
  if (rows.length) {
    const nu = new Date().toISOString();
    const payload = items.map(({ r, hash }) => ({ ...r, ai_json: r.ai_json ?? null, bron_hash: hash, synced_at: nu }));
    const { data, error } = await supabase
      .from("flextender_opdrachten")
      .upsert(payload, { onConflict: "avnummer" })
      .select("avnummer");
    if (error) throw new Error(error.message);
    gesynct = data?.length ?? 0;
  }

  // Opruimen: alles wat niet meer in de feed staat (gesloten/vervallen).
  const huidige = rows.map((r) => r.avnummer);
  const q = supabase.from("flextender_opdrachten").delete();
  const { data: verwijderd } = huidige.length
    ? await q.not("avnummer", "in", `(${huidige.join(",")})`).select("avnummer")
    : await q.gte("avnummer", 0).select("avnummer");

  return { gevonden: rows.length, gesynct, aiNieuw, verwijderd: verwijderd?.length ?? 0 };
}

export async function POST(req: Request) {
  if (!authorized(req)) return Response.json({ error: "unauthorized" }, { status: 401 });
  try {
    return Response.json({ ok: true, ...(await sync()) });
  } catch (e) {
    return Response.json({ ok: false, error: e instanceof Error ? e.message : "fout" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  return POST(req);
}
