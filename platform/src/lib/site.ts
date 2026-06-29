// Centrale site-config voor SEO. Standaard het live domein; te overschrijven met
// NEXT_PUBLIC_SITE_URL in Vercel indien nodig.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.detavia.nl").replace(/\/$/, "");

// Calendly-link voor het boeken van een kennismaking. Zet NEXT_PUBLIC_CALENDLY_URL
// in Vercel (of vervang de fallback) zodra de definitieve Calendly-URL bekend is.
export const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/detavianl/30min";

export const SITE_NAME = "DetaVia";
export const SITE_TAGLINE = "Specialist in het sociaal domein";
export const SITE_DESCRIPTION =
  "DetaVia is uitsluitend gespecialiseerd in het sociaal domein. Wij verbinden professionals in Leerplicht, Werk en inkomen, Participatie en Schuldhulpverlening met opdrachtgevers, en ontzorgen volledig.";
