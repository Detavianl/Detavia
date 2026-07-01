"use client";
import { useState } from "react";
import { zoekAdres } from "@/app/admin/kandidaten/actions";

// Postcode + huisnummer invoeren; straat en woonplaats worden automatisch
// opgezocht (PDOK). De velden blijven bewerkbaar en worden meegestuurd.
export default function AdresVelden({ postcode = "", huisnummer = "", straat = "", woonplaats = "" }: {
  postcode?: string | null; huisnummer?: string | null; straat?: string | null; woonplaats?: string | null;
}) {
  const [pc, setPc] = useState(postcode ?? "");
  const [hn, setHn] = useState(huisnummer ?? "");
  const [str, setStr] = useState(straat ?? "");
  const [wp, setWp] = useState(woonplaats ?? "");
  const [status, setStatus] = useState("");
  const [bezig, setBezig] = useState(false);

  async function zoek() {
    if (!pc.trim() || !hn.trim()) return;
    setBezig(true); setStatus("Adres opzoeken…");
    const res = await zoekAdres(pc, hn);
    setBezig(false);
    if (res && (res.straat || res.woonplaats)) {
      setStr(res.straat); setWp(res.woonplaats); setStatus("Adres gevonden ✓");
    } else {
      setStatus("Niet gevonden, vul straat en woonplaats handmatig in.");
    }
    setTimeout(() => setStatus(""), 3000);
  }

  const inp = "w-full rounded-xl border-2 border-neutral-200 px-4 py-3";
  return (
    <div className="grid gap-5 sm:col-span-2">
      <div className="grid gap-5 sm:grid-cols-[1fr_1fr]">
        <label className="grid min-w-0 gap-1.5"><span className="text-sm font-bold">Postcode</span>
          <input value={pc} onChange={(e) => setPc(e.target.value)} onBlur={zoek} placeholder="1234 AB" className={inp} /></label>
        <label className="grid min-w-0 gap-1.5"><span className="text-sm font-bold">Huisnummer</span>
          <input value={hn} onChange={(e) => setHn(e.target.value)} onBlur={zoek} placeholder="12" className={inp} /></label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid min-w-0 gap-1.5"><span className="text-sm font-bold">Straat</span>
          <input name="straat" value={str} onChange={(e) => setStr(e.target.value)} className={inp} /></label>
        <label className="grid min-w-0 gap-1.5"><span className="text-sm font-bold">Woonplaats</span>
          <input name="woonplaats" value={wp} onChange={(e) => setWp(e.target.value)} className={inp} /></label>
      </div>
      {/* postcode/huisnummer meesturen */}
      <input type="hidden" name="postcode" value={pc} />
      <input type="hidden" name="huisnummer" value={hn} />
      {status && <p className={`text-xs font-semibold ${bezig ? "text-muted" : status.includes("✓") ? "text-green-600" : "text-amber-600"}`}>{status}</p>}
    </div>
  );
}
