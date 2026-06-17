import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-context";
import { buildInvoicePdf } from "@/lib/invoice-pdf";
import { isDemo, DEMO_INVOICES } from "@/lib/demo";
import type { Invoice } from "@/lib/invoice";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;

  let inv: Invoice | null = null;
  if (isDemo()) {
    inv = DEMO_INVOICES.find((x) => x.id === id) ?? null;
  } else {
    const supabase = await createClient();
    const { data } = await supabase.from("invoices").select("*").eq("id", id).single();
    inv = (data as Invoice) ?? null;
  }
  if (!inv) return new NextResponse("Niet gevonden", { status: 404 });

  const bytes = await buildInvoicePdf(inv);
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${inv.nummer}.pdf"`,
    },
  });
}
