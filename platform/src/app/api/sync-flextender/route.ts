import { createAdminClient } from "@/lib/supabase/admin";
import { fetchFlextenderRows } from "@/lib/flextender";

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

  let gesynct = 0;
  if (rows.length) {
    const { data, error } = await supabase
      .from("flextender_opdrachten")
      .upsert(rows.map((r) => ({ ...r, synced_at: new Date().toISOString() })), { onConflict: "avnummer" })
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

  return { gevonden: rows.length, gesynct, verwijderd: verwijderd?.length ?? 0 };
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
