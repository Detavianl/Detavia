import Link from "next/link";
import { importVacaturesFeed } from "../actions";

export const dynamic = "force-dynamic";

export default async function ImportVacatures({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const toegevoegd = sp.toegevoegd;
  const gevonden = sp.gevonden;
  const overgeslagen = sp.overgeslagen;
  const fout = sp.fout;
  const demo = sp.demo;

  return (
    <div className="p-8">
      <Link href="/admin/vacatures" className="text-sm font-semibold text-cobalt">← Vacatures</Link>
      <h1 className="display mt-2 text-3xl">Vacatures importeren (XML-feed)</h1>
      <p className="mt-2 max-w-2xl text-muted">Importeer vacatures uit een externe XML-feed (Indeed-stijl), bijvoorbeeld van een jobboard of leverancier. Geef een feed-URL op, of plak de XML rechtstreeks.</p>

      {toegevoegd !== undefined && (
        <div className="mt-5 max-w-2xl rounded-xl bg-green-50 p-4 text-sm font-semibold text-green-800">
          Import klaar: {gevonden} vacatures in de feed, {toegevoegd} nieuw toegevoegd.
          {overgeslagen && Number(overgeslagen) > 0 ? ` ${overgeslagen} overgeslagen (buiten het sociaal domein of dubbel).` : ""}
        </div>
      )}
      {fout && <div className="mt-5 max-w-2xl rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700">Er ging iets mis: {fout}</div>}
      {demo && <div className="mt-5 max-w-2xl rounded-xl bg-yellow-50 p-4 text-sm font-semibold text-yellow-800">In demo-modus wordt er niet geimporteerd. Met Supabase gekoppeld werkt dit wel.</div>}

      <form action={importVacaturesFeed} className="mt-8 grid max-w-2xl gap-5">
        <label className="grid gap-1.5">
          <span className="text-sm font-bold">Feed-URL</span>
          <input name="feed_url" type="url" placeholder="https://voorbeeld.nl/vacatures.xml" className="rounded-xl border-2 border-neutral-200 px-4 py-3" />
        </label>
        <div className="text-center text-xs font-bold uppercase tracking-wider text-neutral-400">of plak XML</div>
        <label className="grid gap-1.5">
          <span className="text-sm font-bold">XML</span>
          <textarea name="xml" rows={8} placeholder="<source><job>...</job></source>" className="rounded-xl border-2 border-neutral-200 px-4 py-3 font-mono text-xs" />
        </label>
        <label className="flex items-center gap-2 font-semibold">
          <input type="checkbox" name="alleen_sociaal" defaultChecked className="h-5 w-5 accent-cobalt" />
          Alleen vacatures binnen het sociaal domein importeren (aanbevolen)
        </label>
        <button className="justify-self-start rounded-full bg-cobalt px-6 py-3 font-bold text-white">Importeren</button>
        <p className="text-xs text-muted">Herkent o.a. title, company, city, description, salary, jobtype, hoursperweek en referencenumber. Vakgebied wordt geschat op basis van titel/omschrijving. Dubbele vacatures (zelfde referentie) worden overgeslagen.</p>
      </form>

      <div className="mt-10 max-w-2xl rounded-xl bg-neutral-50 p-5 text-sm">
        <p className="font-bold">Eigen feed exporteren?</p>
        <p className="mt-1 text-muted">DetaVia levert zelf ook een Indeed-compatibele feed van alle open vacatures:</p>
        <a href="/feeds/vacatures.xml" target="_blank" className="mt-2 inline-block font-bold text-cobalt hover:underline">/feeds/vacatures.xml</a>
      </div>
    </div>
  );
}
