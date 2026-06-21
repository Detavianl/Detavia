import { loadVacatures } from "@/lib/vacatures";
import { VAKGEBIEDEN, euro } from "@/lib/vacatures-demo";
import { SITE_URL, SITE_NAME } from "@/lib/site";

export const dynamic = "force-dynamic";

// Indeed-compatibele XML-feed (ook bruikbaar voor andere jobboards die dit
// formaat lezen). Documentatie: Indeed XML Job Feed.
const cdata = (s: string) => `<![CDATA[${String(s ?? "").replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;

export async function GET() {
  const vacatures = await loadVacatures();
  const jobs = vacatures
    .map((v) => {
      const url = `${SITE_URL}/vacatures/${v.slug ?? v.id}`;
      const beschrijving =
        `<p>${v.omschrijving}</p>` +
        (v.taken ? `<p>${v.taken}</p>` : "") +
        (v.eisen && v.eisen.length ? `<p><strong>Wat je meebrengt:</strong></p><ul>${v.eisen.map((e) => `<li>${e}</li>`).join("")}</ul>` : "");
      const salaris = v.salaris[0] > 0 ? `${euro(v.salaris[0])} - ${euro(v.salaris[1])} per maand` : "";
      return `  <job>
    <title>${cdata(v.titel)}</title>
    <date>${cdata(v.datum)}</date>
    <referencenumber>${cdata(v.id)}</referencenumber>
    <url>${cdata(url)}</url>
    <company>${cdata(v.opdrachtgever || SITE_NAME)}</company>
    <city>${cdata(v.plaats)}</city>
    <state>${cdata("")}</state>
    <country>${cdata("NL")}</country>
    <postalcode>${cdata("")}</postalcode>
    <description>${cdata(beschrijving)}</description>
    <salary>${cdata(salaris)}</salary>
    <jobtype>${cdata(v.type)}</jobtype>
    <category>${cdata(VAKGEBIEDEN[v.vakgebied] ?? v.vakgebied)}</category>
    <hoursperweek>${cdata(`${v.uren[0]}-${v.uren[1]}`)}</hoursperweek>
  </job>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<source>
  <publisher>${cdata(SITE_NAME)}</publisher>
  <publisherurl>${cdata(SITE_URL)}</publisherurl>
${jobs}
</source>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=600, s-maxage=600",
    },
  });
}
