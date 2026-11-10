import Image from "next/image";
import welcomeArch from "@/public/fotos/ambientacion-arco.jpg";
import gardenPalm from "@/public/fotos/jardin-palmera.jpg";
import tableDetail from "@/public/fotos/mesa-detalle.jpg";
import receptionBoard from "@/public/fotos/recepcion-tabla.jpg";

const SPACES = [
  {
    title: "Jardines",
    description: "Amplios jardines ideales para eventos al aire libre y momentos inolvidables.",
    photo: gardenPalm,
    alt: "Jardín con palmera iluminada, guirnaldas de luces y livings",
  },
  {
    title: "Salón",
    description: "Ambiente climatizado, vajilla de porcelana, doble copa y mantelería fina.",
    photo: tableDetail,
    alt: "Mesa del salón armada con copas, servilletas y mantelería",
  },
  {
    title: "Gastronomía",
    description: "Propuestas de elaboración propia pensadas para satisfacer todos los gustos.",
    photo: receptionBoard,
    alt: "Tabla de recepción con fiambres, quesos y brusquetas",
  },
  {
    title: "Ambientación",
    description: "Iluminación y efectos de luces para crear ambientes únicos en jardines y salón.",
    photo: welcomeArch,
    alt: "Arco de bienvenida decorado con telas, flores y luces",
  },
];

export function Spaces() {
  return (
    <section className="border-y border-line bg-coal">
      <ul className="mx-auto grid max-w-6xl gap-6 px-4 py-20 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {SPACES.map((space) => (
          <li key={space.title}>
            <Image
              src={space.photo}
              alt={space.alt}
              placeholder="blur"
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="aspect-[3/4] w-full rounded-t-full border border-line object-cover"
            />
            <h3 className="mt-5 text-xs font-semibold tracking-[0.3em] text-gold uppercase">{space.title}</h3>
            <p className="mt-2 text-muted">{space.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
