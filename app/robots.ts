import type { MetadataRoute } from "next";
import { SITE_URL } from "@/features/catalog/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // El panel es privado y los PDF de cada consulta tienen datos personales.
      disallow: ["/panel", "/consultas", "/api"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
