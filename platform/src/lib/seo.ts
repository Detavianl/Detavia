import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site";

const OG_IMAGE = "/img/office-worker-960x640.jpg";

// Consistente per-pagina metadata: zelfverwijzende canonical + unieke OpenGraph/
// Twitter (titel + url per pagina), met behoud van het standaard og-beeld.
// De <title> krijgt via de root-template automatisch " | DetaVia"; daarom hier
// de titel ZONDER merknaam doorgeven.
export function pageMeta(opts: { title: string; description: string; path: string }): Metadata {
  const { title, description, path } = opts;
  const ogTitle = `${title} | ${SITE_NAME}`;
  const url = `${SITE_URL}${path}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "nl_NL",
      siteName: SITE_NAME,
      url,
      title: ogTitle,
      description,
      images: [{ url: OG_IMAGE, width: 960, height: 640, alt: `${SITE_NAME}, sociaal domein` }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [OG_IMAGE],
    },
  };
}
