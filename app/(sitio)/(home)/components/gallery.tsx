import Image from "next/image";
import bar from "@/public/fotos/barra.jpg";
import sign from "@/public/fotos/cartel-el-hornero.jpg";
import palmEntrance from "@/public/fotos/entrada-palmeras.jpg";
import entranceGallery from "@/public/fotos/galeria-entrada.jpg";
import gardenLounge from "@/public/fotos/jardin-livings.jpg";
import gardenNight from "@/public/fotos/jardin-noche.jpg";
import headTable from "@/public/fotos/mesa-principal.jpg";
import receptionGarden from "@/public/fotos/recepcion-jardin.jpg";
import receptionNight from "@/public/fotos/recepcion-noche.jpg";
import receptionTable from "@/public/fotos/recepcion-mesa.jpg";
import salonLights from "@/public/fotos/salon-luces.jpg";
import salonTables from "@/public/fotos/salon-mesas.jpg";
import tourPoster from "@/public/fotos/video-recorrido-portada.jpg";
import { SectionHeading } from "../../components/section-heading";

const PHOTOS = [
  { photo: palmEntrance, alt: "Entrada al salón por un camino de palmeras iluminado" },
  { photo: salonLights, alt: "Salón ambientado con luces y bolas de espejos" },
  { photo: receptionTable, alt: "Mesa de recepción con tablas de fiambres y panes" },
  { photo: gardenLounge, alt: "Livings en el jardín bajo guirnaldas de luces" },
  { photo: headTable, alt: "Mesa principal con fondo de luces y sillón" },
  { photo: sign, alt: "Cartel de El Hornero Eventos sobre un cerco verde" },
  { photo: salonTables, alt: "Mesas redondas vestidas en el salón" },
  { photo: gardenNight, alt: "Jardín de noche con livings blancos y palmeras" },
  { photo: bar, alt: "Barra del salón" },
  { photo: entranceGallery, alt: "Galería de entrada al salón con techo de madera" },
  { photo: receptionGarden, alt: "Recepción servida en el jardín" },
  { photo: receptionNight, alt: "Mesa de recepción al aire libre junto al salón iluminado" },
];

const TOUR_VIDEO_URL = "/videos/recorrido-salon.mp4";

export function Gallery() {
  return (
    <section id="galeria" className="scroll-mt-20 border-y border-line bg-coal">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHeading eyebrow="Galería" title="Fotos del salón y los jardines" />
        <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3">
          {/* Video vertical: en pantallas anchas ocupa una columna y tres filas de fotos. */}
          <li className="relative col-span-2 mx-auto w-full max-w-xs md:col-span-1 md:row-span-3 md:max-w-none">
            <video
              controls
              playsInline
              preload="none"
              poster={tourPoster.src}
              aria-label="Recorrido en video por El Hornero: entrada, jardines y salón de noche"
              className="aspect-[9/16] w-full rounded-2xl bg-night object-cover md:absolute md:inset-0 md:aspect-auto md:h-full"
            >
              <source src={TOUR_VIDEO_URL} type="video/mp4" />
            </video>
          </li>
          {PHOTOS.map((item) => (
            <li key={item.alt}>
              <Image
                src={item.photo}
                alt={item.alt}
                placeholder="blur"
                sizes="(min-width: 768px) 33vw, 50vw"
                className="aspect-[3/2] w-full rounded-2xl object-cover"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
