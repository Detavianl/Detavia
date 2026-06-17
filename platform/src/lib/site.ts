// Centrale site-config voor SEO. Zet NEXT_PUBLIC_SITE_URL in Vercel zodra er een
// eigen domein is (bv. https://www.detavia.nl); anders valt hij terug op de Vercel-URL.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://detavia.vercel.app").replace(/\/$/, "");

export const SITE_NAME = "DetaVia";
export const SITE_TAGLINE = "Specialist in het sociaal domein";
export const SITE_DESCRIPTION =
  "DetaVia is uitsluitend gespecialiseerd in het sociaal domein. Wij verbinden professionals in Wmo, Jeugd, Participatie en Schuldhulpverlening met opdrachtgevers, en ontzorgen volledig.";
