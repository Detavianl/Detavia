import { pageMeta } from "@/lib/seo";
export const metadata = pageMeta({ title: "Algemene voorwaarden", description: "De algemene voorwaarden van DetaVia B.V. voor detachering en bemiddeling in het sociaal domein.", path: "/algemene-voorwaarden" });

export default function AlgemeneVoorwaarden() {
  return (
    <article className="mx-auto max-w-[820px] px-5 py-16 sm:px-10">
      <h1 className="display text-4xl sm:text-5xl">Algemene voorwaarden DetaVia B.V.</h1>
      <p className="mt-3 text-sm text-muted">Laatst geüpdatet op 22-08-2025</p>

      <div className="prose-detavia mt-8">
        <h2>Artikel 1 – Definities</h2>
        <p>In deze algemene voorwaarden worden de volgende begrippen gehanteerd:</p>
        <ul>
          <li><strong>DetaVia B.V.</strong>: ingeschreven bij de Kamer van Koophandel te Almere onder nummer 93289979.</li>
          <li><strong>Opdrachtgever</strong>: de natuurlijke of rechtspersoon die personeel inleent.</li>
          <li><strong>Kandidaat</strong>: de persoon die zich inschrijft voor detachering of bemiddeling.</li>
          <li><strong>Detachering</strong>: het inlenen van personeel voor bepaalde tijd tegen overeengekomen voorwaarden.</li>
          <li><strong>Professional</strong>: degene die de werkzaamheden uitvoert onder opdracht van DetaVia.</li>
        </ul>

        <h2>Artikel 2 – Toepasselijkheid</h2>
        <p>Deze voorwaarden gelden voor alle aanbiedingen en overeenkomsten van DetaVia. Afwijkingen zijn slechts geldig indien deze schriftelijk zijn overeengekomen en gelden uitsluitend voor de betreffende overeenkomst.</p>

        <h2>Artikel 3 – Detachering</h2>
        <p>Belangrijkste bepalingen:</p>
        <ul>
          <li>Detacheringsopdrachten worden schriftelijk bevestigd.</li>
          <li>Uurtarieven zijn exclusief omzetbelasting en inclusief werkgeverslasten.</li>
          <li>Facturatie vindt plaats op basis van de daadwerkelijk gewerkte uren.</li>
          <li>Bij ziekte korter dan acht weken hoeft geen vervanging te worden geleverd.</li>
          <li>DetaVia betaalt de lonen en vrijwaart de opdrachtgever voor aanspraken ter zake.</li>
          <li>De opdrachtgever is aansprakelijk voor de veiligheid op zijn locatie.</li>
        </ul>
        <p><strong>Overname van personeel.</strong> Bij overname van gedetacheerd personeel is de opdrachtgever aan DetaVia een vergoeding verschuldigd:</p>
        <ul>
          <li>€ 25.000,- exclusief btw indien minder dan 2.000 uren zijn gewerkt;</li>
          <li>dit bedrag wordt verlaagd met € 5.000,- per 520 extra gewerkte uren boven 2.000 uren;</li>
          <li>de minimale vergoeding bedraagt € 5.000,-.</li>
        </ul>

        <h2>Artikel 4 – Alle overeenkomsten</h2>
        <p>Betalingsvoorwaarden:</p>
        <ul>
          <li>Betaling vindt plaats binnen veertien dagen na factuurdatum.</li>
          <li>Bezwaren tegen een factuur moeten binnen acht dagen schriftelijk worden ingediend.</li>
          <li>Bij overschrijding van de betalingstermijn is een vertragingsrente van 1,5% per maand verschuldigd.</li>
          <li>Incassokosten bedragen 15% van het openstaande factuurbedrag.</li>
        </ul>
        <p>Op alle overeenkomsten is Nederlands recht van toepassing. Geschillen worden voorgelegd aan de bevoegde rechter.</p>
      </div>
    </article>
  );
}
