import type { StaticImageData } from "next/image";
import type { EventPageSlug } from "@/features/catalog/event-pages";
import welcomeArch from "@/public/fotos/ambientacion-arco.jpg";
import bar from "@/public/fotos/barra.jpg";
import palmEntrance from "@/public/fotos/entrada-palmeras.jpg";
import entranceGallery from "@/public/fotos/galeria-entrada.jpg";
import gardenNight from "@/public/fotos/jardin-noche.jpg";
import tableDetail from "@/public/fotos/mesa-detalle.jpg";
import headTable from "@/public/fotos/mesa-principal.jpg";
import receptionGarden from "@/public/fotos/recepcion-jardin.jpg";
import receptionTable from "@/public/fotos/recepcion-mesa.jpg";
import salonLights from "@/public/fotos/salon-luces.jpg";
import salonTables from "@/public/fotos/salon-mesas.jpg";
import salonPanorama from "@/public/fotos/salon-panoramica.jpg";

type EventPhoto = { photo: StaticImageData; alt: string };

// Solo fotos del lugar: las que muestran invitados no se publican sin permiso del salón.
export const EVENT_PHOTOS: Record<EventPageSlug, { hero: EventPhoto; gallery: ReadonlyArray<EventPhoto> }> = {
  casamientos: {
    hero: { photo: gardenNight, alt: "Jardín de noche con livings blancos y palmeras" },
    gallery: [
      { photo: palmEntrance, alt: "Entrada al salón por un camino de palmeras iluminado" },
      { photo: tableDetail, alt: "Mesa del salón armada con copas, servilletas y mantelería" },
      { photo: receptionGarden, alt: "Recepción servida en el jardín" },
    ],
  },
  "fiestas-de-15": {
    hero: { photo: salonLights, alt: "Salón ambientado con luces y bolas de espejos" },
    gallery: [
      { photo: salonTables, alt: "Mesas redondas vestidas en el salón" },
      { photo: welcomeArch, alt: "Arco de bienvenida decorado con telas, flores y luces" },
      { photo: headTable, alt: "Mesa principal con fondo de luces y sillón" },
    ],
  },
  empresariales: {
    hero: { photo: salonPanorama, alt: "Salón principal armado con mesas redondas, pista central y bolas de espejos" },
    gallery: [
      { photo: bar, alt: "Barra del salón" },
      { photo: receptionTable, alt: "Mesa de recepción con tablas de fiambres y panes" },
      { photo: entranceGallery, alt: "Galería de entrada al salón con techo de madera" },
    ],
  },
};
