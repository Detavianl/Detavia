"use client";
import { useState } from "react";
import { saveTredes } from "@/app/admin/instellingen/schalen/actions";
import { TREDE_KOLOMMEN, type Trede } from "@/lib/schalen-util";

// Excel-achtige tabel met vaste kolommen (trede + kostenkolommen), één rij per
// trede. Rijen toe te voegen/verwijderen en het hele blok is plakbaar vanuit
// Excel. Waarden staan als strings op positie [rij][kolom].
export default function SchalenEditor({ initial, canEdit }: { initial: Trede[]; canEdit: boolean }) {
  const naarCellen = (t: Trede) => TREDE_KOLOMMEN.map((k) => { const v = t[k.key]; return v == null ? "" : String(v); });
  const start: string[][] = initial.length
    ? initial.map(naarCellen)
    : Array.from({ length: 12 }, (_, i) => [String(i), "", "", "", "", "", "", ""]);

  const [rows, setRows] = useState<string[][]>(start);
  const [status, setStatus] = useState("");
  const [bezig, setBezig] = useState(false);

  function setCel(ri: number, ci: number, v: string) {
    setRows((m) => m.map((row, r) => (r === ri ? row.map((c, k) => (k === ci ? v : c)) : row)));
  }
  function rijErbij() {
    const volgende = rows.length ? Math.max(...rows.map((r) => Number(r[0]) || 0)) + 1 : 0;
    setRows((m) => [...m, [String(volgende), "", "", "", "", "", "", ""]]);
  }
  function rijWeg(ri: number) {
    setRows((m) => m.filter((_, i) => i !== ri));
  }

  // "€ 2.850" -> "2850", "2.850,50" -> "2850.50", "44,98" -> "44.98".
  function normNum(raw: string): string {
    const s = raw.replace(/[^\d.,-]/g, "").trim();
    if (!s) return "";
    const hasComma = s.includes(","), hasDot = s.includes(".");
    if (hasComma && hasDot) return s.replace(/\./g, "").replace(",", ".");
    if (hasComma) return s.replace(",", ".");
    if (hasDot) {
      const parts = s.split(".");
      if (parts.length > 1 && parts[parts.length - 1].length === 3) return s.replace(/\./g, "");
    }
    return s;
  }

  function onPaste(e: React.ClipboardEvent, ri0: number, ci0: number) {
    const text = e.clipboardData.getData("text");
    if (!text) return;
    e.preventDefault();
    const grid = text.replace(/\r/g, "").replace(/\n+$/, "").split("\n").map((r) => r.split("\t"));
    setRows((prev) => {
      const nCols = TREDE_KOLOMMEN.length;
      const nieuw = prev.map((r) => [...r]);
      // Voeg rijen toe als het geplakte blok verder reikt dan de tabel.
      while (nieuw.length < ri0 + grid.length) nieuw.push(["", "", "", "", "", "", "", ""]);
      for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length && ci0 + c < nCols; c++) {
          nieuw[ri0 + r][ci0 + c] = normNum(grid[r][c]);
        }
      }
      return nieuw;
    });
  }

  async function opslaan() {
    setBezig(true); setStatus("Opslaan…");
    const rijen = rows
      .map((cells) => {
        const rec = {} as Record<string, number | null>;
        TREDE_KOLOMMEN.forEach((k, i) => { rec[k.key] = cells[i] === "" ? null : Number(cells[i]); });
        return rec;
      })
      .filter((r) => r.trede != null && Number.isFinite(r.trede));
    try {
      await saveTredes(rijen as never);
      setStatus("Opgeslagen ✓");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Opslaan mislukt");
    }
    setBezig(false);
    setTimeout(() => setStatus(""), 2500);
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white p-4">
        <table className="border-separate border-spacing-1 text-sm">
          <thead>
            <tr>
              {TREDE_KOLOMMEN.map((k) => (
                <th key={k.key} className="px-2 pb-2 text-left align-bottom text-xs font-bold uppercase tracking-wide text-muted">{k.label}</th>
              ))}
              {canEdit && <th />}
            </tr>
          </thead>
          <tbody>
            {rows.map((cells, ri) => (
              <tr key={ri}>
                {TREDE_KOLOMMEN.map((k, ci) => (
                  <td key={k.key}>
                    <input
                      type="number" step={k.int ? "1" : "0.01"} inputMode="decimal"
                      value={cells[ci] ?? ""} disabled={!canEdit}
                      onChange={(e) => setCel(ri, ci, e.target.value)}
                      onPaste={(e) => canEdit && onPaste(e, ri, ci)}
                      placeholder="—"
                      className={`${ci === 0 ? "w-20 font-bold" : "w-32"} rounded-lg border-2 border-neutral-200 px-2 py-1.5 text-right tabular-nums disabled:bg-neutral-50`}
                    />
                  </td>
                ))}
                {canEdit && (
                  <td className="pl-1">
                    <button onClick={() => rijWeg(ri)} className="text-xs font-semibold text-red-500 hover:underline">×</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {canEdit ? (
        <>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button onClick={rijErbij} className="rounded-full border-2 border-cobalt px-4 py-2 text-sm font-bold text-cobalt">+ Trede (rij)</button>
            <button onClick={opslaan} disabled={bezig} className="rounded-full bg-cobalt px-6 py-2.5 font-bold text-white disabled:opacity-60">{bezig ? "Bezig…" : "Opslaan"}</button>
            <span className="text-sm font-semibold text-muted">{status}</span>
          </div>
          <p className="mt-3 text-xs text-muted">Tip: kopieer een blok uit Excel en plak (Ctrl/Cmd+V) in de cel waar het blok moet beginnen. Het raster groeit automatisch mee en € / duizend-punt / komma worden omgezet. Vergeet niet op Opslaan te klikken.</p>
        </>
      ) : (
        <p className="mt-4 text-sm text-muted">Alleen een super-admin kan de tabel bijwerken.</p>
      )}
    </div>
  );
}
