import { createAdminClient } from "@/lib/supabase/admin";
import { fetchSociaalDomein } from "@/lib/flextender";
import { slugify } from "@/lib/blog";
import sanitizeHtml from "sanitize-html";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const BRON = "flextender";

function authorized(req: Request) {
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();
  const auth = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "").trim();
  return key.length > 10 && auth === key;
}

async function sync() {
  const opdrachten = await fetchSociaalDomein(40);
  const supabase = createAdminClient();

  const rows = opdrachten.map((o) => ({
    titel: o.titel,
    slug: `${slugify(o.titel)}-fl${o.aanvraagnr}`,
    bron: BRON,
    extern_id: o.aanvraagnr,
    vakgebied: o.vakgebied || "wmo",
    plaats: o.plaats,
    uren_min: o.uren_min,
    uren_max: o.uren_max,
    salaris_min: null as number | null,
    salaris_max: null as number | null,
    type: "Detachering",
    top: false,
    status: "open",
    omschrijving: o.omschrijving,
    taken: sanitizeHtml(o.taken, { allowedTags: ["p", "br", "ul", "ol", "li", "strong", "em"], allowedAttributes: {} }),
    eisen: o.eisen,
    opdrachtgever: o.opdrachtgever,
    startdatum: o.startdatum,
    duur: o.duur,
  }));

  let toegevoegd = 0;
  if (rows.length > 0) {
    const { data, error } = await supabase
      .from("vacatures")
      .upsert(rows, { onConflict: "slug" })
      .select("id");
    if (error) throw new Error(error.message);
    toegevoegd = data?.length ?? 0;
  }

  // Verwijder Flextender-vacatures die niet meer in de feed staan.
  const huidige = opdrachten.map((o) => o.aanvraagnr);
  const selectQ = supabase.from("vacatures").select("id").eq("bron", BRON);
  const { data: bestaand } = huidige.length
    ? await selectQ.not("extern_id", "in", `(${huidige.join(",")})`)
    : await selectQ;
  const teVerwijderen = (bestaand ?? []).map((r: { id: string }) => r.id);
  if (teVerwijderen.length) {
    await supabase.from("vacatures").delete().in("id", teVerwijderen);
  }

  return { gevonden: opdrachten.length, gesynct: toegevoegd, verwijderd: teVerwijderen.length };
}

export async function POST(req: Request) {
  if (!authorized(req)) return Response.json({ error: "unauthorized" }, { status: 401 });
  try {
    const result = await sync();
    return Response.json({ ok: true, ...result });
  } catch (e) {
    return Response.json({ ok: false, error: e instanceof Error ? e.message : "fout" }, { status: 500 });
  }
}

// GET met dezelfde auth, zodat je het ook handmatig kunt triggeren.
export async function GET(req: Request) {
  return POST(req);
}
