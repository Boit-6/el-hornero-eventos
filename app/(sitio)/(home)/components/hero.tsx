import Image from "next/image";
import Link from "next/link";
import { SALON, SALON_ABOUT } from "@/features/catalog/salon";
import gardenAtNight from "@/public/fotos/jardin-luces.jpg";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-line">
      <Image
        src={gardenAtNight}
        alt="Jardines de El Hornero de noche, con guirnaldas de luces y livings al aire libre"
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-night via-night/75 to-night/40" />

      <div className="mx-auto flex min-h-[78svh] max-w-6xl flex-col justify-end px-4 py-16 sm:px-6 md:py-24">
        {/* El h1 incluye qué es y dónde queda; en el HTML el nombre va primero. */}
        <h1 className="flex max-w-3xl flex-col-reverse gap-4">
          <span className="font-display text-6xl leading-[0.95] font-semibold tracking-tight sm:text-8xl">
            {SALON.name}
          </span>{" "}
          <span className="text-xs font-semibold tracking-[0.3em] text-gold uppercase">
            {SALON.tagline} · Luján de Cuyo, Mendoza
          </span>
        </h1>
        <p className="mt-4 font-display text-2xl text-gold-bright italic sm:text-3xl">{SALON.slogan}</p>
        <p className="mt-6 max-w-xl text-lg text-ivory/85">
          {SALON_ABOUT.heading}. Arma tu fiesta online en pocos minutos y coordinamos una reunión para
          ultimar los detalles.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/armar-tu-fiesta"
            className="inline-flex min-h-12 items-center rounded-full bg-gold px-7 font-semibold text-night transition-[background-color,transform] duration-150 hover:bg-gold-bright active:scale-[0.97]"
          >
            Arma tu fiesta
          </Link>
          <Link
            href="#propuestas"
            className="inline-flex min-h-12 items-center rounded-full border border-ivory/30 px-7 font-semibold transition-[border-color,transform] duration-150 hover:border-gold active:scale-[0.97]"
          >
            Ver propuestas
          </Link>
        </div>
      </div>
    </section>
  );
}
