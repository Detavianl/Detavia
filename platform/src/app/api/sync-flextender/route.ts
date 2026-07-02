import { createAdminClient } from "@/lib/supabase/admin";
import { fetchFlextenderRows, structureerViaAI, hashVan, opdrachtNaarVacature, type AiStructuur } from "@/lib/flextender";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Toegestaan als: (1) de Authorization-bearer de service-role key of CRON_SECRET
// is, of (2) de aanroep van Vercel Cron komt (user-agent vercel-cron). De route
// ververst alleen publieke data uit de officiële Flextender-API (laag risico).
function authorized(req: Request) {
  const bearer = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "").trim();
  const srk = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();
  const cron = (process.env.CRON_SECRET ?? "").trim();
  const ua = (req.headers.get("user-agent") ?? "").toLowerCase();
  if (ua.includes("vercel-cron")) return true;
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

  // Eerst bestaande AI hergebruiken waar de bron niet wijzigde.
  const items = rows.map((r) => ({ r, hash: hashVan("v3|" + (r.opdracht ?? "") + "|" + (r.omschrijving ?? "")) }));
  for (const { r, hash } of items) {
    const prev = oud.get(r.avnummer);
    if (prev?.ai_json && prev.bron_hash === hash) r.ai_json = prev.ai_json;
  }

  // De rest via Haiku, maar met een limiet per aanroep zodat we binnen de
  // serverless-tijdslimiet blijven (herhaald aanroepen vult de rest).
  const teDoen = items.filter(({ r }) => !r.ai_json);
  const LIMIET = 8, CONC = 4;
  const nu_verwerken = teDoen.slice(0, LIMIET);
  let aiNieuw = 0;
  for (let i = 0; i < nu_verwerken.length; i += CONC) {
    await Promise.all(
      nu_verwerken.slice(i, i + CONC).map(async ({ r }) => {
        const ai = await structureerViaAI(r.opdracht, r.omschrijving ?? "");
        if (ai) { r.ai_json = ai; aiNieuw++; }
      }),
    );
  }
  const resterend = items.filter(({ r }) => !r.ai_json).length;

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

  // Opruimen cache: alles wat niet meer in de feed staat (gesloten/vervallen).
  const huidige = rows.map((r) => r.avnummer);
  const q = supabase.from("flextender_opdrachten").delete();
  const { data: verwijderd } = huidige.length
    ? await q.not("avnummer", "in", `(${huidige.join(",")})`).select("avnummer")
    : await q.gte("avnummer", 0).select("avnummer");

  // Projecteren naar de vacatures-tabel: als echte, bewerkbare vacatures.
  // Handmatig bewerkte vacatures worden NIET overschreven; opdrachten die uit
  // de feed verdwijnen worden verwijderd (weg uit API = weg van de site).
  const { data: bestVac } = await supabase.from("vacatures").select("id, extern_id, handmatig_bewerkt").eq("bron", "flextender");
  const vacMap = new Map((bestVac ?? []).map((x) => [String(x.extern_id), x as { id: string; extern_id: string; handmatig_bewerkt: boolean }]));
  const feedIds = new Set(rows.map((r) => String(r.avnummer)));

  const naarRij = (o: (typeof items)[number]["r"]) => {
    const v = opdrachtNaarVacature(o);
    return {
      titel: v.titel, slug: v.slug ?? null, vakgebied: v.vakgebied, plaats: v.plaats,
      uren_min: v.uren[0], uren_max: v.uren[1],
      salaris_min: v.salaris[0] || null, salaris_max: v.salaris[1] || null, salaris_periode: v.salaris_periode ?? "uur",
      type: v.type, top: false, status: "open",
      omschrijving: v.omschrijving, taken: v.taken ?? null, eisen: v.eisen ?? null,
      opdrachtgever: v.opdrachtgever ?? null, startdatum: v.startdatum ?? null, duur: v.duur ?? null,
      schaal: v.schaal ?? null, inactief_op: v.inactief_op ?? null,
      bron: "flextender", extern_id: String(o.avnummer),
    };
  };

  let vacNieuw = 0, vacUpdate = 0;
  for (let i = 0; i < items.length; i += 10) {
    await Promise.all(items.slice(i, i + 10).map(async ({ r }) => {
      const ex = vacMap.get(String(r.avnummer));
      if (ex?.handmatig_bewerkt) return; // handmatige wijziging behouden
      const rij = naarRij(r);
      if (ex) { await supabase.from("vacatures").update(rij).eq("id", ex.id); vacUpdate++; }
      else { await supabase.from("vacatures").insert(rij); vacNieuw++; }
    }));
  }
  const wegVac = (bestVac ?? []).filter((x) => !feedIds.has(String(x.extern_id))).map((x) => x.id);
  if (wegVac.length) await supabase.from("vacatures").delete().in("id", wegVac);

  return { gevonden: rows.length, gesynct, aiNieuw, resterend, verwijderd: verwijderd?.length ?? 0, vacNieuw, vacUpdate, vacVerwijderd: wegVac.length };
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
