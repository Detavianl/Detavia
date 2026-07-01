"use client";
import { useState } from "react";
import { saveSchalen } from "@/app/admin/instellingen/schalen/actions";
import type { Schaal } from "@/lib/schalen-util";

// Excel-achtige matrix: schalen als kolommen, tredes als rijen, per cel het
// bruto maandbedrag. Kolommen (schalen) en rijen (tredes) zijn toe te voegen
// en te verwijderen. Waarden staan op positie [rij][kolom].
export default function SchalenEditor({ initial, canEdit }: { initial: Schaal[]; canEdit: boolean }) {
  const schalen0 = [...new Set(initial.map((s) => s.schaal))].sort((a, b) => a - b);
  const tredes0 = [...new Set(initial.map((s) => s.trede))].sort((a, b) => a - b);
  // Redelijke startopzet als er nog niets is ingevuld.
  const initSchalen = schalen0.length ? schalen0 : [1, 2, 3];
  const initTredes = tredes0.length ? tredes0 : [1, 2, 3, 4, 5];

  const [schalen, setSchalen] = useState<number[]>(initSchalen);
  const [tredes, setTredes] = useState<number[]>(initTredes);
  const [vals, setVals] = useState<string[][]>(
    initTredes.map((t) => initSchalen.map((s) => {
      const b = initial.find((x) => x.schaal === s && x.trede === t)?.bruto_maand;
      return b == null ? "" : String(b);
    })),
  );
  const [status, setStatus] = useState("");
  const [bezig, setBezig] = useState(false);

  function setCel(ri: number, ci: number, v: string) {
    setVals((m) => m.map((row, r) => (r === ri ? row.map((c, k) => (k === ci ? v : c)) : row)));
  }
  function setSchaal(ci: number, v: string) {
    setSchalen((s) => s.map((x, i) => (i === ci ? Number(v) : x)));
  }
  function setTrede(ri: number, v: string) {
    setTredes((t) => t.map((x, i) => (i === ri ? Number(v) : x)));
  }
  function schaalErbij() {
    setSchalen((s) => [...s, (s.length ? Math.max(...s) : 0) + 1]);
    setVals((m) => m.map((row) => [...row, ""]));
  }
  function tredeErbij() {
    setTredes((t) => [...t, (t.length ? Math.max(...t) : 0) + 1]);
    setVals((m) => [...m, schalen.map(() => "")]);
  }
  function schaalWeg(ci: number) {
    setSchalen((s) => s.filter((_, i) => i !== ci));
    setVals((m) => m.map((row) => row.filter((_, i) => i !== ci)));
  }
  function tredeWeg(ri: number) {
    setTredes((t) => t.filter((_, i) => i !== ri));
    setVals((m) => m.filter((_, i) => i !== ri));
  }

  // Normaliseert een uit Excel geplakte waarde naar een puntgetal-string:
  // "€ 2.850" -> "2850", "2.850,50" -> "2850.50", "3.100" -> "3100", "2,5" -> "2.5".
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

  // Plakt een tab/enter-gescheiden blok (zoals uit Excel) vanaf cel [ri0][ci0]
  // en breidt kolommen (schalen) en rijen (tredes) uit waar nodig.
  function plakVanaf(ri0: number, ci0: number, text: string) {
    const grid = text.replace(/\r/g, "").replace(/\n+$/, "").split("\n").map((r) => r.split("\t"));
    const nRows = grid.length, nCols = Math.max(...grid.map((r) => r.length));
    const newSchalen = [...schalen];
    while (newSchalen.length < ci0 + nCols) newSchalen.push((newSchalen.length ? Math.max(...newSchalen) : 0) + 1);
    const newTredes = [...tredes];
    while (newTredes.length < ri0 + nRows) newTredes.push((newTredes.length ? Math.max(...newTredes) : 0) + 1);
    const newVals = newTredes.map((_, r) => newSchalen.map((__, c) => vals[r]?.[c] ?? ""));
    for (let r = 0; r < nRows; r++)
      for (let c = 0; c < grid[r].length; c++)
        newVals[ri0 + r][ci0 + c] = normNum(grid[r][c]);
    setSchalen(newSchalen); setTredes(newTredes); setVals(newVals);
  }

  function onPasteCel(e: React.ClipboardEvent, ri: number, ci: number) {
    const text = e.clipboardData.getData("text");
    if (!text) return;
    e.preventDefault();
    plakVanaf(ri, ci, text);
  }

  async function opslaan() {
    setBezig(true); setStatus("Opslaan…");
    const rijen = tredes.flatMap((t, ri) =>
      schalen.map((s, ci) => ({ schaal: s, trede: t, bruto_maand: vals[ri][ci] === "" ? null : Number(vals[ri][ci]) })),
    );
    try {
      await saveSchalen(rijen);
      setStatus("Opgeslagen ✓");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Opslaan mislukt");
    }
    setBezig(false);
    setTimeout(() => setStatus(""), 2500);
  }

  const cel = "w-28 rounded-lg border-2 border-neutral-200 px-2 py-1.5 text-right tabular-nums";

  return (
    <div>
      <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white p-4">
        <table className="border-separate border-spacing-1">
          <thead>
            <tr>
              <th className="sticky left-0 bg-white px-2 text-left text-xs font-bold uppercase tracking-wide text-muted">Trede \ Schaal</th>
              {schalen.map((s, ci) => (
                <th key={ci} className="px-1">
                  <div className="flex flex-col items-center gap-1">
                    <input type="number" value={s} disabled={!canEdit} onChange={(e) => setSchaal(ci, e.target.value)}
                      className="w-20 rounded-lg bg-cobalt px-2 py-1 text-center font-bold text-white disabled:opacity-70" />
                    {canEdit && <button onClick={() => schaalWeg(ci)} className="text-[11px] font-semibold text-red-500 hover:underline">verwijder</button>}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tredes.map((t, ri) => (
              <tr key={ri}>
                <th className="sticky left-0 bg-white pr-1">
                  <div className="flex items-center gap-1">
                    <input type="number" value={t} disabled={!canEdit} onChange={(e) => setTrede(ri, e.target.value)}
                      className="w-16 rounded-lg bg-neutral-100 px-2 py-1 text-center font-bold disabled:opacity-70" />
                    {canEdit && <button onClick={() => tredeWeg(ri)} className="text-[11px] font-semibold text-red-500 hover:underline">×</button>}
                  </div>
                </th>
                {schalen.map((_, ci) => (
                  <td key={ci}>
                    <input type="number" step="0.01" inputMode="decimal" value={vals[ri]?.[ci] ?? ""} disabled={!canEdit}
                      onChange={(e) => setCel(ri, ci, e.target.value)} onPaste={(e) => canEdit && onPasteCel(e, ri, ci)} placeholder="—" className={cel} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {canEdit && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button onClick={schaalErbij} className="rounded-full border-2 border-cobalt px-4 py-2 text-sm font-bold text-cobalt">+ Schaal (kolom)</button>
          <button onClick={tredeErbij} className="rounded-full border-2 border-cobalt px-4 py-2 text-sm font-bold text-cobalt">+ Trede (rij)</button>
          <button onClick={opslaan} disabled={bezig} className="rounded-full bg-cobalt px-6 py-2.5 font-bold text-white disabled:opacity-60">{bezig ? "Bezig…" : "Opslaan"}</button>
          <span className="text-sm font-semibold text-muted">{status}</span>
        </div>
      )}
      {canEdit && <p className="mt-3 text-xs text-muted">Tip: kopieer een blok cellen uit Excel en plak (Ctrl/Cmd+V) in de eerste cel, dan wordt het hele blok overgenomen (het raster groeit automatisch mee). Vergeet niet op Opslaan te klikken.</p>}
      {!canEdit && <p className="mt-4 text-sm text-muted">Alleen een super-admin kan de schalen bijwerken.</p>}
    </div>
  );
}
