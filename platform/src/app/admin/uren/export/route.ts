import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-context";
import { isDemo, DEMO_HOURS, DEMO_PLACEMENTS, DEMO_CANDIDATES } from "@/lib/demo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function csvCell(v: any) {
  const s = String(v ?? "");
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(req: Request) {
  await requireAdmin();
  const placement = new URL(req.url).searchParams.get("placement");

  let rows: { professional: string; functie: string; datum: string; uren: number; status: string; omschrijving: string }[];
  if (isDemo()) {
    const naam = (cid: string) => DEMO_CANDIDATES.find((c) => c.id === cid)?.naam ?? "";
    rows = DEMO_HOURS.filter((h) => !placement || h.placement_id === placement).map((h) => {
      const p = DEMO_PLACEMENTS.find((x) => x.id === h.placement_id);
      return { professional: p ? naam(p.candidate_id) : "", functie: p?.functie ?? "", datum: h.datum, uren: h.uren, status: h.status, omschrijving: h.omschrijving };
    });
  } else {
    const supabase = await createClient();
    let q = supabase.from("hours").select("datum, uren, status, omschrijving, placement:placements(functie, candidate:candidates(naam))").order("datum");
    if (placement) q = q.eq("placement_id", placement);
    const { data } = await q;
    rows = (data ?? []).map((h: any) => ({ professional: h.placement?.candidate?.naam ?? "", functie: h.placement?.functie ?? "", datum: h.datum, uren: h.uren, status: h.status, omschrijving: h.omschrijving }));
  }

  const header = ["Professional", "Functie", "Datum", "Uren", "Status", "Omschrijving"];
  const lines = [header.join(";"), ...rows.map((r) => [r.professional, r.functie, r.datum, r.uren, r.status, r.omschrijving].map(csvCell).join(";"))];
  const csv = "﻿" + lines.join("\r\n"); // BOM voor Excel

  return new NextResponse(csv, {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="uren-export.csv"` },
  });
}
