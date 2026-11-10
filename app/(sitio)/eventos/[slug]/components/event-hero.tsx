import Image from "next/image";
import Link from "next/link";
import type { EventPage } from "@/features/catalog/event-pages";
import { EVENT_PHOTOS } from "../utils/event-photos";

export function EventHero({ page }: { page: EventPage }) {
  const { hero } = EVENT_PHOTOS[page.slug];

  return (
    <section className="relative isolate overflow-hidden border-b border-line">
      <Image
        src={hero.photo}
        alt={hero.alt}
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-night via-night/80 to-night/50" />

      <div className="mx-auto flex min-h-[60svh] max-w-6xl flex-col justify-end px-4 py-16 sm:px-6 md:py-20">
        <nav aria-label="Migas de pan" className="text-xs font-semibold tracking-[0.3em] text-gold uppercase">
          <Link href="/" className="inline-flex min-h-11 items-center hover:text-gold-bright">
            El Hornero
          </Link>
          <span aria-hidden="true"> · </span>
          <span aria-current="page">{page.label}</span>
        </nav>
        <h1 className="mt-2 max-w-3xl font-display text-5xl leading-none font-semibold tracking-tight text-balance sm:text-6xl">
          {page.heading}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-ivory/85">{page.intro}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/armar-tu-fiesta"
            className="inline-flex min-h-12 items-center rounded-full bg-gold px-7 font-semibold text-night transition-[background-color,transform] duration-150 hover:bg-gold-bright active:scale-[0.97]"
          >
            Arma tu fiesta
          </Link>
          <Link
            href="/#propuestas"
            className="inline-flex min-h-12 items-center rounded-full border border-ivory/30 px-7 font-semibold transition-[border-color,transform] duration-150 hover:border-gold active:scale-[0.97]"
          >
            Ver el menú
          </Link>
        </div>
      </div>
    </section>
  );
}
