import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/site";
import { loadVacatures } from "@/lib/vacatures";

export const dynamic = "force-dynamic";

const STATIC_ROUTES = [
  { path: "", priority: 1.0 },
  { path: "/vacatures", priority: 0.9 },
  { path: "/voor-opdrachtgevers", priority: 0.9 },
  { path: "/voor-opdrachtgevers/onze-diensten", priority: 0.7 },
  { path: "/voor-opdrachtgevers/vakgebieden", priority: 0.7 },
  { path: "/voor-opdrachtgevers/werving-selectie", priority: 0.7 },
  { path: "/voor-opdrachtgevers/certificering-cao", priority: 0.7 },
  { path: "/professionals/werken-bij-detavia", priority: 0.7 },
  { path: "/professionals/academy", priority: 0.7 },
  { path: "/professionals/zzp", priority: 0.7 },
  { path: "/over-ons", priority: 0.7 },
  { path: "/verhalen", priority: 0.7 },
  { path: "/contact", priority: 0.6 },
  { path: "/solliciteren", priority: 0.6 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: r.priority,
  }));

  // Open vacatures dynamisch toevoegen.
  try {
    for (const v of await loadVacatures()) {
      entries.push({
        url: `${SITE_URL}/vacatures/${v.slug ?? v.id}`,
        lastModified: v.datum ? new Date(v.datum) : now,
        changeFrequency: "daily",
        priority: 0.8,
      });
    }
  } catch {
    // geen DB: vacatures overslaan
  }

  // Gepubliceerde blogverhalen dynamisch toevoegen.
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("slug, published_at, updated_at")
      .eq("status", "gepubliceerd");
    for (const p of data ?? []) {
      entries.push({
        url: `${SITE_URL}/verhalen/${p.slug}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : (p.published_at ? new Date(p.published_at) : now),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  } catch {
    // Geen database/keys: alleen statische routes in de sitemap.
  }

  return entries;
}
