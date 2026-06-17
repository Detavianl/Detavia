import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Niet-publieke delen weren uit de index.
      disallow: ["/admin", "/portaal", "/opdrachtgever", "/login", "/bedankt", "/geen-toegang"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
