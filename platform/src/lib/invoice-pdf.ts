import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { ISSUER, euro, totalen, type Invoice } from "@/lib/invoice";

const COBALT = rgb(0, 71 / 255, 255 / 255);
const INK = rgb(0.04, 0.04, 0.05);
const MUTED = rgb(0.45, 0.45, 0.48);

// Genereert een factuur-PDF (A4) in de DetaVia-huisstijl.
export async function buildInvoicePdf(inv: Invoice): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]); // A4 in punten
  const W = 595.28;
  const M = 48; // marge
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const H = page.getHeight();

  // y van boven af
  const text = (s: string, x: number, topY: number, opts: { size?: number; f?: typeof font; color?: any; right?: number } = {}) => {
    const size = opts.size ?? 10;
    const f = opts.f ?? font;
    let x2 = x;
    if (opts.right != null) x2 = opts.right - f.widthOfTextAtSize(s, size);
    page.drawText(s, { x: x2, y: H - topY, size, font: f, color: opts.color ?? INK });
  };

  // ---- kop: cobalt balk ----
  page.drawRectangle({ x: 0, y: H - 8, width: W, height: 8, color: COBALT });
  text("DetaVia", M, 70, { size: 26, f: bold, color: COBALT });
  text("FACTUUR", W - M, 60, { size: 22, f: bold, right: W - M });

  // ---- factuurmeta (rechts) ----
  let ty = 90;
  const meta: [string, string][] = [
    ["Factuurnummer", inv.nummer],
    ["Factuurdatum", inv.factuurdatum],
    ["Vervaldatum", inv.vervaldatum ?? "-"],
  ];
  for (const [k, v] of meta) {
    text(k, W - M - 150, ty, { size: 9, color: MUTED });
    text(v, W - M, ty, { size: 9, f: bold, right: W - M });
    ty += 15;
  }

  // ---- afzender + geadresseerde ----
  let sy = 150;
  text("VAN", M, sy, { size: 8, f: bold, color: MUTED });
  text(ISSUER.naam, M, sy + 16, { size: 11, f: bold });
  text(ISSUER.adres, M, sy + 31, { size: 9 });
  text(ISSUER.postcode_plaats, M, sy + 44, { size: 9 });
  text(`KvK ${ISSUER.kvk}  ·  BTW ${ISSUER.btw}`, M, sy + 60, { size: 8, color: MUTED });

  const cx = W / 2 + 10;
  text("AAN", cx, sy, { size: 8, f: bold, color: MUTED });
  text(inv.bedrijf_naam || "-", cx, sy + 16, { size: 11, f: bold });
  if (inv.bedrijf_email) text(inv.bedrijf_email, cx, sy + 31, { size: 9, color: MUTED });

  // ---- tabel ----
  let row = 250;
  page.drawRectangle({ x: M, y: H - row - 4, width: W - 2 * M, height: 22, color: rgb(0.96, 0.97, 0.99) });
  text("OMSCHRIJVING", M + 8, row + 11, { size: 8, f: bold, color: MUTED });
  text("BEDRAG (excl. btw)", W - M - 8, row + 11, { size: 8, f: bold, color: MUTED, right: W - M - 8 });
  row += 34;
  text(inv.omschrijving || "Dienstverlening", M + 8, row, { size: 10 });
  text(euro(inv.bedrag), W - M - 8, row, { size: 10, right: W - M - 8 });
  row += 14;
  page.drawLine({ start: { x: M, y: H - row }, end: { x: W - M, y: H - row }, thickness: 0.5, color: rgb(0.85, 0.85, 0.88) });

  // ---- totalen ----
  const t = totalen(inv);
  row += 24;
  const totRows: [string, string, boolean][] = [
    ["Subtotaal", euro(t.excl), false],
    [`Btw ${inv.btw_pct}%`, euro(t.btw), false],
    ["Totaal", euro(t.incl), true],
  ];
  for (const [k, v, strong] of totRows) {
    text(k, W - M - 200, row, { size: strong ? 12 : 10, f: strong ? bold : font });
    text(v, W - M - 8, row, { size: strong ? 12 : 10, f: strong ? bold : font, right: W - M - 8, color: strong ? COBALT : INK });
    row += strong ? 4 : 18;
    if (strong) {
      page.drawLine({ start: { x: W - M - 210, y: H - row }, end: { x: W - M, y: H - row }, thickness: 0.5, color: rgb(0.85, 0.85, 0.88) });
    }
  }

  // ---- betaalblok ----
  const py = 640;
  page.drawRectangle({ x: M, y: H - py - 70, width: W - 2 * M, height: 70, color: rgb(0.98, 0.98, 0.99), borderColor: rgb(0.9, 0.9, 0.92), borderWidth: 1 });
  text("Betaalgegevens", M + 14, py + 18, { size: 9, f: bold });
  text(`Gelieve ${euro(t.incl)} te voldoen vóór ${inv.vervaldatum ?? "-"} op ${ISSUER.iban}`, M + 14, py + 34, { size: 9 });
  text(`o.v.v. factuurnummer ${inv.nummer}`, M + 14, py + 48, { size: 9, color: MUTED });

  // ---- voetregel ----
  text(`${ISSUER.naam}  ·  ${ISSUER.adres}, ${ISSUER.postcode_plaats}  ·  ${ISSUER.email}`, M, 800, { size: 8, color: MUTED });

  return pdf.save();
}
