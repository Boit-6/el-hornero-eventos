import type { MetadataRoute } from "next";
import { EVENT_PAGES, toEventPagePath } from "@/features/catalog/event-pages";
import { SITE_URL } from "@/features/catalog/site-url";

// Solo las páginas que queremos en buscadores: /privacidad queda fuera (noindex).
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/armar-tu-fiesta`, changeFrequency: "monthly", priority: 0.8 },
    ...EVENT_PAGES.map((page) => ({
      url: `${SITE_URL}${toEventPagePath(page.slug)}`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
