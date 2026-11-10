import Image from "next/image";
import type { EventPage } from "@/features/catalog/event-pages";
import { SectionHeading } from "../../../components/section-heading";
import { EVENT_PHOTOS } from "../utils/event-photos";

export function EventHighlights({ page }: { page: EventPage }) {
  const { gallery } = EVENT_PHOTOS[page.slug];

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <SectionHeading eyebrow={page.label} title="Lo que te ofrece el salón" />
      <ul className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
        {page.highlights.map((highlight) => (
          <li key={highlight.title} className="border-t-2 border-gold pt-4">
            <h3 className="font-display text-2xl font-semibold">{highlight.title}</h3>
            <p className="mt-2 text-muted">{highlight.text}</p>
          </li>
        ))}
      </ul>

      <ul className="mt-16 grid gap-3 sm:grid-cols-3">
        {gallery.map((item) => (
          <li key={item.alt}>
            <Image
              src={item.photo}
              alt={item.alt}
              placeholder="blur"
              sizes="(min-width: 640px) 33vw, 100vw"
              className="aspect-[3/2] w-full rounded-2xl border border-line object-cover"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
