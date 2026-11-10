import type { Metadata } from "next";
import { SALON } from "@/features/catalog/salon";

type PageMetadataInput = {
  /** Título completo, tal como debe verse al compartir el enlace. */
  title: string;
  description: string;
  /** Ruta de la página, por ejemplo "/armar-tu-fiesta". */
  path: string;
};

// Es app/opengraph-image.jpg. Una página que declara su propio Open Graph
// deja de heredar esa imagen, así que hay que nombrarla de nuevo.
const SHARE_IMAGE = {
  url: "/opengraph-image.jpg",
  width: 1200,
  height: 630,
  alt: `${SALON.name}, salón de eventos en Luján de Cuyo, Mendoza`,
};

/**
 * URL canónica y vista previa para redes de una página pública. Open Graph no
 * se hereda por campo: cada página tiene que declarar el bloque completo.
 */
export function buildPageMetadata({ title, description, path }: PageMetadataInput): Metadata {
  return {
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "es_AR",
      siteName: `${SALON.name} · ${SALON.tagline}`,
      title,
      description,
      url: path,
      images: [SHARE_IMAGE],
    },
    twitter: { card: "summary_large_image", title, description, images: [SHARE_IMAGE] },
  };
}
